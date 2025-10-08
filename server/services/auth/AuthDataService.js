const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const EmployeeMaster = require('../../models/EmployeeMaster');

class AuthDataService {
 

 

    async checkUser(body){
        const {emp_no, password, store_id} = body;
        let cond = {emp_no, empopc:{"$ne":"D"}};
        if(password) cond = {...cond, password };
        const data = await EmployeeMaster.findOne({ ...cond });        
        return data && data.toJSON() || null;
    }

}

module.exports = AuthDataService