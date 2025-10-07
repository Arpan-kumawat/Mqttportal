const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const schema = new Schema(
  {
    title: { type: String },
    day_slots: { type: Array },
    cat_scheduler_id: { type: String },
    store_id: { type: String },
    filter: { type: String },
    created_at: {type:Date},
    updated_at: {type:Date},
  },
  { versionKey: false, collection: "category_scheduler" }
);
module.exports = mongoose.model("category_scheduler", schema);
