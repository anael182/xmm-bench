import React from 'react';
import {Button, Box} from '@material-ui/core';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import axios from "axios";


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop:5,
            width:150
        }
    }),
);

interface LoginProps {
    refresh: () => void;
}

export default function LeaveQueue(props: LoginProps) {

    const classes = useStyles();

    const handleLeaveQueue = (e: any): void => {
        e.preventDefault();
        axios({
            method: 'post',
            url: process.env.React_App_URL_API + "reservation/leaveq",
        })
            .then(() => {
                props.refresh();
            })
            .catch(err => console.error("ERROR =>" + err));
    }

    return(
        <Box display="flex" justifyContent="center">
        <Button variant="contained" color="secondary" fullWidth={true} className={classes.root} onClick={handleLeaveQueue}>Leave Queue</Button>
            </Box>
    )
}