var express = require('express');
//var vega =require('vega');

var app = express();
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});