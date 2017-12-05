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
    res.render('index', { prhase: PhraseResult, Category: categoryHeaders });
});

let categoryDefined = '';
let subCategoryDefined = '';
let subCategory = '';
app.post('/', urlencodedParser, function (req, res) {
    let turn = req.body.action;
    let cats = req.body.category;

    if (turn) {
        number = parseInt(number) + parseInt(turn);
        if (number == -1) {
            number = 0;
        }
    }
    
    if (cats) {
        category = csvSub(subsCategory, cats);
        subCategory = category;
        countCategory++;
        switch (countCategory) {
            case 1:
                categoryDefined = cats;
                break;
            case 2:
                subCategoryDefined = cats;
                number++;
                break;
            default:
                break;
        }
    } else {
        category = categoryHeaders;
    }

    let PhraseResult = txtLine(txtFile, number);
    let lastPhrase = txtLine(txtFile, number - 1);
    if (countCategory == 2 && subCategory) {
        writeIntoFile(lastPhrase, categoryHeaders[categoryDefined], subCategory[subCategoryDefined]);
        category = categoryHeaders;
        countCategory = 0;
    }

    res.render('index', { prhase: PhraseResult, Category: category });
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

function csvSub(array, index) {
    let subCategory = array[index];
    return subCategory;
}

function writeIntoFile(txtOutput, firstCategory, category) {
    console.log('"'+txtOutput + '", ' + firstCategory + '_' + category);
}

app.listen(5000);
console.log("listen on port 5000!"); 
