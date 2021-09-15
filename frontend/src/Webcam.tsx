import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles} from "@material-ui/core/styles";

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
        }
    }),
);

export default function RelayButtons() {

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <img src={process.env.React_App_URL_API + 'webcam'} alt="webcam" className={classes.webcam}/>
        </Grid>
    )
}