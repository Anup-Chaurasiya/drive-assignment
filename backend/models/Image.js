const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  name: { type: String, required: true },
  filename: { type: String, required: true },
  url: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);
