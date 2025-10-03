const _ = require("lodash");
const EmpDataService = require('./EmpDataService');
const UtilDataService = require('../common/UtilDataService');

class AuthService {
    constructor(){
        this._EmpDataService= new EmpDataService();
        this._UtilDataService= new UtilDataService();
    }

    async employeeTenderCollection(body){
        let {session_id, store_id, emp_no, status, float_amount, float_collection, tenders, amount_collected, change_returned } = body;
        let DateObj= await this._UtilDataService.getDateByTz({store_id});       
        const {date_time, business_date, status_result}=DateObj;
        let obj=null;
        let data = await this._EmpDataService.getEmployeeTenderCollection({emp_session_id:session_id});
        let tendersList=[]
        if(data && data.length){
            for(let i=0;i<data.length;i++){
                let obj=data[i];
                let tenderObj= {
                    "system_amount" : obj.amount || 0, 
                    "collected_amount" : obj.amount || 0,                       
                    "tender_id" : obj.tender_id || '',
                    "tender_name" : obj.tender_name || '',
                    "tender_type" : obj.tender_type || '',        
                    "is_system":true,
                    "is_manual_update":false
                }                    
                let obj2=tenders.find((ele)=>ele.tender_id==obj.tender_id && ele.tender_type==obj.tender_type && ele.tender_name==obj.tender_name);                   
                if(obj2){
                    tenderObj.collected_amount=obj2.amount || 0;
                    tenderObj.is_system=false;
                    tenders = tenders.filter((ele)=>!(ele.tender_id==obj.tender_id && ele.tender_type==obj.tender_type && ele.tender_name==obj.tender_name));                        
                }else{
                    if(["COUPON","CA"].includes(obj.tender_id.toUpperCase())){
                        // tenderObj.collected_amount= 0;
                        tenderObj.is_system=false;                            
                    }
                }
                tendersList.push(tenderObj);                    
            }
        }
        if(tenders && tenders.length){
            for(let i=0;i<tenders.length;i++){
                tenders[i].system_amount=0;
                tenders[i].collected_amount= tenders[i].amount;
                tenders[i].is_system=false;
                tenders[i].is_manual_update=false;
            }
        }            
        tenders= [...tenders,...tendersList];
        
        amount_collected =_.sumBy(tenders, 'collected_amount'); 

        obj = {amount_collected, change_returned,tenders,float_collection}
        obj['status'] = "Out"
        obj['out_business_date'] = business_date
        obj['updated_at'] = date_time;
        obj["out_date_time"] = date_time; 
        return obj;
    }

    async checkEmpSession(body){        
        let checkExist = await this._EmpDataService.checkEmpSession({...body});
        if(checkExist){
            throw("Already looged out");
        }
    }

    async updateEmpCollection(emp, body){
        const data = await this._EmpDataService.updateEmpCollection(emp, body);
        return data;
    }

    async saveFloatAmount(body){
        const data = await this._EmpDataService.saveFloatAmount(body);
        return data;
    }

    async empSession(body){
        const result=await this._EmpDataService.getEmpSession(body);        
        return result;
    }  

    async saveEmpCollection(body){
        let {store_id, emp_no, float_amount, device_id } = body;
        let DateObj= await this._UtilDataService.getDateByTz({store_id});       
        const {date_time, business_date, status_result}=DateObj;
        let obj = {};
        obj = {float_amount: 0, store_id, emp_no}
        obj['status'] = "In";
        obj['session_status'] = device_id || "Active";
        obj['business_date'] = business_date;
        obj['created_at'] = date_time;
        obj["in_date_time"] = date_time; 
        obj["out_date_time"] = null;  
        obj["store_status_id"] = status_result._id;    
        const result = await this._EmpDataService.saveEmpCollection({...obj});
        if(!result){
            throw("Cashier Collection Failed to log. Please try again!")
        } 
        let session_id = result._id;
        obj= {...obj,session_id};
        return obj;
    }

    async savePrinterConfiguration(body){
        const result = await this._EmpDataService.savePrinterConfiguration(body);
        return result;        
    }

    async saveGatewayCredential(body){
        const result = await this._EmpDataService.saveGatewayCredential(body);
        return result;        
    }

    async autoCashierOut(body){
        const {store_id} = body;
        const _data = await this._EmpDataService.getAllEmpSession({store_id});
        if(!_data?.length) return true;
        for(let i = 0; i < _data?.length;i++){
            const {_id: session_id} = _data[i];
            const checkExist = await this._EmpDataService.checkEmpSession({session_id});
            if(checkExist){
                continue;
            }
            let DateObj= await this._UtilDataService.getDateByTz({store_id});       
            const {date_time, business_date}=DateObj;
            let data = await this._EmpDataService.getEmployeeTenderCollection({emp_session_id:session_id});
            let tenders=[];
            let amount_collected = 0;             
            if(data && data.length){
                for(let i=0;i<data.length;i++){
                    const obj=data[i];
                    const tenderObj= {
                        "system_amount" : obj.amount || 0, 
                        "collected_amount" : obj.amount || 0,                       
                        "tender_id" : obj.tender_id || '',
                        "tender_name" : obj.tender_name || '',
                        "tender_type" : obj.tender_type || '',        
                        "is_system":true,
                        "is_manual_update":false
                    } 
                    tenders.push(tenderObj);                    
                }
                amount_collected =_.sumBy(tenders, 'collected_amount');
            }            
            let obj = {amount_collected, tenders}
            obj['status'] = "Out"
            obj['out_business_date'] = business_date
            obj['updated_at'] = date_time;
            obj["out_date_time"] = date_time;          
            await this.updateEmpCollection({session_id}, obj);
        }
        return true;     
    }
    
    
}

module.exports = AuthService