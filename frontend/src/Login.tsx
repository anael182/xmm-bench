import React from "react";
import {Button, FormControl, FormHelperText, Input, InputLabel} from '@material-ui/core';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import axios from "axios";


// Création du CSS des boutons sur Material UI

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                paddingTop: theme.spacing(3),
            },
        },
    }),
);

export default function Login() {

    const classes = useStyles();

    const handleLogin = () : void => {
        let formData = new FormData();
        formData.append("username", "johndoe");
        formData.append("password", "secret");
        let request = new XMLHttpRequest();
        request.open("POST", process.env.React_App_URL_API + "token");
        request.send(formData);
    }

    const getActiveUser = () : void => {
        axios.get(process.env.React_App_URL_API + 'reservation/state')
            .then(res => console.log(res))
            .catch(err => console.error("Post request ==> " + err));
    }

        return (
            <div className={classes.root}>
            <FormControl>
                {/*<InputLabel required={true} htmlFor="my-input">Username</InputLabel>
                 <Input id="username" name="username" autoFocus={true} aria-describedby="my-helper-text"/>*/}
                <Button variant="contained" color="primary" onClick={handleLogin} disableElevation>Take Token</Button>
                <FormHelperText id="my-helper-text" >John Doe est actuelement connecté</FormHelperText>
            </FormControl>
            </div>
        )
}

