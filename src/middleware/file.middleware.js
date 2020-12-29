const path = require('path');
const fs = require('fs');
const multer = require('koa-multer');
const Jimp = require('jimp');
// const { AVATAR_PATH, PICTURE_PATH } = require('../constants/file-path');

// const avatarUpload = multer({
//   dest: AVATAR_PATH
// });
// const avatarHandler = avatarUpload.single('avatar');

// const pictureUpload = multer({
//   dest: PICTURE_PATH
// });

// 递归创建文件夹
function mkdirs(dirpath) {
  if(!fs.existsSync(path.dirname(dirpath))) {
    mkdirs(path.dirname(dirpath));
  }

  fs.mkdirSync(dirpath);
}

// const avatarStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let dirname = path.resolve(__dirname, '../../uploads/avatar');
//     if(!fs.existsSync(dirname)) {
//       // fs.mkdirSync(dirname);
//       mkdirs(dirname);
//     }
//     cb(null, dirname)
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname))
//   }
// })
// const avatarUpload = multer({ storage: avatarStorage });

const AVATAR_PATH = '../../uploads/avatar';
const PICTURE_PATH = '../../uploads/picture';

function storageFn(filename) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let dirname = path.resolve(__dirname, filename);
      if(!fs.existsSync(dirname)) {
        // fs.mkdirSync(dirname);
        mkdirs(dirname);
      }
      cb(null, dirname)
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })

  return storage;
}


// 上传1张图片
const avatarUpload = multer({ storage: storageFn(AVATAR_PATH) });
const avatarHandler = avatarUpload.single('avatar');

// 上传多张图片
const pictureUpload = multer({ storage: storageFn(PICTURE_PATH) });
const pictureHandler = pictureUpload.array('picture', 9);


const pictureResize = async (ctx, next) => {
  try {
    // 1.获取所有的图像信息
    const files = ctx.req.files;

    // 2.对图像进行处理(sharp/jimp)
    for(let file of files) {
      const destPath = path.join(file.destination, file.filename);
      Jimp.read(file.path).then(image => {
        image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
        image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
        image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
      })
    }

    await next();
  } catch (error) {
    console.log(error);
  }
  
}

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize,
  AVATAR_PATH,
  PICTURE_PATH
}

