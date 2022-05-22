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
  let header = await fs.promises.readFile(path.join(componentsPath, 'header.html')).catch((err => console.log(err)));
  let articles = await fs.promises.readFile(path.join(componentsPath, 'articles.html')).catch((err => console.log(err)));
  let footer = await fs.promises.readFile(path.join(componentsPath, 'footer.html')).catch((err => console.log(err)));
  
  indexBuffer = indexBuffer.toString();
  const componentsArr =[footer,header,articles];
  const replaceArr= ['{{footer}}','{{header}}', '{{articles}}'];

  componentsArr.forEach(elem =>elem.toString());

  replaceArr.forEach((elem,i) => {
    if(indexBuffer.includes(elem)){
      indexBuffer = indexBuffer.replace(elem,componentsArr[i]);
    }
  });
  fs.promises.writeFile(path.join(targetPath,'index.html'), indexBuffer).catch((err => console.log(err)));
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
folderCreate();
indexCreate();
copyDir(path.join(sourcePath, 'assets'), path.join(targetPath, 'assets'));
mergeCss(path.join(sourcePath, 'styles'), targetPath);