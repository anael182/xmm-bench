import React from 'react';
import axios from 'axios';

export default class Webcam extends React.Component {
    state = {
        img: ""
    }


    render()
{
    return (
        <img src="http://127.0.0.1:8000/webcam" alt="webcam"/>
    )
}
}