import {Box, Button, Paper, Typography} from '@material-ui/core';
import axios from "axios";
import {createStyles, makeStyles} from '@material-ui/core/styles';
import React, {FormEvent, ReactElement, useEffect, useState} from "react";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import SliderDurationToken from "./SliderDurationToken";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import useInterval from "./utils/useInterval";


// Material UI components CSS
const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            height: 200,
        },
        form: {
            marginTop: 30,
            display: "flex",
            flexDirection: "row",
            justifyContent: 'space-evenly',
            alignItems: "center",
            minWidth: 700,

        },
        slider: {
            minWidth: 200,
            textAlign: "center",
        },
        queueContainer: {
            display: "flex",
            flexDirection: "column",
            marginTop: 20
        },
        queueDiv: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        statusDiv: {
            marginTop: 15
        },
        ghostDiv: {
            width: 210,
        }
    }),
);


interface LoginProps {
    refresh: () => void;
}

interface Users {
    index: number,
    username: string,
    token_minutes: number
}


export default function TakeToken(props: LoginProps): ReactElement {

    const classes = useStyles();


    const [value, setValue] = useState<number | null>(120);
    const [userIsConnected, setUserIsConnected] = useState(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [usersInQueue, setUsersInQueue] = useState<Users[]>([]);
    const [boardList, setBoardList] = useState<any[]>([]);
    const [boardStatus, setBoardStatus] = useState<string[]>([]);
    const [boardNames, setBoardNames] = useState<string[]>([]);


    const updateSliderValue = (value: number | null): void => {
        setValue(value);
    }

    const fetchUser = async (): Promise<void> => {
        const result = await axios(process.env.React_App_URL_API + "reservation/state");
        if (result.data) {
            setUserIsConnected(true);
        }
    }

    const fetchBoardList = async (): Promise<void> => {
        const resultBoardList = await axios(process.env.React_App_URL_API + "board-list");
        if (resultBoardList.data) {
            setBoardList(resultBoardList.data.board_list);
        }
    }

    const fetchBoardsNames = async (): Promise<void> => {
        let boardNamesCopy = [...boardNames];
        if (boardList) {
            await axios.all(boardList.map(l => axios.get("http://" + l + "board")))
                .then(axios.spread(function (...res) {
                        res.map((l, i) => {
                            l.data != null ? boardNamesCopy[i] = l.data.board_name : boardNamesCopy[i] = l.data;
                            return null
                        })
                    }
                ));
            setBoardNames(boardNamesCopy);
        }
    }


    const fetchBoards = async (): Promise<void> => {
        let boardStatusCopy = [...boardStatus];
        if (boardList) {
            await axios.all(boardList.map(l => axios.get("http://" + l + "reservation/state")))
                .then(axios.spread(function (...res) {
                        res.map((l, i) => {
                            l.data != null ? boardStatusCopy[i] = l.data.username : boardStatusCopy[i] = l.data;
                            return null;
                        })
                    }
                ))
            ;
            setBoardStatus(boardStatusCopy);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (e.currentTarget.username.value !== "") {
            (userIsConnected
                ? (axios({
                    method: 'post',
                    url: process.env.React_App_URL_API + "reservation/queue/join",
                    data: {
                        username: e.currentTarget.username.value,
                        token_minutes: value
                    }
                }))
                : (axios({
                    method: 'post',
                    url: process.env.React_App_URL_API + 'reservation/take',
                    data: {
                        username: e.currentTarget.username.value,
                        token_minutes: value
                    }
                })))
                .then(() => {
                    setRefresh(!refresh);
                    props.refresh();
                })
                .catch(err => console.error("ERROR =>" + err))
        }
    }


    const fetchQueue = async (): Promise<void> => {
        const result = await axios(process.env.React_App_URL_API + "reservation/queue/state");
        setUsersInQueue(result.data.queue);
    }

    const valueToHoursMinutes = (value: number | null): string => {
        if (value != null) {
            let hours = Math.trunc(value / 60);
            let minutes = (value % 60).toString().padStart(2, "0");
            return `${hours}h${minutes}m`
        } else {
            return '∞'
        }
    }

    const handleLeaveQueue = (index: number): void => {
        axios({
            method: 'post',
            url: process.env.React_App_URL_API + `reservation/queue/leave/${index}`,
        })
            .then(() => {
                setRefresh(!refresh);
                props.refresh();
            })
            .catch(err => console.error("ERROR =>" + err));
    }

    const listUser = usersInQueue.map((d, index) =>
        <div key={index} className={classes.queueDiv}>
            {index + 1} -- {d.username} -- {valueToHoursMinutes(d.token_minutes)}
            <IconButton aria-label="delete" onClick={() => handleLeaveQueue(index)}>
                <DeleteIcon fontSize="small"/>
            </IconButton>
        </div>
    );

    useEffect((): void => {
            fetchBoardsNames();
            fetchUser();
            fetchQueue();
            fetchBoards();
            fetchBoardList();
            console.log("test memory usage");
        }
        // eslint-disable-next-line
        , [refresh]
    )

    useInterval(
        fetchQueue
        ,
        10000
    );

    return (
        <Grid container direction="column" justifyContent="center" alignItems="center" className={classes.root}>
            < Box className={classes.queueContainer}>
                <Typography variant="h6" gutterBottom component="div">Boards status:</Typography>
                {(boardList)
                    ? boardList.map((d, index) =>
                        <div key={index} className={classes.queueDiv}>
                            {boardNames[index]} -- {boardStatus[index] == null ? "Free" : boardStatus[index].charAt(0).toUpperCase() + boardStatus[index].slice(1)}
                        </div>)
                    : <div className={classes.queueDiv}/>
                }
            </Box>
            <form onSubmit={handleSubmit}>
                <Box className={classes.form}>
                    <TextField type="text" id="outlined-basic" label="Username" name="username" autoFocus={true}
                               variant="outlined"/>
                    <SliderDurationToken getSliderValue={updateSliderValue}/>
                    <Box>
                        {userIsConnected
                            ? <Box>
                                <Button variant="contained" style={{backgroundColor: '#12824C', color: '#FFFFFF'}}
                                        type="submit">Join Queue</Button>
                            </Box>

                            : <Box>
                                <Button type="submit" variant="contained" color="primary">Take
                                    Token</Button>
                            </Box>
                        }
                    </Box>
                </Box>
            </form>
            {usersInQueue.length >= 1
                ? < Box className={classes.queueContainer}>
                    <Typography variant="h6" gutterBottom component="div">Queue:</Typography>
                    {listUser}
                </Box>
                : <Box className={classes.queueContainer}>
                    <Paper elevation={0} className={classes.ghostDiv}/>
                </Box>
            }
        </Grid>
    );
}
