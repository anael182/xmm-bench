import React, {ReactElement, useEffect, useState} from 'react';
import {Button, Box} from '@material-ui/core';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';




const useStyles = makeStyles(() =>
    createStyles({
        button: {
            width:150,
            marginTop:5,
            maxHeight:100,
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
        queueDiv:{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        listContainer:{
            marginTop: 50,
            marginBottom:50
        }
    }),
);

interface Users {
    index: number,
    username: string,
    token_minutes: number
}

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
    const [usersInQueue, setUsersInQueue] = useState<Users[]>([]);

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
                url: process.env.React_App_URL_API + "reservation/queue/join",
                data: {username: e.target.username.value, token_minutes: value}
            })
                .then(() => {
                    props.refresh();
                })
                .catch(err => console.error("ERROR =>" + err));
        }
    }

    const handleLeaveQueue = (index: any): void => {
            axios({
                method: 'post',
                url: process.env.React_App_URL_API + `reservation/queue/leave/${index}`,
            })
                .catch(err => console.error("ERROR =>" + err));
    }

    const fetchQueue = async (): Promise<void> => {
        const result = await axios(process.env.React_App_URL_API + "reservation/queue/state");
        setUsersInQueue(result.data.queue);
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

    const listUser = usersInQueue.map((d, index) =>
        <div key={index} className={classes.queueDiv}>
                {index+1} -- {d.username} -- {valueToHoursMinutes(d.token_minutes)}
                <IconButton aria-label="delete" onClick={() => handleLeaveQueue(index)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
        </div>
    );

    useEffect((): void => {
            fetchQueue()
        });

    return(
        <Box display="flex" justifyContent="center">
            <form onSubmit={handleJoinQueue}>
                <div className={classes.form}>
                    <TextField id="outlined-basic" label="Username" name="username" autoFocus={true}
                       variant="outlined"/>
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
                    <Button variant="contained" style={{backgroundColor: '#12824C', color: '#FFFFFF'}} className={classes.button} type="submit">Join Queue</Button>
                    <div className={classes.listContainer}>
                        {listUser}
                    </div>
                </div>
            </form>
        </Box>
    )
}