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
let number = 0;
app.set('view engine', 'ejs');

const types = {};
data.forEach(function (row) {
    if (!row.trim()) return;
    const [type, value] = row.split(',').map(s => s.trim());
    if (!types[type]) {
        types[type] = [];
    }
    types[type].push(value);
});
const final = Object.keys(types).reduce((arr, type) => {
    return arr.concat(
        [type, types[type]]
    );
}, []);

let Category = csvLine(final);

app.get('/', function (req, res) {
    let PhraseResult = txtLine(txtFile, number);
    res.render('index', { prhase: PhraseResult, Category: Category});
});

app.post('/', urlencodedParser, function (req, res) {
    let turn = req.body.action;
    let cats = req.body.category;
    console.log(cats);
    if(turn) {
        number = parseInt(number) + parseInt(turn);
        if (number == -1) {
            number = 0;
        }
    }
    let PhraseResult = txtLine(txtFile, number);
    if (cats) {
        catHeader = csvSub(final, cats);
    } else {
        catHeader = Category;
    }
    res.render('index', { prhase: PhraseResult, Category: catHeader});
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
    let headers = [];
    let i = 0;
    for (let index = 0; index < csvFile.length; index += 2) {
        headers[i] = csvFile[index];
        i++;
    }
    return headers;
}

function csvSub(array, index) {
    let i = 1;
    let subCategory = array[i];
    return subCategory;
}

app.listen(5000);
console.log("listen on port 5000!"); 
