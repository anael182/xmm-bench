import React, {FormEvent, ReactElement, useEffect, useState} from 'react';
import {Box, Button, Typography} from '@material-ui/core';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SliderDurationToken from "./SliderDurationToken";
import useInterval from "./utils/useInterval";

let joinQueueButton = window.innerWidth <= 1920 ? "21vh" : "20.2vh"

const useStyles = makeStyles(() =>

    createStyles({
        container: {
            overflow: 'hidden',
            maxHeight: 250
        },
        button: {
            width: 152,
            marginTop: 5,
            maxHeight: 100,
        },
        form: {
            display: "flex",
            flexDirection: "column",
            justifyContent: 'center',
            alignItems: "center",
            minWidth: 700,
            marginTop: 50,
        },
        queueDiv: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        boxOne: {
            width: '9%',
        },
        boxTwo: {
            display: 'block',
            justifyContent: 'center',
            marginLeft: joinQueueButton,
        },
        boxThree: {
            display: 'flex',
            flexDirection: "column",
            justifyContent: 'center',
            width: '19.7%',
            overflowY: 'auto',
        }
    }),
);

interface Users {
    index: number,
    username: string,
    token_minutes: number
}

interface LoginProps {
    refresh: () => void;
}


export default function Queue(props: LoginProps): ReactElement {

    const classes = useStyles();

    const [value, setValue] = useState<number | null>(120);
    const [usersInQueue, setUsersInQueue] = useState<Users[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false)


    const updateSliderValue = (value: number | null): void => {
        setValue(value);
    }


    const handleJoinQueue = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (e.currentTarget.username.value !== "") {
            axios({
                method: 'post',
                url: process.env.React_App_URL_API + "reservation/queue/join",
                data: {username: e.currentTarget.username.value, token_minutes: value}
            })
                .then(() => {
                    setRefresh(!refresh);
                    props.refresh();
                })
                .catch(err => console.error("ERROR =>" + err));
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


    const listUser = usersInQueue.map((d, index) =>
        <div key={index} className={classes.queueDiv}>
            {index + 1} -- {d.username} -- {valueToHoursMinutes(d.token_minutes)}
            <IconButton aria-label="delete" onClick={() => handleLeaveQueue(index)}>
                <DeleteIcon fontSize="small"/>
            </IconButton>
        </div>
    );

    useInterval(
        fetchQueue
        ,
        10000
    );

    useEffect((): void => {
            fetchQueue();
            console.log("memory leak checker");
        }
        , [refresh]
    )

    return (
        <Box display="flex" justifyContent="center" className={classes.container}>
            <Box className={classes.boxOne}/>
            <Box display="flex" className={classes.boxTwo} sx={{flexGrow: 1}}>
                <form onSubmit={handleJoinQueue}>
                    <div className={classes.form}>
                        <TextField id="outlined-basic" label="Username" name="username" autoFocus={true}
                                   variant="outlined"/>
                        <SliderDurationToken getSliderValue={updateSliderValue}/>
                        <Button variant="contained" style={{backgroundColor: '#12824C', color: '#FFFFFF'}}
                                className={classes.button} type="submit">Join Queue</Button>
                    </div>
                </form>
            </Box>
            <Box display="flex" className={classes.boxThree}>
                {usersInQueue.length >= 1
                    ? <div>
                        <Typography variant="h6" gutterBottom component="div">Queue:</Typography>
                        {listUser}
                    </div>
                    : <div/>
                }
            </Box>
        </Box>
    )
}