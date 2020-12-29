const fs = require('fs');
const path = require('path');

// 无限递归创建文件夹
function mkdirs(dirpath) {
  if(!fs.existsSync(path.dirname(dirpath))) {
    mkdirs(path.dirname(dirpath));
  }

  fs.mkdirSync(dirpath);
}

// 2.1 读取文件夹中的所有文件
// fs.readdir(dirname, (err, files) => {
//   console.log(files);
// });

// 2.2 递归读取文件
function getFiles(dirname) {
  fs.readdir(dirname, { withFileTypes: true }, (err, files) => {
    for (let file of files) {
      // fs.stat(file) 可以, 但是有点麻烦
      if (file.isDirectory()) {
        const filepath = path.resolve(dirname, file.name);
        getFiles(filepath);
      } else {
        console.log(file.name);
      }
    }
  });
}

// getFiles(dirname);


// 递归创建目录 异步方法  
// function mkdirs(dirname, callback) {  
//   fs.exists(dirname, function (exists) {  
//       if (exists) {  
//           callback();  
//       } else {  
//           // console.log(path.dirname(dirname));  
//           mkdirs(path.dirname(dirname), function () {  
//               fs.mkdir(dirname, callback);  
//               console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
//           });  
//       }  
//   });  
// }


// 递归创建目录 同步方法
// function mkdirsSync(dirname) {
//   if (fs.existsSync(dirname)) {
//     return true;
//   } else {
//     if (mkdirsSync(path.dirname(dirname))) {
//       fs.mkdirSync(dirname);
//       return true;
//     }
//   }
// }
