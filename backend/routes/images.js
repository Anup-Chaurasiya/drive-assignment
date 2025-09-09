const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Image = require('../models/Image');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadDir); },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, folder } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image required' });
    const url = `${process.env.BASE_URL || ''}/uploads/${req.file.filename}`;
    const image = new Image({
      name,
      filename: req.file.filename,
      url,
      owner: req.user._id,
      folder: folder || null
    });
    await image.save();
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { folder } = req.query;
    const filter = { owner: req.user._id };
    if (typeof folder !== 'undefined') filter.folder = folder === 'null' ? null : folder;
    const images = await Image.find(filter).sort('-createdAt');
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/search', auth, async (req, res) => {
  try {
    const q = req.query.q || '';
    const images = await Image.find({
      owner: req.user._id,
      name: { $regex: q, $options: 'i' }
    }).sort('-createdAt');
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
