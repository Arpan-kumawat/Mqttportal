const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');
const tz = require('moment-timezone');
const CashierCollection = require('../../models/CashierCollection');
const orempf = require('../../models/EmployeeMaster');
const OrdersMaster = require('../../models/OrdersMaster');
const PrinterConfiguration = require('../../models/PrinterConfiguration');
const GatewayCredential = require('../../models/GatewayCredential');
const FloatAmountCollection = require('../../models/FloatAmountCollection');

const UtilDataService = require('../common/UtilDataService');

class EmpDataService {
    constructor(){
        this.UtilDataService= new UtilDataService();
    }

    async getEmpSession(body){
        let { store_id, emp_no } = body;
        let { date_time, business_date } = await this.UtilDataService.getDateByTz({store_id});    
        business_date = new Date(moment(business_date).format('YYYY-MM-DD') + "T00:00:00.000Z");    
        let cond = { store_id, business_date,status:"In" }
        if (emp_no) cond['emp_no'] = emp_no 
        const data = await CashierCollection.findOne(cond); 
        return data && data.toJSON() || null;
    }

    async getAllEmpSession(body){
        let { store_id, emp_no } = body;
        let { date_time, business_date } = await this.UtilDataService.getDateByTz({store_id});    
        business_date = new Date(moment(business_date).format('YYYY-MM-DD') + "T00:00:00.000Z");    
        let cond = { store_id, business_date,status:"In" };
        const data = await CashierCollection.find(cond); 
        return data;
    }

    async getEmpDetails(body){

        let emp = await orempf.findOne(body);
        return emp;
    }

    async checkEmpSession(body){
        let {session_id} = body;
        let cond = {};
        session_id = new ObjectId(session_id);
        cond['_id'] = session_id;
        let checkExist = await CashierCollection.findOne({...cond,"status":"Out"});
        return checkExist;
    }
  

    async getEmployeeTenderCollection(body){
        let {  emp_session_id,emp_no } = body;  
        let cond = { 
            "store_details.emp_session_id": new ObjectId(emp_session_id) 
        }
        cond['order_status'] = {"$in": ["Closed","CLOSE"] };
        cond["is_void"]={"$nin":[true]}; 
        if (emp_no) cond['store_details.emp_no'] = emp_no;
        let agg = [
            {"$match":cond},
            {"$unwind": "$payment_details"},
            {
               "$group": {
                       "_id": {
                           "tnd_type":"$payment_details.tnd_type",
                           "tnd_des":"$payment_details.tnd_des",
                           "tnd_code":"$payment_details.tnd_code"                       
                        },
                       "tender_id":{"$first": "$payment_details.tnd_code"},
                       "tender_name":{"$first": "$payment_details.tnd_des"},
                       "tender_type":{"$first": "$payment_details.tnd_type"},
                       "amount": { "$sum": "$payment_details.amount" }
                   }
             }
        ]
        const data = await OrdersMaster.aggregate(agg); 
        return data;  
    }

    async updateEmpCollection(emp, body){
        let {session_id} = emp;
        let cond = {};
        session_id = new ObjectId(session_id);
        cond['_id'] = session_id;
        let data = await CashierCollection.updateOne(cond, body);   
        return data
    }

    async saveEmpCollection(body){
        const data = await CashierCollection.create(body);     
        return data
    }

    async saveFloatAmount(body){
        const {store_id} = body;
        let { date_time, business_date } = await this.UtilDataService.getDateByTz({store_id});    
        business_date = new Date(moment(business_date).format('YYYY-MM-DD') + "T00:00:00.000Z");
        const data = await FloatAmountCollection.create({...body, business_date,created_at:date_time});     
        return data
    }

    async savePrinterConfiguration(body){
        let {store_id,device_id,name} = body;
        body = {...body,updated_at: new Date()};
        let cond = {store_id,device_id,name}
        if(body._id){
            cond._id =new ObjectId(body._id);
            delete body._id;
            body = {...body,"action" : "U",};
        }else{
            body = {...body,created_at: new Date(),"action" : "C"};
        }
        const result = await PrinterConfiguration.findOneAndUpdate({...cond}, {...body}, { upsert: true, new: true });  
        return result;    
    }

    async saveGatewayCredential(body){
        let {store_id,device_id} = body;
        body = {...body,updated_at: new Date()};
        let cond = {store_id,device_id}
        if(body._id){
            cond._id =new ObjectId(body._id);
            delete body._id;
            body = {...body,"action" : "U",};
        }else{
            body = {...body,created_at: new Date(),"action" : "C"};
        }
        const result = await GatewayCredential.findOneAndUpdate({...cond}, {...body}, { upsert: true, new: true });  
        return result;    
    }
}

module.exports = EmpDataService