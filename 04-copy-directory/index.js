const fs = require('fs');
const path = require('path');
const to = path.join(__dirname,'files-copy');
const from = path.join(__dirname,'files');

const copyDir =  async(sourcePath, targetPath) =>{
  fs.promises.rm(targetPath,{force:true, recursive: true})
    .then(() => fs.promises.mkdir(targetPath))
    .then(() => fs.promises.readdir(sourcePath,{withFileTypes:true}))
    .then((fileList) => fileList.forEach(elem => {
      if (elem.isFile()){
        let readSteam =  fs.createReadStream(path.join(sourcePath, elem.name));
        let writeStream = fs.createWriteStream (path.join(targetPath, elem.name));
        readSteam.pipe(writeStream);
      } else {
        copyDir(path.join(sourcePath, elem.name) ,path.join(targetPath, elem.name));
      }
    }))
    .catch((err) => {throw new Error(err);});
};

copyDir(from,to);


