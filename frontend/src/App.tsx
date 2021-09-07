import Webcam from "./Webcam";
import RelayButtons from './RelayButtons';
import Login from "./Login";


function App() {
    return (
        <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} className="App">
            <Login />
            <Webcam/>
            <RelayButtons/>
        </div>
    );
}

export default App;
