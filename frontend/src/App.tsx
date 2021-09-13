import Webcam from "./Webcam";
import RelayButtons from './RelayButtons';
import Login from "./Login";
import {ReactElement, useEffect, useState} from "react";
import NavBar from "./NavBar"
import InternalServerError from "./errorComponents/InternalServerError";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        loading: {
            marginTop:'25%',
        },
    }),
);

export default function App(): ReactElement {

    const classes = useStyles();

    const [connect, setConnect] = useState<any>(null)
    const [loading, setLoading] = useState(true);

    const backendConnected = async (): Promise<void> => {
        const result = await axios(process.env.React_App_URL_API+"board");
        setConnect(result.data);
    }

    useEffect((): void => {
            backendConnected()
            if (loading) {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            }
        }
        , [loading]
    )

    if (loading) return (
        <div>
        <NavBar/>
            <Grid container justify = "center" alignItems="center" className={classes.loading}>
        <CircularProgress size={100}/>
            </Grid>
        </div>
    )
    return (
        <div>
            <NavBar/>
            {connect === null
                ?<InternalServerError/>
                :<div>
                <Login/>
                <Webcam/>
                <RelayButtons/>
                </div>
            }
        </div>

    );
}

