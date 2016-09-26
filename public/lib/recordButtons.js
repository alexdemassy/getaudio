import React from 'react';
import { startRecording, stopRecording, uploadBlob, downloadBlob } from './recordFunctions.js';

class Hello extends React.Component {
    constructor(props) {
        super(props)
        this.state = { recording : false, blob: '' };
    }
    render() {
        var { recording, blob } = this.state;
        return ( <div className='controls'>
            <audio ref='playback' src={blob} controls='true'>Browser does not support HTML5 audio element.</audio>
            <button ref="start" onClick={() => startRecording(this)} disabled={recording}>Start</button>
            <button ref="stop" onClick={() => stopRecording(this)} disabled={!recording}>Stop</button>
            <button ref="upload" onClick={() => uploadBlob(this)} disabled={blob ? false : true}>Upload</button>
            <button ref="download" onClick={() => downloadBlob(this)} disabled={blob ? false : true}>Download</button>
        </div>)
    }
}

export default Hello;
