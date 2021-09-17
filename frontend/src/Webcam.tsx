import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {useState} from "react";
import {Button} from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';


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
        }
    }),
);

export default function RelayButtons() {

    const [toggleCam, setToggleCam] = useState<boolean>(false);

    const toggleWebcam = () => {
        setToggleCam(!toggleCam);
    }

    const classes = useStyles();

    return (
        toggleCam
            ?
            <Grid container className={classes.root}>
                <img src={process.env.React_App_URL_API + 'webcam'} alt="webcam" className={classes.webcam}
                     onClick={toggleWebcam}/>
            </Grid>
            :
            <Grid container className={classes.root}>
            <Button startIcon={<PhotoCameraIcon />} variant="outlined" color="primary" onClick={toggleWebcam} className={classes.webcamButton}>Camera</Button>
            </Grid>
    )
}