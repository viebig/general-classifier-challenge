var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var TxtFile = fs.readFileSync(__dirname + '/in/messages.txt', 'utf8');
var CsvFile = fs.readFileSync(__dirname + '/in/classification.csv', 'utf8');

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index', {prhase: 'queijo', CategoryA: 'categoria', CategoryB: 'categoria'});
});

app.post('/', urlencodedParser, function (req, res) {
    var count = 1;
    var turn = req.body.action;
    if(turn == 'next') {
        var number = count + 1;
    }
    if(turn == 'prev') {
        var number = count - 1;
    }
    console.log(number);
    var PhraseResult = txtLine(TxtFile, number);
    // var categoryResult = csvLine(CsvFile, number);
    console.log(PhraseResult);
    res.render('index', { prhase: PhraseResult, CategoryA: 'categoria', CategoryB: 'categoria' });
    res.end();
});


function txtLine(TxtFile, index) {
    var txtParse = TxtFile.split("\n"); 
    var txtElement = txtParse[index];
    
    return txtElement;
}

function CsvFile(csvFile, index) {
    res.write(csvElement + "<br>");
    var csvParse = CsvFile.split("\n");
    var csvElement = csvParse[index];
}


app.listen(5000);
console.log("listen on port 5000!");