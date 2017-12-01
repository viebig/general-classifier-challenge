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
let data = csvFile.split('\n');
let final = {};
let number = 0;
app.set('view engine', 'ejs');

data.forEach(function (row) {
    row = row.split(',');
    if (!final[row[0]]) {
        final[row[0]] = [];
    }
    final[row[0]].push(row[1]);
});

app.get('/', function (req, res) {
    let PhraseResult = txtLine(txtFile, number);
    let CategoryResult = csvLine(final);
    res.render('index', { prhase: PhraseResult, CategoryA: CategoryResult[0], CategoryB: CategoryResult[1]});
});

app.post('/', urlencodedParser, function (req, res) {
    let turn = req.body.action;
    let cats = req.body.category;
    
    number = parseInt(number) + parseInt(turn);
    if (number == -1) {
        number = 0;
    }
    let PhraseResult = txtLine(txtFile, number);

    if (cats in final){
        catHeader = final[cats];
    } else {
        catHeader = csvLine(final);
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
    // let allTextLines = csvFile.split(/\r\n|\n/);
    // let headers = allTextLines[0].split(',');
     return ['headers', 'ghfg'];
}

app.listen(5000);
console.log("listen on port 5000!"); 