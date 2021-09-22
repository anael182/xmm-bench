import React, {FormEvent, ReactElement} from 'react';
import {Button} from '@material-ui/core';
import axios from "axios";
import Box from '@material-ui/core/Box';
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: 70,
        }
    }),
);


interface LoginProps {
    refresh: () => void;
}

export default function ReleaseToken(props: LoginProps): ReactElement {

    const classes = useStyles();

    const handleRelease = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: process.env.React_App_URL_API + 'reservation/release',
        })
            .then(() => props.refresh())
            .catch(err => console.error("ERROR =>" + err));
    }


    return (
        <Box display="flex" justifyContent="center">
            <form onSubmit={handleRelease}>
                <Button variant="contained" color="primary" type="submit" className={classes.root}>Release
                    Token</Button>
            </form>
        </Box>
    )
}
