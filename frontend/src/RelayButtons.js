import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

export default function FormControlLabelPosition() {
    return (
        <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
                <FormControlLabel
                    value="RelayOne"
                    control={<Switch color="primary" />}
                    label="Relay 1"
                    labelPlacement="bottom"
                    onClick={}
                />
                <FormControlLabel
                    value="RelayTwo"
                    control={<Switch color="primary" />}
                    label="Relay 2"
                    labelPlacement="bottom"
                />
                <FormControlLabel
                    value="bottom"
                    control={<Switch color="primary" />}
                    label="Relay 3"
                    labelPlacement="bottom"
                />
                <FormControlLabel
                    value="bottom"
                    control={<Switch color="primary" />}
                    label="Relay 4"
                    labelPlacement="bottom"
                />
            </FormGroup>
        </FormControl>
    );
}
