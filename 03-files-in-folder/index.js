const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname,'secret-folder');

fs.readdir(targetPath, {withFileTypes:true} , (err, data) =>{
  if(err){
    console.log(err);
  }
  data.forEach((elem)=> {
    if(elem.isFile()){
      let parsedName = path.parse(elem.name);
      let fullpath = path.join(targetPath, elem.name);
      fs.stat(fullpath, (err,stats)=>{
        if(err){
          console.log(err);
        }
        console.log(`${parsedName.name} - ${parsedName.ext.slice(1)} - ${Math.round(stats.size/1024)}Kb`);
      });
    }
  });
});