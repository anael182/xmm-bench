import React from 'react';
import {Button, Box} from '@material-ui/core';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import TextField from "@material-ui/core/TextField";


const useStyles = makeStyles(() =>
    createStyles({
        button: {
            width:150,
            border:'solid 1px solid',
            marginTop:10,
        },
        form:{
            display: "flex",
            flexDirection: "column",
            justifyContent: 'center',
            alignItems: "center",
            minWidth:700,
            marginTop:25,
        },
    }),
);

interface LoginProps {
    refresh: () => void;
}

export default function JoinQueue(props: LoginProps) {

    const classes = useStyles();

    const handleJoinQueue = (e: any): void => {
        e.preventDefault();
            axios({
                method: 'post',
                url: process.env.React_App_URL_API + "reservation/joinq",
                data: {username: e.currentTarget.username.value, token_minutes: '30'}
            })
                .then(() => {
                    props.refresh();
                })
                .catch(err => console.error("ERROR =>" + err));
    }

    return(
        <Box display="flex" justifyContent="center">
            <form onSubmit={handleJoinQueue}>
                <div className={classes.form}>
            <TextField id="outlined-basic" label="Username" name="username" autoFocus={true}
                       variant="outlined"/>
        <Button variant="contained" color='primary' fullWidth={true} className={classes.button} type="submit">Join Queue</Button>
            </div>
            </form>
            </Box>
    )
}