const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const schema = new Schema(
  {
    store_id: { type: String },
    index: { type: String },
    video_link: { type: String },
    img_link: { type: String },
  },
  { versionKey: false, collection: "pos-media" }
);
module.exports = mongoose.model("pos-media", schema);
