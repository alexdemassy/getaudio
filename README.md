# Get Audio
Small client & server code (nodejs) that records from a user microphone 
at the press of a button using MediaStream API (aka WebRTC), compressses
the audio stream to webm/opus and sends it to the server using AJAX,
which then saves it to disk.

# Compatibility
Tested under Chrome 53+ only. Should work also on recent FF versions.

# How-to
## Official API documentation
https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder_API
https://developers.google.com/web/updates/2016/01/mediarecorder

(for reference only - not used)
https://github.com/muaz-khan/WebRTC-Experiment/tree/master/RecordRTC

## Useful tutorials
Nice audio capture example without third party libraries
https://subvisual.co/blog/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions

Useful to understand WebAudio API and AudioContext()
http://www.html5rocks.com/en/tutorials/webaudio/intro/

# Licence
Copyright© 2016 Alexandre Robert de Massy, released under ISC licence.
