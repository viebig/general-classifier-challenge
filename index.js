var express = require('express');
var app = express();
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');

var path = __dirname + '/';

app.use('/', router);
app.use('/', express.static(__dirname + '/www'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

router.get('/',function(req, res){
    res.sendFile(path + 'index.html');
});

router.post('/fileupload', function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var messages = files.filetoupload.path;
        var processed = '/home/felipegsantos/Documentos/' + files.filetoupload.name;
        //var read_stream = fs.createReadStream( messages, { encoding: 'utf-8', bufferSize: 64 * 1024, flag: 'r' });
        
        fs.readFile(messages, { encoding: "utf8", flag: 'r'}, function (err) {
            if(err) throw err;
            res.write(messages);
            res.end();
        })

        //read_stream.on("data", function (data) {
        //    process.stdout.write(data);
        //});

        //read_stream.on("error", function (err) {
        //    console.error("An error occurred: %s", err)
        //});

        //read_stream.on("close", function () {
        //    console.log("File closed.")
        //});
        
        //fs.rename(messages, processed, function (err) {
          //  if (err) throw err;
          //  res.write('arquivo uploadeado!');
          //  res.end();
        //});
    });
});


app.use('*', function (req, res) {
    res.send('Error 404: Not Found!');
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
