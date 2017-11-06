var express = require('express');
var app = express();
var router = express.Router();

var path = __dirname + '/';

app.use('/', router);
app.use('/', express.static(__dirname + '/www')); // redirect root
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

router.get('/',function(req, res){
  res.sendFile(path + 'index.html');
});

app.use('*', function (req, res) {
    res.send('Error 404: Not Found!');
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
