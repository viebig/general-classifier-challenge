const http = require('http');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const txtFile = fs.readFileSync(__dirname + '/in/messages.txt', 'utf8');
const csvFile = fs.readFileSync(__dirname + '/in/classification.csv', 'utf8');
let number = 0;
app.set('view engine', 'ejs');

// let begin = csvFile.split('\n');
// let categoryFile = [];
// begin.forEach(function (row) {
//     let obj = row.split(',');
//     if (!categoryFile[obj[0]]) {
//         categoryFile[obj[0]] = [];
//     }
//     categoryFile[obj[0]].push(obj[1]);
// });
// let category = Object.keys(categoryFile);


app.get('/', function(req, res) {
    res.render('index', {prhase: PhraseResult, CategoryA: category[0], CategoryB: category[1]});
});

app.post('/', urlencodedParser, function (req, res) {
    let turn = req.body.action;
    let cats = req.body.category;
    if (turn) {
        number = parseInt(number) + parseInt(turn);
    }
    if(number == -1 ) {
        number = 0;
    }
    let PhraseResult = txtLine(txtFile, number);
    res.render('index', { prhase: PhraseResult, CategoryA: category[0], CategoryB: category[1] });
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

function bringSub(){
    return 'teste';
}

app.listen(5000);
console.log("listen on port 5000!");