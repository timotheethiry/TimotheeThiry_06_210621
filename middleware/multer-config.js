const multer = require('multer');

/* traduction myme types to file extensions respectively */
const MIME_TYPES  = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/* set the storage location for files uploads, changes filename from 'xxx xxx' to 'xxx_xxx', add date into filename */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

/* multer configured with storage constant, set to handle images only */
module.exports = multer({ storage }).single('image');