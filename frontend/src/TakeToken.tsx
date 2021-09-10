import {Button} from '@material-ui/core';
import axios from "axios";
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {FormEvent, ReactElement} from "react";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


// Material UI components CSS
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: 60,
        },
        input: {
            marginTop:"15%",
        },
        button: {
            marginTop: "10%",
            marginLeft: "20%",
        }
    }),
);

interface LoginProps {
    refresh: () => void;
}


export default function TakeToken(props: LoginProps): ReactElement {

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
        <Grid container direction="column" justifyContent="center" alignItems="center" className={classes.root}>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField type="text" id="outlined-basic" label="Username" name="username" autoFocus={true}
                               variant="outlined" className={classes.input}/>
                </div>
                <div>
                    <Button type="submit" variant="contained" color="primary" className={classes.button}>Take
                        Token</Button>
                </div>
            </form>
        </Grid>
    );
}
    

