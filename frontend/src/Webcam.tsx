import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {useState} from "react";
import {Button} from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Slider from '@material-ui/core/Slider';
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: 50,
        },
        webcam: {
            height: 600,
            width: 800,
        },
        webcamButton: {
            display: 'flex',
            justifyContent: 'center',
            marginTop:300,
            marginBottom:300
        },
        webcamSlider: {
            maxWidth: 500,
            marginTop: 10,
            marginBottom:10,
            marginLeft: 150,
        },
        sliderFramerateText: {
            textAlign: 'center',
            marginTop: 10,
        }
    }),
);

export default function RelayButtons() {

    const classes = useStyles();

    const [toggleCam, setToggleCam] = useState<boolean>(false);
    const [framerateWebcam, setFramerateWebcam] = useState<number>(30);

    const toggleWebcam = (): void => {
        setToggleCam(!toggleCam);
    }

    const onSliderChange = (val: number | number[]) => {
        setFramerateWebcam(val as number);
    }

    return (
        <Grid container direction="column" justifyContent="center" alignItems="center" className={classes.root}>
            {toggleCam
                ?<div>
                <img src={process.env.React_App_URL_API + 'webcam/'+framerateWebcam} alt="webcam" className={classes.webcam}
                       onClick={toggleWebcam}/>
                <Typography id="framerate-slider" className={classes.sliderFramerateText} gutterBottom>Webcam framerate</Typography>
                    <Slider
                        className={classes.webcamSlider}
                        aria-labelledby="framerate-slider"
                        defaultValue={30}
                        step={1}
                        min={1}
                        max={30}
                        valueLabelDisplay="auto"
                        onChange={(event, val) => onSliderChange(val)}
                    />
                </div>
                : <Button startIcon={<PhotoCameraIcon/>} variant="outlined" color="primary" onClick={toggleWebcam}
                          className={classes.webcamButton}>Camera</Button>
            }
            </Grid>
    )
}