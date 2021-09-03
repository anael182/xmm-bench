import Webcam from "./Webcam";
import RelayButtons from './RelayButtons';
import Login from "./Login";
/*
import {Grid} from "@material-ui/core";
*/


function App() {
    return (

        /*<Grid container justifyContent = "center">*/


        <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} className="App">
            <Login />
            <Webcam/>
            <RelayButtons/>
        </div>
    );
        {/*</Grid>*/}
}

export default App;
