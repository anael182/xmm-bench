import React from "react";
import {FormControl, FormHelperText, Input, InputLabel} from '@material-ui/core';
// import axios from "axios";

export default function Login() {

    const login = (): void => {
        let formData = new FormData();
        formData.append("username", "johndoe");
        formData.append("password", "secret");
        //axios.post(process.env.React_App_URL_API + 'reservation/take')
        //    .catch(err => console.error("Post request ==> " + err));
        let request = new XMLHttpRequest();
        request.open("POST", process.env.React_App_URL_API+"reservation/take");
        request.send(formData);
    }

    return (
        <FormControl>
            <InputLabel required={true} focused={true} htmlFor="my-input">Username</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" />
            <FormHelperText id="my-helper-text">John Doe est actuelement connecté</FormHelperText>
            <button onClick={login}>Se connecter</button>
        </FormControl>
    );
}