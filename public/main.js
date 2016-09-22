'use strict';

var constraints = { audio: true, video: false };

var options = {mimeType: 'audio/webm;codecs=opus'};
var mediaRecorder;
var recordedChunks = [];
var mediaStream;

$('#recording-start').click(() => {
    console.log('info: Start recording button pressed');

    // Disable upload/dowload until new audio recorded
    $('#recording-upload').prop('disabled', true);
    $('#recording-download').prop('disabled', true);
    
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
        console.log('info: Setting up recorder');
        recordedChunks = [];
        mediaStream = stream;
        mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();

        console.log('info: Enabling "stop" button')
        $('#recording-start').prop('disabled', true);
        $('#recording-stop').prop('disabled', false);

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
        
    })
    .catch(function(err) {
        console.error(err.name + ": " + err.message);
    });
});

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        // build buffer
        recordedChunks.push(event.data);
    } else {
        // do nothing
    }
}

$('#recording-stop').click(() => {
    console.log('info: Stoping recording...');
    // stop recording
    mediaRecorder.stop();

    // close mediaDevices tracks
    mediaStream.getAudioTracks().forEach((track) => {
        track.stop();
        console.log('info: Stoping audio track ' + track);
    });

    // setup the recording for playback
    console.log('info: Setting up audio object for playback');
    var audio = $('#playback').get(0);
    var superBuffer = new Blob(recordedChunks);
    audio.src = window.URL.createObjectURL(superBuffer);
    audio.controls = true;

    console.log('info: Enabling "upload/download" buttons');
    $('#recording-start').prop('disabled', false);
    $('#recording-stop').prop('disabled', true);
    $('#recording-upload').prop('disabled', false);
    $('#recording-download').prop('disabled', false);
});

$('#recording-upload').click(() => {
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

});

$('#recording-download').click(() => {
    console.log('info: Downloading audio file');
    download();
});


function download() {
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