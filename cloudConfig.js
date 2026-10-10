const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
  console.log("CLOUD CHECK:",
    process.env.CLOUD_NAME,
 process.env.CLOUD_API_KEY,
 process.env.CLOUD_API_SECRET)
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    format: async (req, file) => {'png','jpg','jpeg'},
  },
});

module.exports = {
    cloudinary,
    storage,
};