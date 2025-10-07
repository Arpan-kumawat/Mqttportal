var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    "_v":false,
    "correlationid" : { type: String },
    "deal_id" : { type: String },
    "identification" : { type: String },
    "source" : { type: String },
    "groupid" : { type: String },
    "createdatetime" : { type: String },
    "created_at" : { type: Date }
}, { collection: 'pmr_offer_custgrp_brdbk_seas' });
module.exports = mongoose.model('pmr_offer_custgrp_brdbk_seas', itemSchema);