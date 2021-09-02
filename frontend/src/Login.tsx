import {useEffect, useState} from 'react'
import TakeToken from "./TakeToken";
import ReleaseToken from "./ReleaseToken";
import axios from "axios";


export default function Login(props: any) {

    const [loggedIn, loggedOut] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        setInterval(() => {
            axios.get(process.env.React_App_URL_API + "reservation/state")
                .catch(err => console.error(err));
        }, 10000);
    })
    return (
        <div>
            <TakeToken />
            <ReleaseToken />
        </div>
    )
}

