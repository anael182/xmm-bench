import {useEffect, useState} from 'react'
import TakeToken from "./TakeToken";
import ReleaseToken from "./ReleaseToken";
import axios from "axios";
import {Alert} from "@material-ui/lab";
import useInterval from "./utils/useInterval"

interface User {
    username: string,
    token_creation_date : string
}

export default function Login() {

    const [user, setUser] = useState<User | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false)


    const fetchData = async () => {
        const result = await axios(process.env.React_App_URL_API + "reservation/state");
            setUser(result.data);
    }

        useInterval(
            fetchData
            ,
            10000
        );

        useEffect(() => {
                fetchData()
            }
            , [refresh]
        )


        //Tuto transfert de props parent => enfant https://www.youtube.com/watch?v=yH5Z-lSeV9Y
        const refreshComponent = () => {
            setRefresh(!refresh);
        }

        return (
            <div>
                {user === null
                    ? <TakeToken refresh={refreshComponent}/>
                    : <div>
                        <Alert severity="info">The board is taken
                            by {user.username} since {user.token_creation_date} ⌛</Alert>
                        <ReleaseToken refresh={refreshComponent}/>
                    </div>
                }
            </div>
        );
}


