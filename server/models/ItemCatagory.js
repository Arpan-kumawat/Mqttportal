const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema(
  {
    store_id: { type: String },
    master_category_id: { type: String },
    master_category_name: { type: String },
    category_id: { type: String },
    category_name: { type: String },
    cat_sequence_no: { type: Number },
    cat_img: { type: String },
    cat_banner_img: { type: String },
    cat_scheduler_id: { type: Array },
    category_color: { type: String },
    alias_name: { type: String },
    status: { type: Boolean },
    created_at: { type: Date },
    updated_at: { type: Date },
  },
  { collection: "item_category", versionKey: false }
);
module.exports = mongoose.model("item_category", itemSchema);
