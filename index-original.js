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

router.post('/upload', function (req, res) {
router.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var csv = files.csvtoupload.path;
        var txt = files.txttoupload.path;

        var rsCsv = fs.createReadStream( csv, 'utf8');
        var rsTxt = fs.createReadStream( txt, 'utf8');

        console.log(rsCsv);
        console.log(rsTxt);
        res.end();
        
    });
})

app.use('*', function (req, res) {
    res.send('Error 404: Not Found!');
});

app.listen(3000);
console.log("listen on port 3000!");