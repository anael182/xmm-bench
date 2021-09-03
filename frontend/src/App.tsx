import Webcam from "./Webcam";
import RelayButtons from './RelayButtons';
import Login from "./Login";
import {Grid} from "@material-ui/core";


function App() {
    return (
        <Grid container justifyContent = "center">
        <div className="App">
            <Login />
            <Webcam/>
            <RelayButtons/>
        </div>
        </Grid>

    );
}

export default App;
