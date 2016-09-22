const debug = require('debug')('server.js');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const fs = require('fs');

// for live-reload
const io = require('socket.io').listen(server);
const watch = require('watch');



const port = process.argv[2] || 8000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.raw({ type: 'audio/webm'}));

server.listen(port, () => {
    console.log('info: app running on port :' + port);
});

app.post('/submit', (req, res) => {
    console.log('info: receiving an audio file');
    fs.writeFile('myaudiofile.webm', req.body, (err) => {
        if (err) throw err;
        console.log('info: file "myaudiofile.webm" saved');
    });
    res.status(200).send('server received audiofile');
});


// for live-reload
io.on('connection', function (socket) {
    console.log('info: client connected');
    socket.on('info', function (data) {
        console.log('info: ' + data.msg);
    });
});
var count = 0;
watch.watchTree('./public', function (f, curr, prev) {
    if (count) {
        console.log('info: file ' + f + ' has changed. sending live-reload event');
        io.emit('live-reload', { msg: 'file: ' + f + ' changed' });
        // for (var key in io.sockets.connected)
        //     console.log('info: active socket ' + key);
    }
    count++;
});