const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const frameSchema = new Schema({
  store_id: { type: String, required: true }, // Store ID associated with the stickers and frames
  frame_link: { type: String },
  index: { type: String , require: true}, // Array of sticker names
},{ collection: 'frame_details' });

// Create a Mongoose model for the "stickers_frames_details" collection
const StickersFramesDetail = mongoose.model('frame_details', frameSchema);

module.exports = StickersFramesDetail;
