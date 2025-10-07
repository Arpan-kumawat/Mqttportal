const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const tableSchema = new Schema(
  {
    store_id: { type: String },
    item_name: { type: String },
    item_id: { type: String },
    add_ons: { type: String },
    recipe: [
      {
        variant_id: { type: String },
        variant_name: { type: String },
        raw_material: [
          {
            raw_name: { type: String },
            raw_id: { type: ObjectId },
            raw_qty: { type: Number },
            raw_unit: { type: String },
          },
        ],
      },
    ],
    status: { type: Boolean },
    created_at: { type: Date },
    updated_at: { type: Date },
  },
  { collection: "inventory_recipe", versionKey: false }
);
module.exports = mongoose.model("inventory_recipe", tableSchema);