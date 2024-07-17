const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowedFormats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage, fileFilter });

module.exports = { upload };
