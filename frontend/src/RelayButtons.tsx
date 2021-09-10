import axios from "axios";
import {Button} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop:20,
            maxWidth: 500,
            margin: 'auto',
        },
    }),
);


export default function RelayButtons() {

    const toggleRelay = (e: any): void => {
        axios.post(process.env.React_App_URL_API + 'relay/' + e.target.offsetParent.title)
            .catch(err => console.error("Post request error ==> " + err));
    }

    const classes = useStyles();

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1} className={classes.root}>
            <Grid item xs={3}>
                <Button variant="contained" color="primary" title="relayOne" onClick={toggleRelay}>Relay 1</Button>
            </Grid>
            <Grid item xs={3}>
                <Button variant="contained" color="primary" title="relayTwo" onClick={toggleRelay}>Relay 2</Button>
            </Grid>
            <Grid item xs={3}>
                <Button variant="contained" color="primary" title="relayThree" onClick={toggleRelay}>Relay 3</Button>
            </Grid>
            <Grid item xs={3}>
                <Button variant="contained" color="primary" title="relayFour" onClick={toggleRelay}>Relay 4</Button>
            </Grid>
        </Grid>
    );
}
