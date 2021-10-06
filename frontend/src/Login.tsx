import {ReactElement, useEffect, useState} from 'react';
import TakeToken from "./TakeToken";
import ReleaseToken from "./ReleaseToken";
import axios from "axios";
import {Alert} from "@material-ui/lab";
import useInterval from "./utils/useInterval";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Grid} from "@material-ui/core";
import moment from 'moment';

const useStyles = makeStyles(() =>
    createStyles({
        alert: {
            justifyContent: 'center',
            textAlign: 'center',
        },
        form: {
            display: "flex",
            flexDirection: "row",
            justifyContent: 'space-evenly',
            alignItems: "center",
            minWidth: 700,
            paddingTop: 20
        },
        boxQueue: {
            display: 'flex',
            flexDirection: 'column',
        }
    }),
);


interface User {
    username: string,
    creation_date: string,
    expires_date: string
}

export default function Login(): ReactElement {

    const classes = useStyles();

    const [user, setUser] = useState<User | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);


    const fetchData = async (): Promise<void> => {
        const result = await axios(process.env.React_App_URL_API + "reservation/state");
        setUser(result.data);
    }

    useInterval(
        fetchData
        ,
        10000
    );

    useEffect((): void => {
            fetchData()
        }
        , [refresh]
    )

    const refreshComponent = (): void => {
        setRefresh(!refresh);
    }

    return (
        <div>
            {user === null
                ? <TakeToken refresh={refreshComponent}/>
                : <div>
                    <Alert severity="success" className={classes.alert}>The board is taken
                        by {user.username} since {moment(user.creation_date).format("DD/MM/YYYY HH:mm")} ⌛.
                        {user.expires_date != null
                            ? <span> The token will expire on {moment(user.expires_date).format("DD/MM/YYYY HH:mm")}.</span>
                            : <span> There is no expires date for this token.</span>
                        }
                    </Alert>
                    <Grid container className={classes.boxQueue}>
                        <TakeToken refresh={refreshComponent}/>
                        <ReleaseToken refresh={refreshComponent}/>
                    </Grid>
                </div>
            }
        </div>
    );
}


