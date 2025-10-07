const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const tableSchema = new Schema(
	{
		store_id: { type: String },
		purchase_id: { type: ObjectId },
		supplier_id: { type: ObjectId },
		row_material_id: { type: ObjectId },
		sku: { type: String },
		purchase_price: { type: Number },
		privoues_price: { type: Number },
		current_price: { type: Number },
		privoues_stock: { type: Number },
		purchase_stock: { type: Number },
		current_stock: { type: Number },
		consumption_stock: { type: Number },
		status: { type: Boolean },
		created_at: { type: Date },
		updated_at: { type: Date },
	},
	{ collection: 'inventory_stock', versionKey: false }
);
module.exports = mongoose.model('inventory_stock', tableSchema);