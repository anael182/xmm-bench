import {useEffect, useState} from 'react'
import TakeToken from "./TakeToken";
import ReleaseToken from "./ReleaseToken";
import axios from "axios";
import {Alert} from "@material-ui/lab";


export default function Login() {

    const [userName, setUserName] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        setInterval(() => {
            axios.get(process.env.React_App_URL_API + "reservation/state")
                .then((res)=> {
                    if (res.data === null) {
                        setUserName("");
                    }else{
                        setUserName(res.data.username);
                        setDate(res.data.token_creation_date);
                    }
                })
                .catch(err => console.error(err));
        }, 5000);
    });

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

