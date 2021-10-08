import Webcam from "./Webcam";
import RelayButtons from './RelayButtons';
import Login from "./Login";
import {ReactElement, useEffect, useState} from "react";
import NavBar from "./NavBar"
import InternalServerError from "./errorComponents/InternalServerError";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import {Box} from "@material-ui/core";


const useStyles = makeStyles(() =>
    createStyles({
        loading: {
            marginTop: '20%',
        },
    }),
);

export default function App(): ReactElement {

    const classes = useStyles();

    const [connect, setConnect] = useState<any>(null)
    const [loading, setLoading] = useState(true);

    const backendConnected = async (): Promise<void> => {
        const result = await axios(process.env.React_App_URL_API + "board");
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
            <Grid container justifyContent="center" alignItems="center" className={classes.loading}>
                <CircularProgress size={100}/>
            </Grid>
        </div>
    )
    return (
        <div>
            <NavBar/>
            {connect === null
                ? <InternalServerError/>
                : <Box>
                    <Login/>
                    <Webcam/>
                    <RelayButtons/>
                </Box>
            }
        </div>

    );
}
