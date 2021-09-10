import axios from "axios";
import {Button} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: 40,
            maxWidth: 800,
            margin: 'auto',
        },
        flash: {
            marginTop:5,
            minWidth: 100
        },
        power: {
            marginTop:5,
            minWidth: 100
        },
        reboot: {
            marginTop:5,
            minWidth: 100
        },
        cv22boot: {
            marginTop:5,
            minWidth: 100
        },
        cv22flash: {
            marginTop:5,
            minWidth: 100
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
        <Grid container direction="row" justifyContent="center" alignItems="center" className={classes.root}>
            <Grid item xs={4} sm={2}>
                <Button variant="contained" color="primary" title="Flash" onClick={toggleRelay} className={classes.flash}>Flash</Button>
            </Grid>
            <Grid item xs={4} sm={2}>
                <Button variant="contained" color="primary" title="Power" onClick={toggleRelay} className={classes.power}>Power</Button>
            </Grid>
            <Grid item xs={4} sm={2}>
                <Button variant="contained" color="primary" title="Reboot" onClick={toggleRelay} className={classes.reboot}>Reboot</Button>
            </Grid>
            <Grid item xs={4} sm={2}>
                <Button variant="contained" color="primary" title="cv22boot" onClick={toggleRelay} className={classes.cv22boot}> cv22boot</Button>
            </Grid>
            <Grid item xs={4} sm={2}>
                <Button variant="contained" color="primary" title="cv22flash" onClick={toggleRelay} className={classes.cv22flash}>cv22flash</Button>
            </Grid>
        </Grid>
    );
}
