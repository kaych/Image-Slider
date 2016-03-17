var express = require('express');
var app = express();
app.use(express.static('public'));

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('../../index');
});

app.listen(1414, function () {
  console.log('Now listening on port 1414!');
});