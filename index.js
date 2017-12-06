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
const outputFile = fs.createWriteStream(__dirname + '/out/outputFile.csv');
let data = csvFile.split('\n');
let categoryDefined = '';
let subCategoryDefined = '';
let subCategory = '';
let cancelSkip = false;
let countCategory = 0;
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
let categoryHeaders = Object.keys(types);
const subsCategory = categoryHeaders.reduce((arr, type) => {
    return arr.concat(
        [types[type]]
    );
}, []);

app.get('/', function (req, res) {
    let PhraseResult = txtLine(txtFile, number);
    res.render('index', { prhase: PhraseResult, Category: categoryHeaders, SkipFail: cancelSkip });
});

app.post('/', urlencodedParser, function (req, res) {
    let turn = req.body.action;
    let cats = req.body.category;
    let skip = req.body.skip;

    if (skip) {
        writeIntoFile(0, 0, 0);
        category = categoryHeaders;
        countCategory = 0;
        number++;
    }

    if (turn) {
        number = parseInt(number) + parseInt(turn);
        if (number == -1) {
            number = 0;
        }
    }

    if (cats) {
        if (countCategory == 0) {
            category = bringSub(subsCategory, cats);
        }
        subCategory = category;
        cancelSkip = true;
        countCategory++;
        switch (countCategory) {
            case 1:
                categoryDefined = cats;
                break;
            case 2:
                subCategoryDefined = cats;
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
    if (PhraseResult == undefined) {
        number--;
        PhraseResult = "fim do arquivo alcançado";
    }

    if (countCategory == 2 && subCategory) {
        writeIntoFile(lastPhrase, categoryHeaders[categoryDefined], subCategory[subCategoryDefined]);
        category = categoryHeaders;
        countCategory = 0;
    }
    res.render('index', { prhase: PhraseResult, Category: category, SkipFail: cancelSkip });
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
