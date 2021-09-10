import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            //border: '1px solid',
            marginTop:30,
        },
        webcam:{
            maxHeight: 600,
            maxWidth: 800,
            //border: '1px solid',
        }

    }),
);

export default function RelayButtons() {

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <img src={process.env.React_App_URL_API+'webcam'} alt="webcam"className={classes.webcam}/>
        </Grid>
    )
}