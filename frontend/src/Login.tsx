import {ReactElement, useEffect, useState} from 'react';
import TakeToken from "./TakeToken";
import ReleaseToken from "./ReleaseToken";
import axios from "axios";
import {Alert} from "@material-ui/lab";
import useInterval from "./utils/useInterval";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        alert: {
            justifyContent: 'center',
            textAlign: 'center',
        },
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
    const [refresh, setRefresh] = useState<boolean>(false)


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
                            by {user.username} since {user.creation_date} ⌛. The token will expire
                            on {user.expires_date}.</Alert>
                        <ReleaseToken refresh={refreshComponent}/>
                    </div>
            }
        </div>
    );
}


