import axios from "axios";
import {Button} from "@material-ui/core";
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {useEffect} from "react";


// Création du CSS des boutons sur Material UI

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

    let state = {
        username: null
    }

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(process.env.React_App_URL_API + "reservation/state")
                .catch(err => console.error(err));
        }, 10000);
    },
        []);

    const classes = useStyles();

    const getRelay = (e: any): void => {
        axios.post(process.env.React_App_URL_API + 'relay/' + e.target.offsetParent.title)
            .catch(err => console.error("Post request ==> " + err));
    }

    return (

        <div className={classes.root}>
            <Button variant="contained" color="primary" title="relayOne" onClick={getRelay}> Relay 1 </Button>
            <Button variant="contained" color="primary" title="relayTwo" onClick={getRelay}> Relay 2</Button>
            <Button variant="contained" color="primary" title="relayThree" onClick={getRelay}> Relay 3</Button>
            <Button variant="contained" color="primary" title="relayFour" onClick={getRelay}> Relay 4</Button>
        </div>
    );
}
