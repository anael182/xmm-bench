import {useEffect, useState} from 'react'
import TakeToken from "./TakeToken";
import ReleaseToken from "./ReleaseToken";
import axios from "axios";
import {Alert} from "@material-ui/lab";

export default function Login() {

    const [userName, setUserName] = useState("");
    const [date, setDate] = useState("");


    useEffect( () => {
        const fetchData = async () => {
            const result = await axios(process.env.React_App_URL_API + "reservation/state");
            if (result.data === null) {
                setUserName("");
            } else {
                setUserName(result.data.username);
                setDate(result.data.token_creation_date);
                console.log(result);
            }
        };
        fetchData();
    },[]);

    return (
        <div>
                {userName === ""
                    ?<TakeToken />
                    :<div>
                    <Alert severity="info">The board is taken by {userName} since {date} ⌛</Alert>
                    <ReleaseToken />
                    </div>
                }
        </div>
    );
}

