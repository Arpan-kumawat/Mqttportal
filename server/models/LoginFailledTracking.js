const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const itemSchema = new Schema({
    "emp_no" : { type: String },
    "wrong_pwd_count" : { type: Number },    
    "last_updated_date_time" : { type: Date }
}, { collection: 'login_failled_tracking', versionKey:false });
module.exports = mongoose.model('login_failled_tracking', itemSchema);