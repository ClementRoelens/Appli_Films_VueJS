const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  }
});

module.exports = multer({storage: storage}).single('image');