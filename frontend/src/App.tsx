import Webcam from "./Webcam";
import RelayButtons from './RelayButtons';
import Login from "./Login";


function App() {
    return (
        <div className="App">
            <Login />
            <Webcam/>
            <RelayButtons/>
        </div>
    );
}

export default App;
