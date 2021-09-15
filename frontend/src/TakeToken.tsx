import {Button} from '@material-ui/core';
import axios from "axios";
import {makeStyles, createStyles} from '@material-ui/core/styles';
import {FormEvent, ReactElement, useState} from "react";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';





// Material UI components CSS
const useStyles = makeStyles(() =>
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
        form:{
            display: "flex",
            flexDirection: "column",
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
    {
        value: 360,
        label: '6H',
    },
    {
        value: 420,
        label: '7H',
    },
];

interface LoginProps {
    refresh: () => void;
}


export default function TakeToken(props: LoginProps): ReactElement {

    const classes = useStyles();

    const [value, setValue] = useState<number | null>(300);
    const [checked, setChecked] = useState<boolean>(false);

    const toggleChecked = (): void => {
        setChecked(!checked);
    }

    const onSliderChange = (val: number | number[]) => {
        setValue(val as number);
    }

    const valueToHoursMinutes = (value :any) : string => {
        let hours = Math.trunc(value/60);
        let minutes = (value%60).toString().padStart(2, "0");
        return `${hours} H ${minutes} min`
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
                <div className={classes.form}>
                    <TextField type="text" id="outlined-basic" label="Username" name="username" autoFocus={true}
                               variant="outlined" className={classes.input}/>
                    <FormControlLabel
                        control={<Switch size="small" color="primary" checked={checked} onChange={toggleChecked} />}
                        label="Custom token duration"
                    />
                    {checked
                        ? <div>
                            <Typography id="discrete-slider" gutterBottom className={classes.slider}>
                                Token duration : {valueToHoursMinutes(value)}
                            </Typography>
                            <Slider
                                defaultValue={300}
                                onChange={(event, val) => onSliderChange(val)}
                                aria-labelledby="discrete-slider"
                                step={10}
                                marks={marks}
                                min={10}
                                max={420}
                            />
                        </div>
                        : null
                    }
                </div>
                <div>
                    <Button type="submit" variant="contained" color="primary" className={classes.button}>Take
                        Token</Button>
                </div>
            </form>
        </Grid>
    );
}
    

