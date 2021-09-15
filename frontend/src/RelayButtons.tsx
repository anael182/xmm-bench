import axios from "axios";
import {Button} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: 40,
            maxWidth: 900,
            margin: 'auto',
        },
        flash: {
            marginTop: 5,
            width: 100,
            height:50,
        },
        power: {
            marginTop: 5,
            width: 100,
            height:50,
        },
        reboot: {
            marginTop: 5,
            width: 100,
            height:50,
        },
        cv22boot: {
            marginTop: 5,
            width: 110,
            height:50,
        },
        cv22flash: {
            marginTop: 5,
            width: 100,
            height:50,
            marginLeft:10,
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
                <Button variant="contained" color="primary" title="flash" onClick={toggleRelay} className={classes.flash}>Flash</Button>
            </Grid>
            <Grid item xs={4} sm={2}>
                <Button variant="contained" color="primary" title="power" onClick={toggleRelay} className={classes.power}>Power</Button>
            </Grid>
            <Grid item xs={4} sm={2}>
                <Button variant="contained" color="primary" title="reboot" onClick={toggleRelay} className={classes.reboot}>Reboot</Button>
            </Grid>
            <Grid item xs={4} sm={2}>
                <Button variant="contained" color="primary" title="cv22boot" onClick={toggleRelay} className={classes.cv22boot}>CV22 boot</Button>
            </Grid>
            <Grid item xs={4} sm={2}>
                <Button variant="contained" color="primary" title="cv22flash" onClick={toggleRelay} className={classes.cv22flash}>CV22 flash</Button>
            </Grid>
        </Grid>
    );
}
