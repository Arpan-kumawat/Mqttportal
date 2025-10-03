const _ = require("lodash");
const AuthDataService = require('./AuthDataService');
const StoreService = require('../store/StoreService');
const EmpDataService = require('../employee/EmpDataService');
const TransactionService = require('../transaction/TransactionService');
const UtilDataService = require('../common/UtilDataService');
const EmailSmsService = require('../common/EmailSmsService');

class AuthService {
    constructor(){
        this._AuthDataService= new AuthDataService();
        this._StoreService= new StoreService();
        this._UtilDataService= new UtilDataService();
        this._EmpDataService= new EmpDataService();
        this._EmailSmsService= new EmailSmsService();
        this._TransactionService= new TransactionService();
    }

    async checkUser(body){
       const result = await this._AuthDataService.checkUser(body); 
       return result;        
    }

    async updateEmployee(body){
        const result = await this._AuthDataService.updateEmployee(body); 
        return result;        
    }

    async sendSms(body){
        const result = await this._EmailSmsService.sendSmsByTwilio(body); 
        return result;        
    }

    async sendEmail(body){
        // const result = await this._EmailSmsService.sendEmail(body);
        body = { ...body , recipients: body.to}
        const result = await this._EmailSmsService.sendMailUsingAzureGraph(body); 
        return result;        
    }

    async checkFailledLoginTracking(body){
        const { emp_no} = body;
        let wrong_pwd_count = process.env.WRONG_PWD_COUNT || 3; 
        const wrongPwdData=await this._AuthDataService.checkFailledLoginTracking({emp_no});
        if(wrongPwdData && wrongPwdData.wrong_pwd_count && wrongPwdData.wrong_pwd_count >=wrong_pwd_count ){
            return Promise.resolve(true); 
        }
        return Promise.resolve(false);
    }

    async failledLoginTracking(body){  
        const { emp_no} = body;      
        let wrong_pwd_count = process.env.WRONG_PWD_COUNT || 3;  
        const wrongPwdData=await this._AuthDataService.failledLoginTracking({emp_no});        
        if(wrongPwdData && wrongPwdData.wrong_pwd_count && wrongPwdData.wrong_pwd_count >=wrong_pwd_count ){
            return Promise.resolve(true); 
        }
        return Promise.resolve(false);
    }

    async lastOfflneOrder(body){
        const {store_id, device_id} = body;
        const Info=await this._TransactionService.getLastOfflineOrderNo({store_id, device_id});
        return Info;
    }

    async terminalInfo(body){
        const {source,device_id} = body;
        const DeviceInfo=await this._AuthDataService.terminalInfo(body);
        const prefix = {'breez': "K",'leap': "P",'swyft':"M"};    
        if(!DeviceInfo){          
           const {lastNumber} = await this._AuthDataService.getTerminalLastNo(body);
           const newDevice = await this._AuthDataService.saveTerminalInfo({...body, terminal_id: lastNumber});
           return {source, device_id , terminal_id: `${prefix[source]}${lastNumber}`};
        }      
        return {source, device_id , terminal_id: `${prefix[source]}${DeviceInfo.terminal_id}`};;
    }

    async checkSubscription(body){
        const _data=await this._AuthDataService.checkSubscription(body);        
        return _data;
    }

    async printerConfiguration(body){
        const result=await this._AuthDataService.printerConfiguration(body);        
        return result;
    }

    async printerLabel(body){
        const result=await this._AuthDataService.printerLabel(body);        
        return result;
    }


    async storeVideo(body){
        const result=await this._AuthDataService.storeVideo(body);        
        return result;
    }

    async storeConfig(body){
        const result=await this._AuthDataService.storeConfig(body);        
        return result;
    }


    async storeStatus(body){
        const status=await this._UtilDataService.storeStatus(body);        
        return status;
    }

    async gatewayCredential(body){
        const gateway=await this._AuthDataService.gatewayCredential(body);        
        return gateway;
    }

    async saveSessionToken(body){
        const result=await this._AuthDataService.saveSessionToken(body);        
        return result;
    }

    async rolePosition(body){
        const result=await this._AuthDataService.rolePosition(body);        
        return result;
    }

    async roleSecurity(body){
        const result=await this._AuthDataService.roleSecurity(body);        
        return result;
    }

    async storeMapping(body){
        const result=await this._AuthDataService.storeMapping(body);        
        return result;
    }

    async storeDetails(body){
        const result=await this._StoreService.storeDetails(body);        
        return result;
    }

    async getStoreGatway(body){
        const result=await this._StoreService.getStoreGatway(body);        
        return result;
    }

    async getEmpDetails(body){
        const result=await this._EmpDataService.getEmpDetails(body);        
        return result;
    } 

    async empSession(body){
        const result=await this._EmpDataService.getEmpSession(body);        
        return result;
    } 
    
    async deviceLogout(body){       
        const result=await this._AuthDataService.deviceLogout(body);        
        return result;
    } 

    async storeTiming(body){       
        const result=await this._AuthDataService.storeTiming(body);        
        return result;
    } 
    
    
}

module.exports = AuthService