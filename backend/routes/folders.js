const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Folder = require('../models/Folder');

router.post('/', auth, async (req, res) => {
  try {
    const { name, parent } = req.body;
    const folder = new Folder({ name, parent: parent || null, owner: req.user._id });
    await folder.save();
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { parent } = req.query;
    const filter = { owner: req.user._id };
    if (typeof parent !== 'undefined') filter.parent = parent === 'null' ? null : parent;
    const folders = await Folder.find(filter).sort('name');
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
