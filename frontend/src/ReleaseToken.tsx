import React from 'react'
import {Button, FormControl, Grid} from '@material-ui/core';
import axios from "axios";


export default function ReleaseToken() {

    const handleRelease = (e: any) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: process.env.React_App_URL_API + 'reservation/release',
        })
            .catch(err => console.error("ERROR =>" + err));
    }

    return (
        <Grid container justifyContent = "center">
            <FormControl onSubmit={handleRelease}>
            <Button variant="contained" color="primary" onClick={handleRelease}>Release Token</Button>
            </FormControl>
        </Grid>
    )
}
