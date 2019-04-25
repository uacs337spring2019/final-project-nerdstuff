const express = require("express");
const app = express();
const fs = require('fs');
app.use(express.static('public'));
console.log('web service started');
app.get('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  let type=req.query.type;
  let read;
  let path;
  let data={};
  if (type=="race") {
    path="races.txt";
    read=fs.readFileSync(path,"utf8");
    read=read.split("\n");
    i=Math.floor(Math.random() * read.length);
    res.send(JSON.stringify(read[i]));
  }
  if (type=="class") {
    path="classes.txt";
    read=fs.readFileSync(path,"utf8");
    read=read.split("\n");
    i=Math.floor(Math.random() * read.length);
    res.send(JSON.stringify(read[i]));
  }
  if (type=="background") {
    path="xbackgrounds.txt";
    read=fs.readFileSync(path,"utf8");
    read=read.split("\n");
    i=Math.floor(Math.random() * read.length);
    res.send(JSON.stringify(read[i]));
  }
})
app.listen(3000);
