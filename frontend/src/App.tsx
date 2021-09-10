import Webcam from "./Webcam";
import RelayButtons from './RelayButtons';
import Login from "./Login";
import {ReactElement} from "react";
import NavBar from "./NavBar"


export default function App(): ReactElement {

    return (
        <div>
            <NavBar/>
            <Login/>
            <Webcam/>
            <RelayButtons/>
        </div>

    );
}

