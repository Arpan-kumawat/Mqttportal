const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');
const tz = require('moment-timezone');
const LoginFailledTracking = require('../../models/LoginFailledTracking');
const EmployeeMaster = require('../../models/EmployeeMaster');
const TerminalInfo = require('../../models/TerminalInfo');
const StoreSubcription = require('../../models/StoreSubcription');
const GatewayCredential = require('../../models/GatewayCredential');
const SessionJWT = require('../../models/SessionJWT');
const RolePosition = require('../../models/RolePosition');
const RoleSecurity = require('../../models/RoleSecurity');
const StoreUserMapping = require('../../models/StoreUserMapping');
const StoreMaster = require('../../models/StoreMaster');
const CashierCollection = require('../../models/CashierCollection');
const OrdersMaster = require('../../models/OrdersMaster');
const PrinterConfiguration = require('../../models/PrinterConfiguration');
const StoreVideo = require('../../models/StoreVideo');
const storeConfig = require('../../models/StoreConfiguration');
const PrinterLabel = require('../../models/PrinterLabel');
const BgJobScheduler = require('../../models/BgJobScheduler');
const UtilDataService = require('../common/UtilDataService');

class AuthDataService {
    constructor(){
        this.UtilDataService= new UtilDataService();
    }

    async updateEmployee(body){
        const {emp_no, store_id,_id} = body;
        let cond = {emp_no};        
        if(store_id) cond = {...cond, store_id };
        if(_id){
            cond = {...cond, _id: new ObjectId(_id) };
            delete body._id;
        } 
        const data = await EmployeeMaster.findOneAndUpdate({ ...cond },{ ...body }, { upsert: true, new: true });        
        return data && data.toJSON() || null;
    }

    async checkUser(body){
        const {emp_no, password, store_id} = body;
        let cond = {emp_no, empopc:{"$ne":"D"}};
        if(password) cond = {...cond, password };
        if(store_id) cond = {...cond, store_id };
        const data = await EmployeeMaster.findOne({ ...cond });        
        return data && data.toJSON() || null;
    }

    async checkFailledLoginTracking(body){
        const {emp_no} = body;
        const wrongPwdData=await LoginFailledTracking.findOne({emp_no})
        return wrongPwdData;
    }

    async failledLoginTracking(body){
        const {emp_no} = body;    
        let timeZone = Constants.defualt_tz;          
        let dec = moment();           
        let DateTime = dec.tz(timeZone).format('YYYY-MM-DD HH:mm:ss Z UTC');    
        let data_login = {
            "last_updated_date_time": DateTime,
            "emp_no":emp_no,
            "$inc": { wrong_pwd_count: 1 }
        }
        const data = await LoginFailledTracking.findOneAndUpdate({"emp_no":emp_no}, data_login, {upsert: true, new: true });
        return data;
    } 

    async getTerminalLastNo(body) {       
        const {store_id, source} = body;
        let data= await TerminalInfo.findOne({store_id, source, status: true}).sort('-terminal_id');              
        if(!data){
            return {lastNumber: 1};
        }        
        return {lastNumber: data?.terminal_id +1};
    }
    
    async terminalInfo(body){
        const {store_id, device_id, source} = body;
        const data= await TerminalInfo.findOne({store_id, device_id, source, status: true});
        return data;
    }

    async saveTerminalInfo(body){        
        const {store_id, device_id, terminal_id, source} = body;
        let _date=new Date(moment().format('YYYY-MM-DD') + "T00:00:00.000Z");
        const obj = {
            "terminal_id" : terminal_id,
            "store_id" : store_id,
            "device_id" : device_id,
            "source":source,
            "pilot":true,
            "created_at" : _date,
            "status": true
        }
        const data= await TerminalInfo.create({...obj});
        return data;
    }

    async checkSubscription(body){
        const {store_id} = body;
        let _date=new Date(moment().format('YYYY-MM-DD') + "T00:00:00.000Z");
        const cond = { 
            store_id, 
            status:true,
            start_date: { "$lte": _date},
            end_date: {"$gte": _date}
        };
        const data= await StoreSubcription.findOne({...cond});
        return data;
    }    

    async printerConfiguration(body){
        const {store_id,device_id} = body;
        const data= await PrinterConfiguration.find({store_id,device_id});
        return data;
    }  

    async printerLabel(body){
        const {store_id} = body;
        const data= await PrinterLabel.find({store_id});
        return data;
    }

    async storeVideo(body){
        const {store_id} = body;
        const data= await StoreVideo.find({store_id});
        return data;
    }

    async storeConfig(body){
        const {store_id} = body;
        const data= await storeConfig.find({store_id});
        return data;
    }

    async gatewayCredential(body){
        const {store_id,device_id} = body;
        let cond = {store_id, status:true};
        if(device_id) cond = {...cond, device_id};
        const data= await GatewayCredential.findOne(cond);
        return data;
    }

    async saveSessionToken(body){
        const {emp_no, auth_token} = body;
        const data= await SessionJWT.create({emp_no, jwt:auth_token });
        return data;
    }

    async rolePosition(body){
        const {position,store_id} = body;
        const data = await RolePosition.findOne({ position, store_id });
        return data && data.toJSON() || null;
    }

    async roleSecurity(body){
        const {primary_group, store_id} = body;
        const data = await RoleSecurity.findOne({ "key": primary_group, store_id });
        return data && data.toJSON() || null;
    }

    async storeMapping(body){
        const {emp_no} = body;
        const data = await StoreUserMapping.find({emp_no,"status" : "ACTIVE"});
        return data;
    }

    async storeDetails(body){
        const {store_id} = body;
        const data = await StoreMaster.findOne({ store_id }); 
        return data && data.toJSON() || null;
    } 

    async deviceLogout(body){
        let {device_id, session_id} = body;
        let cond = {};
        session_id = new ObjectId(session_id);
        cond['_id'] = session_id;        
        let obj={};
        obj['session_status'] = device_id; 
        const data = await CashierCollection.updateOne({...cond},{ ...body }); 
        return data;
    } 

    async storeTiming(body){
        const {store_id} = body;
        const data= await BgJobScheduler.findOne({store_id});
        return data;
    }

    

}

module.exports = AuthDataService