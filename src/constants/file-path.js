const path = require('path');
const fs = require('fs');
const multer = require('koa-multer');

const AVATAR_PATH = './uploads/avatar';
const PICTURE_PATH = './uploads/picture';

module.exports = {
  AVATAR_PATH, 
  PICTURE_PATH,
  storageFn
}


function storageFn(fileName) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir_name = path.resolve(__dirname, fileName);
      if(!fs.existsSync(dir_name)) {
        fs.mkdirSync(dir_name);
      }
      cb(null, dir_name)
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now}${path.extname(file.originalname)}`);
    }
  })

  return storage;
}
