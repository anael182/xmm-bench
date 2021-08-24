import axios from "axios";
import {Button} from "@material-ui/core";
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {URL_API_RELAY} from "./react-app-env.d";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }),
);

export default function RelayButtons() {

    const classes = useStyles();

    const getRelay = (e: any): void => {
        axios.post(URL_API_RELAY + e.target.offsetParent.accessKey)
            .catch(err => console.error("Post request ==> " + err));
        console.log(e)
    }

    return (
        <div className={classes.root}>
            <Button variant="contained" color="primary" accessKey="relayOne" onClick={getRelay}> Relay 1 </Button>
            <Button variant="contained" color="primary" accessKey="relayTwo" onClick={getRelay}> Relay 2</Button>
            <Button variant="contained" color="primary" accessKey="relayThree" onClick={getRelay}> Relay 3</Button>
            <Button variant="contained" color="primary" accessKey="relayFour" onClick={getRelay}> Relay 4</Button>
        </div>
    );
}
