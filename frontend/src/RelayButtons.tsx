import axios from "axios";
import {Button} from "@material-ui/core";
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';


// Material UI components CSS
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

    const toggleRelay = (e: any): void => {
        axios.post(process.env.React_App_URL_API + 'relay/' + e.target.offsetParent.title)
            .catch(err => console.error("Post request error ==> " + err));
    }

    return (

        <div className={classes.root}>
            <Button variant="contained" color="primary" title="relayOne" onClick={toggleRelay}> Relay 1 </Button>
            <Button variant="contained" color="primary" title="relayTwo" onClick={toggleRelay}> Relay 2</Button>
            <Button variant="contained" color="primary" title="relayThree" onClick={toggleRelay}> Relay 3</Button>
            <Button variant="contained" color="primary" title="relayFour" onClick={toggleRelay}> Relay 4</Button>
        </div>
    );
}
