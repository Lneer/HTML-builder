const fs = require('fs');
const path = require('path');
const readLine = require('readline');

const targetPath = path.join(__dirname,'text.txt');
const writeSteam = fs.createWriteStream(targetPath);
const rl = readLine.createInterface(
  {
    input: process.stdin,
    output: process.stdout,
  });

const writeEnd = () => {
  console.log('goodbye!');
  writeSteam.end();
  rl.close();
  process.exit();
};

console.log('input you text:\t');

rl.on('line',(data) => {
  if(data.trim() === 'exit'){
    writeEnd();
  } else writeSteam.write(data + '\n');
});

rl.on('SIGINT', writeEnd);
