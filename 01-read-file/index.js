const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname,'text.txt');

const readSteam = fs.createReadStream(targetPath);
let result = '';

readSteam.on('error',(err) =>{
  console.log(err);
});

readSteam.on('data',(chunk) =>{
  result += chunk.toString();
});
readSteam.on('end',() =>{
  console.log(result);
});
