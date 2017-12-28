const http = require('http');
const fs = require('fs');
const csv = require('csv');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const txtFile = fs.readFileSync(__dirname + '/in/messages.txt', 'utf8');
const csvFile = fs.readFileSync(__dirname + '/in/classification.csv', 'utf8');
const outputFile = fs.createWriteStream(__dirname + '/out/outputFile.csv');

let classifiedPhrase = [];
let data = csvFile.split('\n');
let categoryDefined = '';
let subCategoryDefined = '';
let subCategory = '';
let cancelSkip = false;
let countCategory = 0;
let number = 0;
let position = '';
let classified = false;


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
let categoryHeaders = Object.keys(types);
const subsCategory = categoryHeaders.reduce((arr, type) => {
    return arr.concat(
        [types[type]]
    );
}, []);

app.get('/', function (req, res) {
    let PhraseResult = txtLine(txtFile, number);
    position = 'first';
    res.render('index', { prhase: PhraseResult, Category: categoryHeaders, SkipFail: cancelSkip, firstOrLast: position, phraseClassified: classified });
});

app.post('/', urlencodedParser, function (req, res) {
    let turn = req.body.action;
    let cats = req.body.category;
    let skip = req.body.skip;
    position = 'middlePrhase';
    classified = false;
    if (skip) {
        writeIntoFile(0, 0, 0);
        category = categoryHeaders;
        countCategory = 0;
        classifiedPhrase[number] = 'escaped phrase';
        number++;
    }
    if (turn) {
        cancelSkip = false;
        number = parseInt(number) + parseInt(turn);
        if (number == -1) {
            number = 0;
        }
    }
    if (number == 0) {
        position = 'first';
    }
    if (cats) {
        if (countCategory == 0) {
            category = bringSub(subsCategory, cats);
        }
        cancelSkip = true;
        subCategory = category;
        countCategory++;
        switch (countCategory) {
            case 1:
                categoryDefined = cats;
                break;
            case 2:
                subCategoryDefined = cats;
                position = 'middlePrhase';
                classifiedPhrase[number] = txtLine(txtFile, number);
                number++;
                cancelSkip = false;
                break;
                default:
                break;
            }
        } else {
            category = categoryHeaders;
        }
    let PhraseResult = txtLine(txtFile, number);
    let lastPhrase = txtLine(txtFile, number - 1);
    if (classifiedPhrase.indexOf(PhraseResult) +1) {
        PhraseResult = "Frase já classificada";
        classified = true;
    }
    if (PhraseResult == undefined) {
        PhraseResult = "fim do arquivo alcançado";
        position = 'last';
    }
    if (classifiedPhrase[number] == 'escaped phrase') {
        PhraseResult = "frase 'skipada'";
        classified = true;
    }
    if (countCategory == 2 && subCategory) {
        writeIntoFile(classifiedPhrase, categoryHeaders[categoryDefined], subCategory[subCategoryDefined]);
        category = categoryHeaders;
        countCategory = 0;
    }

    // trabalhar neste trecho
    // if (!classifiedPhrase[number]) {
    //     classifiedPhrase[number] = '';
    // }
    // if (classifiedPhrase && !classifiedPhrase.indexOf('')) {
    //     console.log("posição vazia");
    // }
    // if (classifiedPhrase && !classifiedPhrase.indexOf('')) {
    //     console.log("sim, voce conseguiu");
    // }

    res.render('index', { prhase: PhraseResult, Category: category, SkipFail: cancelSkip, firstOrLast: position, phraseClassified: classified });
    res.end();
});

function txtLine(txtFile, index) {
    let txtParse = txtFile.split("\n");
    let txtElement = txtParse[index];
    return txtElement;
}

function bringSub(array, index) {
    let subCategory = array[index];
    return subCategory;
}

function writeIntoFile(txtOutput, firstCategory, category) {
    let outputLine = '';
    if (txtOutput == 0) {
        outputLine = ' \n';
    } else {
        outputLine = '"' + txtOutput + '", ' + firstCategory + '_' + category + '\n';
    }
    outputFile.write(outputLine, 'UTF8');
}

app.listen(5000);
console.log("listen on port 5000!"); 
