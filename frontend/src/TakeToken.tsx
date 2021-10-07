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
        ghostdiv: {
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

    // @ts-ignore
    let urlOne = process.env.React_App_BOARD.split('');
    let urlTwo = [...urlOne];
    let urlThree = [...urlOne];
    urlOne.splice(7, 0, 'x4-bench');
    urlTwo.splice(7, 0, 'x4-bench-2');
    urlThree.splice(7, 0, 'x5-bench');
    const boardOne = urlOne.join('');
    const boardTwo = urlTwo.join('');
    const boardThree = urlThree.join('');


    const [value, setValue] = useState<number | null>(120);
    const [userIsConnected, setUserIsConnected] = useState(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [usersInQueue, setUsersInQueue] = useState<Users[]>([]);
    const [boardOneStatus, setBoardOneStatus] = useState<string | null>(null);
    const [boardTwoStatus, setBoardTwoStatus] = useState<string | null>(null);
    const [boardThreeStatus, setBoardThreeStatus] = useState<string | null>(null);


    const updateSliderValue = (value: number | null): void => {
        setValue(value);
    }

    const fetchUser = async (): Promise<void> => {
        const result = await axios(process.env.React_App_URL_API + "reservation/state");
        if (result.data) {
            setUserIsConnected(true);
        }
    }

    const fetchBoards = async (): Promise<void> => {
        const fetchOne = await axios(boardOne + "reservation/state");
        const fetchTwo = await axios(boardTwo + "reservation/state");
        const fetchThree = await axios(boardThree + "reservation/state");
        fetchOne.data == null ? setBoardOneStatus(null) : setBoardOneStatus(fetchOne.data.username);
        fetchTwo.data == null ? setBoardTwoStatus(null) : setBoardTwoStatus(fetchTwo.data.username);
        fetchThree.data == null ? setBoardThreeStatus(null) : setBoardThreeStatus(fetchThree.data.username);
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
            fetchUser();
            fetchQueue();
            fetchBoards();
        }
        , [refresh, boardOneStatus, boardTwoStatus, boardThreeStatus]
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
                <div className={classes.statusDiv}>
                    X4 Bench 1: {boardOneStatus == null
                    ? "Free"
                    : <span>{boardOneStatus}</span>
                }
                </div>
                <div className={classes.statusDiv}>
                    X4 Bench 2: {boardTwoStatus == null
                    ? "Free"
                    : <span>{boardTwoStatus}</span>
                }
                </div>
                <div className={classes.statusDiv}>
                    X5 Bench: {boardThreeStatus == null
                    ? "Free"
                    : <span>{boardThreeStatus}</span>
                }
                </div>
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
                    <Paper elevation={0} className={classes.ghostdiv}/>
                </Box>
            }
        </Grid>
    );
}
