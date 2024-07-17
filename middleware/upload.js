const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");

// 파일 필터링 함수
const fileFilter = (req, file, cb) => {
  // 허용할 파일 확장자
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

// Cloudinary 저장소 설정
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // 저장할 폴더
    format: async (req, file) => "png", // 저장할 파일 형식
    public_id: (req, file) => file.originalname.split(".")[0], // 파일명
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 파일 크기 제한 (5MB)
  fileFilter: fileFilter, // 파일 필터 설정
});

module.exports = upload;
