import React from 'react'
import {Button, Grid} from '@material-ui/core';
import axios from "axios";

export default function ReleaseToken(props: any) {

    const handleRelease = (e: any) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: process.env.React_App_URL_API + 'reservation/release',
        })
            .then(()=> props.refresh())
            .catch(err => console.error("ERROR =>" + err));
    }


    return (
        <Grid container justifyContent = "center">
            <form onSubmit={handleRelease}>
            <Button variant="contained" color="primary" type="submit">Release Token</Button>
            </form>
        </Grid>
    )
}
