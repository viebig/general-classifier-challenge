var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var number = 0;

var txtFile = fs.readFileSync(__dirname + '/in/messages.txt', 'utf8');
var csvFile = fs.readFileSync(__dirname + '/in/classification.csv', 'utf8');
csvFile = csvFile.split('\n');
var csvHeader = csvFile[0].split(',');

csvFile.forEach(function(element){
    console.log(element.split());
});


console.log(csvHeader);
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    var PhraseResult = txtLine(txtFile, number);
    res.render('index', {prhase: PhraseResult, CategoryA: 'categoria A', CategoryB: 'categoria B'});
});

app.post('/', urlencodedParser, function (req, res) {
    var turn = req.body.action;
    var cats = req.body.category;
    var catHeader = csvLine(csvFile);
    
    number = parseInt(number) + parseInt(turn);
    if(number == -1 ) {
        number = 0;
    }
    var PhraseResult = txtLine(txtFile, number);
    
    if(cats == "catA") {
        catHeader = bringSub(catHeader, 0, csvFile);
    } else if (cats == "catB") {
        catHeader = bringSub(catHeader, 1, csvFile);
    }

    res.render('index', { prhase: PhraseResult, CategoryA: catHeader[0], CategoryB: catHeader[1] });
    res.end();
});

function txtLine(txtFile, index) {
    var txtParse = txtFile.split("\n"); 
    var txtElement = txtParse[index];
    if (txtElement == undefined) {
        txtElement = "fim do arquivo alcançado";
    }
    return txtElement;
}

function csvLine(csvFile) {
    var allTextLines = csvFile.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    
    return headers;
}

function bringSub(catHeader, index, csvFile){
    var takeSub = csvFile.split(/\r\n|\n/);
    var headers = takeSub[0].split(',');
    var lines = [];
    var tests = [];
    for (var i = 1; i < takeSub.length; i++) {
        tests[i] = takeSub[i];
    }
    lines[catHeader[index]] = tests;
    console.log(lines);
    // console.log('var', lines);
    
    return ["teste", "testes"];
 }


app.listen(5000);
console.log("listen on port 5000!");