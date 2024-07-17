const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const Frame = require("../models/Frame");

router.post("/upload", auth, upload.single("image"), async (req, res) => {
  try {
    const frame = new Frame({
      userId: req.user._id,
      imageUrl: req.file.path, // Cloudinary에 저장된 이미지 경로
    });

    await frame.save();
    res.status(200).json({ success: true, frame });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: err.message,
    });
  }
});

module.exports = router;
