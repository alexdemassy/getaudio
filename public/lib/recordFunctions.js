var getUserMedia = require('getusermedia');
var $ = require('jquery');
var options = {mimeType: 'audio/webm;codecs=opus'};
var mediaRecorder;
var recordedChunks = [];
var constraints = { audio: true, video: false };
var mediaStream;

export function startRecording (comp) {
    console.log('info: Start recording button pressed');
    comp.setState({ recording: false, blob: null });
    // var getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || {};
    getUserMedia(constraints, function(err, stream) {
        if (err) {
            console.error(err.name + ": " + err.message);
            comp.setState({ recording: false, blob: null });
            throw err;
        }
        console.log('info: Setting up recorder');
        mediaStream = stream;
        mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                // build buffer
                recordedChunks.push(event.data);
            }
        };
        mediaRecorder.start();

        console.log('info: Enabling "stop" button')
        comp.setState({ recording: true, blob: null });

        // // To setup a recording function manually wothout mediaRecorder
        // var audioContext = window.AudioContext;
        // var context = new audioContext();
        // var audioInput = context.createMediaStreamSource(stream);
        // var bufferSize = 2048;
        // // create a javascript node
        // var recorder = context.createJavaScriptNode(bufferSize, 1, 1);
        // // specify the processing function
        // recorder.onaudioprocess = recorderProcess;
        // // connect stream to our recorder
        // audioInput.connect(recorder);
        // // connect our recorder to the previous destination
        // recorder.connect(context.destination);
        
    });
}

export function stopRecording (comp) {
    console.log('info: Stoping recording...');
    // stop recording
    mediaRecorder.stop();

    // close mediaDevices tracks
    mediaStream.getAudioTracks().forEach(function(track) {
        track.stop();
        console.log('info: Stoping audio track ' + track);
    });

    // setup the recording for playback
    console.log('info: Setting up audio object for playback');
    var audio = comp.refs.playback;
    var superBuffer = new Blob(recordedChunks);
    // audio.src = window.URL.createObjectURL(superBuffer);
    var blob = window.URL.createObjectURL(superBuffer);

    console.log('info: Enabling "upload/download" buttons');
    comp.setState({ recording: false, blob });
}

export function uploadBlob () {
    console.log('info: Uploading audio file to server');
    // ajax post request
    var data = new Blob(recordedChunks, {
        type: 'audio/webm;codecs=opus'
    });

    $.ajax({
        url: '/submit',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'text',
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        success: function(data, textStatus, jqXHR)
        {
            if(typeof data.error === 'undefined')
            {
                console.log('info: Audio file submitted with success');
                console.log('info: Request status: "' + textStatus + '" Server response: ' + data);
            }
            else
            {
                // Handle errors here
                console.log('ERRORS: ' + data.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            // Handle errors here
            console.log('ERRORS: ' + textStatus + errorThrown);
        }
    });

}

export function downloadBlob () {
    console.log('info: Downloading audio file');
    var blob = new Blob(recordedChunks, {
        type: 'audio/webm'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'myaudio.webm';
    a.click();
    window.URL.revokeObjectURL(url);
}