const express = require("express");
const router = express.Router();
const { Frame } = require("../models/Frame");
const { auth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

router.post("/upload", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const frame = new Frame({
      userId: req.user._id,
      imageUrl: req.file.path,
    });
    await frame.save();
    res.status(200).json({ success: true, frame });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
