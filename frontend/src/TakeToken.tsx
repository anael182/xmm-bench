import {Button} from '@material-ui/core';
import axios from "axios";
import {makeStyles, createStyles} from '@material-ui/core/styles';
import {FormEvent, ReactElement, useState} from "react";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import SliderDurationToken from "./SliderDurationToken";



// Material UI components CSS
const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: 60,
        },
        form:{
            display: "flex",
            flexDirection: "row",
            justifyContent: 'space-evenly',
            alignItems: "center",
            minWidth:700,
        },
        slider:{
            minWidth:200,
            textAlign: "center",
        }
    }),
);


interface LoginProps {
    refresh: () => void;
}


export default function TakeToken(props: LoginProps): ReactElement {

    const classes = useStyles();

    const [value, setValue] = useState<number | null>(120);

    const updateSliderValue = (value: number | null): void => {
        setValue(value);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (e.currentTarget.username.value !== "") {
            axios({
                method: 'post',
                url: process.env.React_App_URL_API + 'reservation/take',
                data: {username: e.currentTarget.username.value,
                    token_minutes: value}
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
                <div className={classes.form}>
                    <TextField type="text" id="outlined-basic" label="Username" name="username" autoFocus={true}
                               variant="outlined"/>
                    <SliderDurationToken getSliderValue={updateSliderValue}/>
                    <div>
                        <Button type="submit" variant="contained" color="primary">Take
                            Token</Button>
                    </div>
                </div>
            </form>
        </Grid>
    );
}
    

