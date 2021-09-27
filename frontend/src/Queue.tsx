import React, {ReactElement, useState} from 'react';
import {Button, Box} from '@material-ui/core';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";


const useStyles = makeStyles(() =>
    createStyles({
        button: {
            width:150,
            border:'solid 1px solid',
            marginTop:5,
            maxHeight:100,
            marginRight:5
        },
        form:{
            display: "flex",
            flexDirection: "column",
            justifyContent: 'center',
            alignItems: "center",
            minWidth:700,
            marginTop:25,
        },
        slider:{
            maxWidth: 200,
            marginBottom:30
        },
        sliderCounter:{
            marginTop:20
        },
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
        label: '∞',
    }
];

interface LoginProps {
    refresh: () => void;
}

export default function Queue(props: LoginProps): ReactElement {

    const classes = useStyles();

    const [value, setValue] = useState<number | null>(120);
    const [username, setUsername] = useState('')

    const onSliderChange = (val: number | number[]) => {
        if (val > 360 ){
            setValue(null);
        }else {
            setValue(val as number);
        }
    }

    const handleJoinQueue = (e: any): void => {
        e.preventDefault();
        if (e.currentTarget.username.value !== "") {
            axios({
                method: 'post',
                url: process.env.React_App_URL_API + "reservation/joinq",
                data: {username: e.target.username.value, token_minutes: value}
            })
                .then(() => {
                    props.refresh();
                })
                .catch(err => console.error("ERROR =>" + err));
        }
    }

    const handleLeaveQueue = (e: any): void => {
        e.preventDefault();
        console.log(username);
            axios({
                method: 'post',
                url: process.env.React_App_URL_API + "reservation/leaveq",
                data: {username: username}
            })
                .then(() => {
                    props.refresh();
                })
                .catch(err => console.error("ERROR =>" + err));
    }

    const valueToHoursMinutes = (value :number | null) : string => {
        if (value != null) {
            let hours = Math.trunc(value / 60);
            let minutes = (value % 60).toString().padStart(2, "0");
            return `${hours}h ${minutes}m`
        }else{
            return '∞'
        }
    }

    return(
        <Box display="flex" justifyContent="center">
            <form onSubmit={handleJoinQueue}>
                <div className={classes.form}>
                    <TextField id="outlined-basic" label="Username" name="username" autoFocus={true}
                       variant="outlined" onChange={event => setUsername(event.target.value)}/>
                    <Typography id="discrete-slider" gutterBottom className={classes.sliderCounter}>
                        Token duration : {valueToHoursMinutes(value)}
                    </Typography>
                    <Slider className={classes.slider}
                            defaultValue={120}
                            onChange={(event, val) => onSliderChange(val)}
                            aria-labelledby="discrete-slider"
                            step={10}
                            marks={marks}
                            min={10}
                            max={420}
                    />
                    <div>
                    <Button variant="contained" color='primary' className={classes.button} type="submit">Join Queue</Button>
                    <Button variant="contained" color="secondary" className={classes.button} onClick={handleLeaveQueue}>Leave Queue</Button>
                </div>
                </div>
            </form>
        </Box>
    )
}