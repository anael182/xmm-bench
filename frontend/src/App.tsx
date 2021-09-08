import Webcam from "./Webcam";
import RelayButtons from './RelayButtons';
import Login from "./Login";
import {ReactElement} from "react";


export default function App(): ReactElement {
    return (
        <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} className="App">
            <Login />
            <Webcam/>
            <RelayButtons/>
        </div>
    );
}

