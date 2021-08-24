import './App.css';
import Webcam from "./Webcam.tsx";
import RelayButtons from './RelayButtons.tsx';

function App() {
    return (
        <div className="App">
            <Webcam/>
            <RelayButtons/>
        </div>
    );
}

export default App;
