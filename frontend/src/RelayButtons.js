import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import axios from "axios";

export default function FormControlLabelPosition() {

    const [checked, setChecked] = React.useState(false);

    const toggleChecked = () => {
        setChecked((prev) => !prev);
    };

    const getRelay = (relayName) => {
        axios.get("http://127.0.0.1:8000/webcam/")
            .catch(err => console.error("Get request ==> " + err));
        axios.post("http://127.0.0.1:8000/relay/" + relayName.target.defaultValue)
            .catch(err => console.error("Post request ==> " + err));
        console.log(relayName);
    }

    return (
        <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
                <FormControlLabel
                    value="RelayOne"
                    control={<Switch color="primary"/>}
                    label="Relay 1"
                    labelPlacement="bottom"
                    onChange={getRelay}
                />
                <FormControlLabel
                    value="RelayTwo"
                    control={<Switch color="primary"/>}
                    label="Relay 2"
                    labelPlacement="bottom"
                    onChange={getRelay}
                />
                <FormControlLabel
                    value="RelayThree"
                    control={<Switch color="primary"/>}
                    label="Relay 3"
                    labelPlacement="bottom"
                    onChange={getRelay}
                />
                <FormControlLabel
                    value="RelayFour"
                    control={<Switch color="primary"/>}
                    label="Relay 4"
                    labelPlacement="bottom"
                    onChange={getRelay}
                />
            </FormGroup>
        </FormControl>
    );
}
