const _ = require("lodash");
const moment = require("moment");
const tz = require("moment-timezone");
const StoreService = require('./StoreService');
const EmpService = require('../employee/EmpService');
const { GATEWAY_ENUM } = require('../util/enum');

class StoreController {
    constructor(){
        this._StoreService= new StoreService();
        this._EmpService = new EmpService();
        this.autoStoreSodEod = this.autoStoreSodEod.bind(this);
        this.storeDetails = this.storeDetails.bind(this);
        this.saveKdsSetting = this.saveKdsSetting.bind(this);
        this.kdsSetting = this.kdsSetting.bind(this);
        this.orderSource = this.orderSource.bind(this);
        this.associatedStoreInfo = this.associatedStoreInfo.bind(this);
        this.allStoreDetails = this.allStoreDetails.bind(this);
        this.cloverToken = this.cloverToken.bind(this); 
        
    }    
    
    async autoStoreSodEod(req, res){   
        try{    
            const {job_name, store_id, notify_email , notify_mobile_number = null} = req.body; 
            if(!(["open", "close"].includes(job_name) && store_id)){
                throw("please provide valid info !");
            } 
            if(job_name === 'open'){
               await this._StoreService.openStore({store_id}); 
            } 
            if(job_name === 'close'){
                await this._EmpService.autoCashierOut({store_id});
                await this._StoreService.closeStore({store_id,notify_email , notify_mobile_number}); 
            }
            return res.status(200).send({ 'status': true, 'message': `Auto ${job_name==='open'? "SOD": "EOD"}  job is successfully triggered. The changes will be available in next 5 minutes!` });   
        }catch(err){
            console.log("storeLongOff Error",err);
            return res.status(500).send({ 'status': false, 'message': 'Something Went Wrong! ' + err, 'data': [] });
        }
    } 

    async storeDetails(req, res){
        try{
            const body = req.body;
            const {store_id} = body;
            if(!store_id){
                throw("Please provide store id");
            }
            const data = await this._StoreService.storeDetails(body);            
            return res.status(200).send({status:true, message: "data found", data});            
        }catch(err){
            console.log("Store Details Error : ",err);
    	    return res.status(500).send({"status":false, "message":err, "data":null});
        }
    }

    async saveKdsSetting(req, res){ 
        try{
            const body = req.body;
            const { store_id,device_id} = body;
            if(!(store_id && device_id)){
                throw("Please provide required details");
            }
           
            const result = await this._StoreService.saveKdsSetting(body);
            return res.status(200).send({status:true, message: "Saved", data: result});            
        }catch(err){
            console.log("Add Order Type Error : ",err);
    	    return res.status(500).send({"status":false, "message":err, "data":null});
        }        
    }


    async kdsSetting(req, res){
        try{
            const body = req.body;
            const { store_id,device_id} = body;
            if(!(store_id && device_id)){
                throw("Please provide required details");
            }
            const result= await this._StoreService.kdsSetting(body); 
            return res.status(200).send({ 'status': true, 'message': 'Data Found!', 'data': result });
        }catch(err){
            console.log("orderType Error : ",err);
            return res.status(500).send({"status":false, "message":err, "data":null});
        } 
    }

    async orderSource(req, res){
        try{
            const body = req.body;
            const { store_id} = body;
            if(!(store_id )){
                throw("Please provide required details");
            }
            const result= await this._StoreService.orderSource(body); 
            return res.status(200).send({ 'status': true, 'message': 'Data Found!', 'data': result });
        }catch(err){
            console.log("orderType Error : ",err);
            return res.status(500).send({"status":false, "message":err, "data":null});
        } 
    }

    async associatedStoreInfo(req, res){
        try{
            const body = req.body;
            const { store_id} = body;
            if(!(store_id )){
                throw("Please provide required details");
            }
            const result= await this._StoreService.associatedStoreDetails(body); 
            return res.status(200).send({ 'status': true, 'message': 'Data Found!', 'data': result });
        }catch(err){
            console.log("associatedStore Error : ",err);
            return res.status(500).send({"status":false, "message":err, "data":null});
        } 
    }

    async allStoreDetails(req, res){
        try{
            const body = req.body;
            // const { store_id} = body;
            // if(!(store_id )){
            //     throw("Please provide required details");
            // }
            const Stores= await this._StoreService.allStoreInfo(); 


            return res.status(200).send({ 'status': true, 'message': 'Data Found!',  "data":{Stores}});
        }catch(err){
            console.log("ALLSTORE Error : ",err);
            return res.status(500).send({"status":false, "message":err, "data":null});
        } 
    }

    async cloverToken(req, res){
        try{
            const body = req.body;
            const {store_id} = body;
            if(!store_id){
                throw("Please valid store id !");
            }
            const gatewayInfo = await this._StoreService.getStoreGatway({store_id, type: GATEWAY_ENUM.CloverPaymentToken});
            if(!gatewayInfo){
                throw("Gateway info is not available into DB !");
            }
            const {info, client_id, client_secret,_id} = gatewayInfo;
            let {access_token, access_token_expiration, refresh_token} = info;
            const now = moment().unix();
            if(access_token_expiration < now){
                const result = await this._StoreService.cloverRefreshToken({client_id,client_secret,refresh_token }, _id);
                access_token = result.access_token;
            }            
            return res.status(200).send({ 'status': true, 'message': 'Data Found!',  "data":{access_token}});
        }catch(err){
            console.log("cloverToken Error : ",err);
            return res.status(500).send({"status":false, "message":err, "data":null});
        } 
    }
}

module.exports = StoreController