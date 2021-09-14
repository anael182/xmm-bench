import {Button} from '@material-ui/core';
import axios from "axios";
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {FormEvent, ReactElement, useState} from "react";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';



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
        },
        slider:{
            marginTop: "10%",
        }
    }),
);

const marks = [
    {
        value: 60,
        label: '1H',
    },
    {
        value: 120,
        label: '2H',
    },
    {
        value: 180,
        label: '3H',
    },
    {
        value: 240,
        label: '4H',
    },
    {
        value: 300,
        label: '5H',
    },
];

interface LoginProps {
    refresh: () => void;
}


export default function TakeToken(props: LoginProps): ReactElement {

    const classes = useStyles();

    const [value, setValue] = useState<any>(30)

    const onSliderChange = (val: any) => {
        setValue(val);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (e.currentTarget.username.value !== "") {
            axios({
                method: 'post',
                url: process.env.React_App_URL_API + 'reservation/take',
                data: {username: e.currentTarget.username.value,
                    token_minutes: value+""}
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
                    <Typography id="discrete-slider" gutterBottom className={classes.slider}>
                        Token duration
                    </Typography>
                    <Slider
                        defaultValue={300}
                        onChange={(event, val) => onSliderChange(val)}
                        aria-labelledby="discrete-slider"
                        step={60}
                        marks={marks}
                        min={60}
                        max={300}
                    />
                </div>
                <div>
                    <Button type="submit" variant="contained" color="primary" className={classes.button}>Take
                        Token</Button>
                </div>
            </form>
        </Grid>
    );
}
    

