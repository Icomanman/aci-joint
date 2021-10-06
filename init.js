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
app.use('/css', express.static(__dirname + '/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/contents', express.static(__dirname + '/views/contents'));

// added temporary image directory: 10 Sep 2020
app.use('/img', express.static(__dirname + '/img'));
// Serve main local dev entry HTML file
app.use('/compiled.html', express.static(__dirname + '/compiled.html'));

// temp dir
app.use('/temp', express.static(__dirname + '/temp'));
app.use('/canvas', express.static(__dirname + '/temp/canvas.temp.html'));

// ref dir for loading local results file: 06 Aug 2021
app.use('/results', express.static(`${__dirname}/ref/results_obj`));

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
child_process.exec(start + ' ' + url + '/compiled.html');