import React from 'react';

export default class Webcam extends React.Component {
    state = {
        img: ""
    }

    render() {
        return (
            <div>
                <img src="http://127.0.0.1:8000/webcam" alt="webcam"/>
            </div>
        )
    }
}