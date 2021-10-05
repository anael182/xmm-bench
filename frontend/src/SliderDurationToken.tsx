import React, {ReactElement, useState} from 'react';
import {createStyles, makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles(() =>
    createStyles({
        slider: {
            width: 200,
            marginBottom: 25,
        },
        sliderCounter: {
            textAlign: "center",
            marginTop: 15,
        },
    }),
);

const marks = [
    {
        value: 60,
        label: '1H',
    },
    {
        value: 120,
        label: '2H',
    },
    {
        value: 180,
        label: '3H',
    },
    {
        value: 240,
        label: '4H',
    },
    {
        value: 300,
        label: '5H',
    },
    {
        value: 360,
        label: '6H',
    },
    {
        value: 420,
        label: '∞',
    }
];

interface TakeTokenProps {
    getSliderValue: (value: number | null) => void,
}

export default function SliderDurationToken(props: TakeTokenProps): ReactElement {

    const classes = useStyles();

    const [value, setValue] = useState<number | null>(120);

    const onSliderChange = (val: number | number[]) => {
        if (val > 360) {
            setValue(null);
        } else {
            setValue(val as number);
        }
        props.getSliderValue(value);
    }

    const valueToHoursMinutes = (value: number | null): string => {
        if (value != null) {
            let hours = Math.trunc(value / 60);
            let minutes = (value % 60).toString().padStart(2, "0");
            return `${hours}h${minutes}m`
        } else {
            return '∞'
        }
    }

    return (
        <div>
            <Typography id="discrete-slider" gutterBottom className={classes.sliderCounter}>
                Token duration : {valueToHoursMinutes(value)}
            </Typography>
            <Slider className={classes.slider}
                    defaultValue={120}
                    onChange={(event, val) => onSliderChange(val)}
                    aria-labelledby="discrete-slider"
                    step={10}
                    marks={marks}
                    min={10}
                    max={420}
            />
        </div>
    )
}

