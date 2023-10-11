const multer = require('multer');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'CoShare/CAC',
        allowedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
    },
});

const upload = multer({
    storage,
    // limits: { fileSize: 1024 * 1024 * 5 }, // 5mb max
});

module.exports = upload;