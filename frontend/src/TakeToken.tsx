import {useState} from 'react'
import {Button, Input, InputLabel} from '@material-ui/core';
import axios from "axios";


export default function TakeToken() {

    const [userName, setUserName] = useState("");

    const handleSubmit = (e: any) => {
            e.preventDefault();
            setUserName(e.target.elements.username.value);
            if (userName !== "") {
                axios({
                    method: 'post',
                    url: process.env.React_App_URL_API + 'reservation/take',
                    data: {username: userName}
                })
                    .then(() => console.log(userName))
                    .catch(err => console.error("ERROR =>" + err));
            }
    }

    return (
        <form onSubmit={handleSubmit}>
            <InputLabel required={true} htmlFor="my-input">Username</InputLabel>
            <Input type="text" name="username" autoFocus={true} aria-describedby="my-helper-text"/>
            <Button type="submit" variant="contained" color="primary">Take Token</Button>
        </form>
    );
}
    

