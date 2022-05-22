
const fs = require('fs');
const path = require('path');

const from = path.join(__dirname,'styles');
const  to = path.join(__dirname,'project-dist');

const mergeCss = async(sourcePath,targetPath) => {
  const writeStream = fs.createWriteStream(path.join(targetPath,'bundle.css'));
  let fileList = await fs.promises.readdir(sourcePath, {withFileTypes:true});
  let cssFiles=[];
  fileList.forEach((elem) => {
    if(elem.isFile() && path.extname(elem.name) ==='.css'){
      cssFiles.push(elem.name);
    }
  });
  let bundlecss ='';
  cssFiles.forEach((elem) =>{
    const readStream = fs.createReadStream(path.join(sourcePath,elem));
    readStream.on('data', (chunk) => {
      bundlecss +=chunk.toString(); 
    });
    readStream.on('end', () => {
      writeStream.write(bundlecss);
    });
  });
  
};

mergeCss(from,to);



// let bundlecss = '';



// fs.promises.readdir(sourcePath, {withFileTypes:true})
//   .then((fileList) => {
//     let cssFiles=[];
//     fileList.forEach((elem) => {
//       if(elem.isFile() && path.extname(elem.name) ==='.css'){
//         cssFiles.push(elem.name);
//       }
//     });
//     return cssFiles;
//   })
//   .then((cssFiles) => {
//     cssFiles.forEach((elem) =>{
//       const readStream = fs.createReadStream(path.join(sourcePath,elem));
//       readStream.on('data', (chunk) => {
//         bundlecss +=chunk.toString(); 
//       });
//       readStream.on('end', () => {
//         writeStream.write(bundlecss);
//       });
//     });
//   });