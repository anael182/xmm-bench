import {Button, Grid, Input, InputLabel} from '@material-ui/core';
import axios from "axios";
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {FormEvent, ReactElement} from "react";

// Material UI components CSS
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                paddingTop: theme.spacing(3),
            },
        },
    }),
);

interface LoginProps {
    refresh: () => void;
}


export default function TakeToken (props: LoginProps): ReactElement {

    const classes = useStyles();

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
            if (e.currentTarget.username.value !== "") {
                axios({
                    method: 'post',
                    url: process.env.React_App_URL_API + 'reservation/take',
                    data: {username: e.currentTarget.username.value}
                })
                    .then(() => {
                        props.refresh();
                    })
                    .catch(err => console.error("ERROR =>" + err));
            }
    }

    return (
        <Grid container justifyContent = "center" className={classes.root}>
            <form onSubmit={handleSubmit}>
                <InputLabel required={true} htmlFor="my-input">Username</InputLabel>
                <Input type="text" name="username" autoFocus={true} aria-describedby="my-helper-text"/>
                <Button type="submit" variant="contained" color="primary">Take Token</Button>
            </form>
        </Grid>
    );
}
    

