const EmpService = require('./EmpService');

class EmpConroller {
    constructor(){
        this._EmpService= new EmpService();
        this.manageCashierCollection = this.manageCashierCollection.bind(this);
        this.savePrinterConfiguration = this.savePrinterConfiguration.bind(this);
        this.saveGatewayCredential = this.saveGatewayCredential.bind(this);
        this.saveFloatAmount = this.saveFloatAmount.bind(this);
        
    }

    async manageCashierCollection(req, res){
        try {
            let body = req.body;
            console.log("manageCashierCollection body=", body);
            let {device_id,session_id, store_id, emp_no, status, float_amount, float_collection, tenders, amount_collected, change_returned } = body;
    
            if(!(status && store_id)) throw("status and store_id are required");    
            if(!(["Out","In"].includes(status))) throw("status must be [Out, In]");
            let obj=null
            if(status == 'Out'){
                if(!session_id) throw("Session id is required in case of OUT");
                await this._EmpService.checkEmpSession({session_id});
                let result=await this._EmpService.employeeTenderCollection({...body});            
                let res1 = await this._EmpService.updateEmpCollection({session_id}, result);            
                if(!res1){
                    throw("Cashier Collection Failed to log. Please try again!")
                }
                let finalResult = {...obj};
                return res.status(200).send({ 'status': true, 'message': 'Cashier Collection Logged Successfully!', 'data': finalResult });
            }else{
                let emp_session = await this._EmpService.empSession({store_id,emp_no});
                if(emp_session) throw("Employee seems to be already loged-in!");
                const result =await this._EmpService.saveEmpCollection(body);
                const _body = {
                    store_id,   
                    emp_no,
                    "type" : "In",
                    "emp_session_id":result.session_id,
                    "store_session_id" : result.store_status_id,
                    "float_amount" : result.float_amount 
                };
                const _result = await this._EmpService.saveFloatAmount(_body);                
                return res.status(200).send({ 'status': true, 'message': 'Cashier Collection Logged Successfully!', 'data': result });
            }                
        } catch (e) {
            console.log("manageCashierCollection Error : ",e);
            return res.status(500).send({ 'status': false, 'message': 'Something Went Wrong! ' + e, 'data': [] });
        }
    }

    async saveFloatAmount(req, res){
        try{
            const body = req.body;
            const { store_id,emp_no,emp_session_id, store_session_id, type} = body;
            if(!(store_id && emp_no && store_session_id && emp_session_id)){
                throw("Please provide required details");
            }  
            if(!(["Out", "In"].includes(type))){
                throw("Type is invalid, It should be Out or In");
            }         
            const result = await this._EmpService.saveFloatAmount(body);
            return res.status(200).send({status:true, message: "Saved", data: result});            
        }catch(err){
            console.log("Add Printer Configuration Error : ",err);
    	    return res.status(500).send({"status":false, "message":err, "data":null});
        }        
    }

    
    async savePrinterConfiguration(req, res){
        try{
            const body = req.body;
            const { store_id,device_id,name} = body;
            if(!(store_id && device_id,name)){
                throw("Please provide required details");
            }
           
            const result = await this._EmpService.savePrinterConfiguration(body);
            return res.status(200).send({status:true, message: "Saved", data: result});            
        }catch(err){
            console.log("Add Printer Configuration Error : ",err);
    	    return res.status(500).send({"status":false, "message":err, "data":null});
        }        
    }

    async saveGatewayCredential(req, res){
        try{
            const body = req.body;
            const { store_id,device_id} = body;
            if(!(store_id && device_id)){
                throw("Please provide required details");
            }
           
            const result = await this._EmpService.saveGatewayCredential(body);
            return res.status(200).send({status:true, message: "Saved", data: result});            
        }catch(err){
            console.log("Add Gateway Credential Error : ",err);
    	    return res.status(500).send({"status":false, "message":err, "data":null});
        }        
    }

    
}

module.exports = EmpConroller