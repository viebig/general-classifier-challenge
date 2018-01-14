const fs                = require('fs');
const express           = require('express');
const bodyParser        = require('body-parser');
const app               = express();
const jsonParser        = bodyParser.json();
const urlencodedParser  = bodyParser.urlencoded({ extended: false });
const csvFile           = fs.readFileSync(__dirname + '/in/classification.csv', 'utf8');
const outputFile        = fs.createWriteStream(__dirname + '/out/outputFile.csv');

let txtFile             = fs.readFileSync(__dirname + '/in/messages.txt', 'utf8');
let phrase              = [];
txtFile                 = txtFile.split("\n");
phrase                  = txtFile;
let classifiedPhrase    = [];
let data                = csvFile.split('\n');
let categoryDefined     = '';
let subCategoryDefined  = '';
let subCategory         = '';
let cancelSkip          = false;
let countCategory       = 0;
let count               = 0;
let counter             = 1;
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
    res.render('index', {
        prhase: txtFile[count],
        Category: categoryHeaders,
        skipFail: true,
        keyPlace: 'previous',
        phraseClassified: true,
        number: counter,
        downloadFile: false
    });
});

let array       = [];
app.post('/', urlencodedParser, function (req, res) {
    let turn        = req.body.action;
    let cats        = req.body.category;
    let skip        = req.body.skip;
    let classified  = true;
    let Fullfile    = false;
    position = '';
    if (skip) {
        countCategory = 0;
        phrase[count] = 'Frase pulada';
        count++;
    }

    if (turn) {
        cancelSkip = false;
        count = parseInt(count) + parseInt(turn);
        if (count == -1) {
            count = 0;
        }
    }
    if (count == 0) {
        position = 'previous';
    }

    if (cats) {
        if (countCategory == 0) {
            subCategory = subsCategory[cats];
        }
        countCategory++;
        switch (countCategory) {
            case 1:
            categoryDefined = cats;
            categoryHeaders = subCategory;
            position = 'middle';
            break;
            case 2:
            subCategoryDefined = cats;
            phrase[count] = "Frase já classificada";
            array[count] = 'completed';
            categoryHeaders = Object.keys(types);
            count++;
            cancelSkip = false;
            position = '';
            break;
            default:
            break;
        }
    }

    phraseRender = phrase[count];
    counter = count + 1;
    if (phraseRender == undefined) {
        phraseRender = "Fim do arquivo alcançado";
        counter = '';
        position = 'next';
        classified = false;
    }
    if (phraseRender == 'Frase pulada' || phraseRender == 'Frase já classificada') {
            position = '';
            classified = false;
    }

    if (countCategory == 2 && subCategory) {
        writeIntoFile(txtFile[count-1], categoryHeaders[categoryDefined], subCategory[subCategoryDefined]);
        countCategory = 0;
    }
    
    if (array.length == txtFile.length) {
        Fullfile = true;
    }

    res.render('index', {
        prhase: phraseRender, 
        Category: categoryHeaders, 
        skipFail: cancelSkip, 
        keyPlace: position, 
        phraseClassified: classified, 
        number: counter, 
        downloadFile: Fullfile 
    });
    res.end();
});

app.get('/download', function(req, res) {
    res.sendFile(__dirname + '/out/outputFile.csv');
});

function writeIntoFile(txtOutput, firstCategory, category) {
    let outputLine = '';
    if (txtOutput == 0) {
        outputLine = '\n';
    } else {
        outputLine = '"' + txtOutput + '", ' + firstCategory + '_' + category + '\n';
    }        
    outputFile.write(outputLine, 'UTF8');
}

app.listen(3000);
console.log("listen on port 3000!"); 
