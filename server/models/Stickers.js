const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stickersSchema = new Schema({
  store_id: { type: String, required: true }, // Store ID associated with the stickers and frames
  index: { type: String , require: true},
  sticker_link: { type: String }, // Array of sticker names
},{ collection: 'sticker_details' });

// Create a Mongoose model for the "stickers_frames_details" collection
const StickersFramesDetail = mongoose.model('sticker_details', stickersSchema);

module.exports = StickersFramesDetail;
