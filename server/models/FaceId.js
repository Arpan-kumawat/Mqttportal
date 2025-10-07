var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
var itemSchema = new Schema({
    faceid: { type: Object }
}, { collection: 'FaceId' , versionKey: false });

module.exports = mongoose.model('FaceId', itemSchema);
