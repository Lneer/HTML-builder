const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname);
const componentsPath = path.join(__dirname,'components');
const templatePath = path.join(__dirname, 'template.html');
const targetPath= path.join(__dirname,'project-dist');

const folderCreate = async() => {
  await fs.promises.mkdir(targetPath,{recursive:true});
};


const indexCreate = async() =>{
  let indexBuffer =  await fs.promises.readFile(templatePath).catch((err => console.log(err)));
  indexBuffer = indexBuffer.toString();
  const regexp = /{{\w+}}/g;
  let replaceArr = indexBuffer.match(regexp);

  for(let i= 0; i < replaceArr.length; i++){
    let parseElem = replaceArr[i].replace(/\W+/g,'');
    let data = await fs.promises.readFile(path.join(componentsPath,`${parseElem}.html`)).catch((err => console.log(err)));
    data = data.toString();
    indexBuffer = indexBuffer.replace(replaceArr[i],data);
  }
  
  fs.promises.writeFile(path.join(targetPath,'index.html'), indexBuffer);

};
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

const mergeCss = async(sourcePath,targetPath) => {
  const writeStream = fs.createWriteStream(path.join(targetPath,'style.css'));
  let fileList = await fs.promises.readdir(sourcePath, {withFileTypes:true});
  let cssFiles=[];
  fileList.forEach((elem) => {
    if(elem.isFile() && path.extname(elem.name) ==='.css'){
      cssFiles.push(elem.name);
    }
  });
  let bundlecss ='';
  cssFiles.forEach((elem, i) =>{
    const readStream = fs.createReadStream(path.join(sourcePath,elem));
    readStream.on('data', (chunk) => {
      bundlecss += chunk.toString(); 
      bundlecss += '\n';
      if(i === cssFiles.length-1){
        writeStream.write(bundlecss);}
    });
  });
  
};

folderCreate();
indexCreate();
copyDir(path.join(sourcePath, 'assets'), path.join(targetPath, 'assets'));
mergeCss(path.join(sourcePath, 'styles'), targetPath);