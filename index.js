const http = require('http');
const fs = require('fs');
const csv = require('csv');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const txtFile = fs.readFileSync(__dirname + '/in/messages.txt', 'utf8');
const csvFile = fs.readFileSync(__dirname + '/in/classification.csv', 'utf8');
let number = 0;
app.set('view engine', 'ejs');
let final = {};
var queIsso;
csv.parse(csvFile, ',', function(err,data) {
    if(err) throw err;
    data.forEach(function (row) {
        if (!final[row[0]]) {
            final[row[0]] = [];
        }
        final[row[0]].push(row[1]);
    });
});

app.get('/', function (req, res) {
    let PhraseResult = txtLine(txtFile, number);
    let CategoryResult = csvLine(csvFile);
    res.render('index', { prhase: PhraseResult, CategoryA: CategoryResult[0], CategoryB: CategoryResult[1] });
});

app.post('/', urlencodedParser, function (req, res) {
    let turn = req.body.action;
    let cats = req.body.category;
    let catHeader = csvLine(csvFile);
    
    number = parseInt(number) + parseInt(turn);
    if (number == -1) {
        number = 0;
    }
    let PhraseResult = txtLine(txtFile, number);
    
    if (cats == "catA") {
        catHeader = bringSub(catHeader, 0, csvFile);
    } else if (cats == "catB") {
        catHeader = bringSub(catHeader, 1, csvFile);
    }
    
    res.render('index', { prhase: PhraseResult, CategoryA: catHeader[0], CategoryB: catHeader[1] });
    res.end();
});

function txtLine(txtFile, index) {
    let txtParse = txtFile.split("\n");
    let txtElement = txtParse[index];
    if (txtElement == undefined) {
        txtElement = "fim do arquivo alcançado";
    }
    return txtElement;
}

function csvLine(csvFile) {
    let allTextLines = csvFile.split(/\r\n|\n/);
    let headers = allTextLines[0].split(',');
    
    return headers;
}

function bringSub(catHeader, index, csvFile) {
    let takeSub = csvFile.split(/\r\n|\n/);
    let headers = takeSub[0].split(',');
    let lines = [];
    let tests = [];
    for (let i = 1; i < takeSub.length; i++) {
        tests[i] = takeSub[i];
    }
    lines[catHeader[index]] = tests;
    
    return ["teste", "testes"];
}


app.listen(5000);
console.log("listen on port 5000!"); 