const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema(
  {
    store_id: { type: String },
    tax_dsc: { type: String },
    tax_pct: { type: Number },
    tax_type: { type: String },
    action: { type: String },
    status: { type: Boolean },
    items: { type: Array },
    created_at: { type: Date },   
    updated_at: { type: Date },
  },
  { collection: "item_tax", versionKey: false }
);
module.exports = mongoose.model("item_tax", tableSchema);
