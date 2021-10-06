var express = require('express');
var child_process = require('child_process');

// Create server
var app = express();
var port = 1020;
var url = 'http://localhost:' + port;

app.listen(port, function () {
    console.log("Server listening on PORT: " + port);
    console.log(url);
});

// Serve some directories
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));

// Serve main local dev entry HTML file
app.use('/', express.static(__dirname + '/public'));

// Auto-open in browser
// var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
let start = "xdg-open";
let kill_comm = "pkill -f chrome";
if (process.platform == "win32") {
    start = "start";
    kill_comm = "'TASKKILL /F /IM chrome.exe /T'";
};

// Kill browser upon node exit
process.on('exit', () => child_process.exec(kill_comm));
child_process.exec(start + ' ' + url);