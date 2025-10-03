const jwt = require('jwt-simple');
const _ = require("lodash");
const moment = require('moment');
const tz = require('moment-timezone');
const crypto = require('crypto');
const AuthService = require('./AuthService');

class AuthConroller {
    constructor(){
        this._AuthService= new AuthService();
        this.login = this.login.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.managerAuthentication = this.managerAuthentication.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.deviceLogout = this.deviceLogout.bind(this);
        this.storeDetails = this.storeDetails.bind(this);
        this.sendSms  = this.sendSms.bind(this);
        this.sendEmail = this.sendEmail.bind(this); 
        this.webLogin = this.webLogin.bind(this);       
    }

    async login(req, res){
        try{
            const body = req.body;
            const { emp_no, password,source ,device_id} = body;
            if(!(source && ['breez','leap','swyft','portal_login', 'store'].includes(source))){
                throw("source is required")
            }
            if(!(emp_no && password && typeof password == 'string')){
                throw("device_id, emp_no and password are required")
            }
            if(source !== 'portal_login'){
                if(!device_id) throw("device_id is required")
            }           
            if(source === 'portal_login'){
                const checkFailledLogin = await this._AuthService.checkFailledLoginTracking(body);
                if(checkFailledLogin){
                    return res.status(500).send({"status":true,code:500,"data": { account_locked: 1 }, "message":"Your account has been blocked please contact your admin to unblock it"})
                }
            }            
            const Employee = await this._AuthService.checkUser(body);
            if(!Employee){
                if(source === 'portal_login'){
                    let resLoginFailled=await this._AuthService.failledLoginTracking(body);
                    if(resLoginFailled){
                        return res.status(500).send({"status":true, "data": { account_locked: 1 }, "message":"Your account has been blocked please contact your admin to unblock it"})
                    }                
                }
                throw("Invalid Credentials!");
            }           
            
            let store_id = Employee.store_id;
            let device_info=null;
            let store_session_id = "";
            let storeStatus=null;
            let gateways_info=null;
            let business_date=null;
            let printer_configuration=null;
            let printer_label=null;
            let store_video=null;
            let StoreConfig=null;
            let store_timing=null;
            let offline_invoice_no= 0;
            if(!['portal_login', 'store'].includes(source)){
                device_info=await this._AuthService.terminalInfo({store_id,device_id, source}); 
                offline_invoice_no=await this._AuthService.lastOfflneOrder({store_id,device_id});                
                storeStatus = await this._AuthService.storeStatus({store_id});
                if(!storeStatus) throw("Store is closed!");
                if(storeStatus && storeStatus.status && storeStatus.status == "CLOSED") throw("Store is closed!");
                store_session_id = storeStatus._id;
                business_date=storeStatus.business_date;
                printer_configuration=await this._AuthService.printerConfiguration({store_id,device_id});  
                printer_label=await this._AuthService.printerLabel({store_id}); 
                gateways_info=await this._AuthService.gatewayCredential({store_id,device_id});  
                store_video=await this._AuthService.storeVideo({store_id}); 
                StoreConfig=await this._AuthService.storeConfig({store_id}); 
                store_timing=await this._AuthService.storeTiming({store_id});
            }

            const hmac_password = crypto.createHmac('sha256', Constants.SecurityKey).update(password).digest('hex');

            let encript_Data = { "expiresIn": Date.now() + (30*1000*60), "data": {emp_no,empscrt:hmac_password,store_id} }; // 30 mins expiry        
            const auth_token = jwt.encode(encript_Data, Constants.SecurityKey);
            if(source=='portal_login'){
                await this._AuthService.saveSessionToken({emp_no, auth_token });
            }
            if(!Employee.password_expiry){
                return res.status(202).send({"status":true, "data": { password_reset: 1, first_login: 1,emp_no, auth_token, store_id }, "message":"Please reset Password before first login."})
            }
            if(Employee.password_expiry <= Date.now()){
                return res.status(202).send({"status":true, "data": { password_reset: 1,emp_no, auth_token, store_id }, "message":"Password Expired! As per the terms the password should be reset every 30 days."})
            }
            const RolePosition  = await this._AuthService.rolePosition({position:Employee.position, store_id}); 
            if(!RolePosition){
                throw("Invalid User Role Position!");
            }
            const  RoleSecurity  = await this._AuthService.roleSecurity({primary_group:RolePosition.primary_group, store_id}); 
            if(!RoleSecurity){
                throw("Invalid User Role Security!");
            }
            let access_store=[];
            let access= RoleSecurity.access;
            if(RolePosition && RolePosition.primary_group) {
                Employee.primary_group=RolePosition.primary_group;
            }

            if(source=='portal_login'){
                let isAllowlogin=access && access['portal_login'] || false;
                if(!isAllowlogin){
                    throw("User is not allowed to login to system!")
                }
                const storeMapp = await this._AuthService.storeMapping({emp_no});
                if(storeMapp && storeMapp.length){
                    access_store=storeMapp.map((ele)=>ele.store_id);
                }
            }else{
                let breez_login=access && access['breez_login'] || false;
                let leap_login=access && access['leap_login'] || false;
                let swift_login=access && access['swift_login'] || false;
                if(!(breez_login || leap_login || swift_login)){
                    throw("User is not allowed to login to device!")
                }
            }
            let emp_session = await this._AuthService.empSession({store_id, emp_no});
            let session_id = emp_session ? emp_session._id : "";
            // if(source !== 'portal_login'){            
            //     if(emp_session && emp_session.session_status){
            //         if(!(emp_session.session_status==device_id)){
            //             throw("User is already logged in to another device!")
            //         }                
            //     }
            // }   
            let store_details = await this._AuthService.storeDetails({store_id});
            //************* Check subscription */
            if(source !=='portal_login'){
                let {parent_store_id} = store_details;
                const checkSubscription = await this._AuthService.checkSubscription({store_id: parent_store_id});
                if (!checkSubscription) {
                    throw("Store is not allow to login! please contact to Cyntra support team");
                }
            }            
            let date1 = new Date(Employee.password_expiry);
            let date2 = new Date(); 
            let password_reset_days = Math.round(Math.abs((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)));
            delete Employee.password;
            let finalRes = {
                offline_invoice_no,
                store_session_id,
                session_id,
                business_date,
                store_status: (storeStatus && storeStatus.status)?storeStatus.status:false,
                auth_token,
                password_reset_days,
                server_time: Date.now(),
                password_reset: 0,
                employee:Employee,
                store_details:store_details || {},
                access: RoleSecurity.access,
                device_info:device_info || {},
                gateways_info:gateways_info && gateways_info || {},
                access_store:access_store || [],
                printer_configuration:printer_configuration || [],
                printer_label:printer_label || [],
                store_video:store_video || [],
                StoreConfig:StoreConfig || [],
                store_timing:store_timing || {}
            }
            return res.status(200).send({"status":true, "message":"Authentication Done Successfully !", "data": finalRes});            
        }catch(err){
            console.log("login Error : ",err);
    	    return res.status(500).send({"status":false, "message":err, "data":null});
        }        
    }

    async updatePassword(req, res) {    
        try{
            const input = req.body;
            const { emp_no, oldpassword, newpassword, store_id } = input;
            if(!(emp_no && oldpassword && newpassword && store_id)){
                throw("store_id, emp_no, oldpassword and newpassword all are required");
            }
            const Data = await this._AuthService.checkUser({emp_no, password: oldpassword});
            if(!Data){
                throw("Invalid Employee ID, Please check password and username!")
            }
            let password_expiry = new Date();
                password_expiry.setDate(password_expiry.getDate() + 30);
            const uData = {
                store_id,
                emp_no,
                password: newpassword,
                oldpassword,
                password_last_updated: new Date(),
                password_expiry
            }
            const update = await this._AuthService.updateEmployee({...uData});            
            if(!update){
                throw("Password not updated !")
            }    
            const finalRes = {
                password_last_updated: new Date(),
                password_expiry,
                emp_no
            }
            return res.status(200).send({"status":true,"message":"Password Updated Successfully !", "data": finalRes});
        }catch(e){
            console.log("updatePassword Error : ",e);
            return res.status(500).send({"status":false,"message":e,"data":null});
        }
    };   
    
    async managerAuthentication(req, res) {  
        try{
            const input = req.body
            const { emp_no, password, reason_for_override, store_id, type ,reason} = input;
            if(!(emp_no && password && store_id && reason_for_override && reason)){
                throw("emp no, password reason, and reason_for_override all are required")
            }           
            const Employee = await this._AuthService.checkUser({emp_no, password});
            if(!Employee){
                throw("Please provide valid login details")
            }            
            const RolePosition  = await this._AuthService.rolePosition({position:Employee.position, store_id}); 
            if(!RolePosition){
                throw("Invalid User Role Position!")
            }
            const  RoleSecurity  = await this._AuthService.roleSecurity({primary_group:RolePosition.primary_group, store_id}); 
            if(!RoleSecurity){
                throw("Invalid User Role Security!");
            }
            let access= RoleSecurity.access;           
    
            const flag=access[reason]
            if(!flag){
                throw("You are not authorised!");
            }        
            const finalRes = { emp_no, reason_for_override, "created_at": moment() };
            return res.status(200).send({"status":true,"message": "Manager Authentication Done Successfully !", "data": finalRes});
        }catch(e){
            console.log("managerAuthentication Error : ",e);
            return res.status(500).send({"status":false, "message": e, "data":null});
        }
    };

    async resetPassword(req, res) {  
        try{
            const input = req.body
            const { emp_no,store_id, password } = input;
            if(!(emp_no && store_id)){
                throw("empno is required!!");
            }
            const Employee = await this._AuthService.checkUser({emp_no, store_id, password});
            if(!Employee){
                throw("Please provide valid login details");
            }
            let password_expiry = new Date();
            password_expiry.setDate(password_expiry.getDate() + 30);
       
            const new_password = Employee.store_id + Employee.emp_no.substr(Employee.emp_no.length - 5);
            const uData = {
                emp_no,
                store_id,
                password: new_password,
                password_last_updated: new Date(),
                password_expiry
            }
            const update = await this._AuthService.updateEmployee({ ...uData });
            const finalRes = {
                emp_no,
                new_password
            }
            return res.status(200).send({"status":true,"message":"Password reset Successfully !", "data": finalRes});
        }catch(e){
            console.log("resetPassword Error : ",e);
            return res.status(500).send({"status":false,"message":e,"data":null});
        }
    };

    async deviceLogout(req, res){ 
        try{
            const input = req.body;
            let {session_id,device_id} = input; 
            if(!(session_id && device_id)){
                throw("Please provide session_id && device_id");
            }            
            const update = await this._AuthService.deviceLogout({ ...input });
            return res.status(200).send({ 'status': true, 'message': 'Log out Successfully!', 'data': {} });
        }catch(err){
            console.log("resetPassword Error : ",err);
            return res.status(500).send({"status":false,"message":err,"data":null});
        }        
    }

    async sendSms(req, res){ 
        try{
            const input = req.body;
            let {body,to, store_id} = input; 
            if(!(body && to && store_id)){
                throw("Please provide required details");
            }            
            const update = await this._AuthService.sendSms({ ...input });
            return res.status(200).send({ 'status': true, 'message': 'Send sms successfully!', 'data': update });
        }catch(err){
            console.log("resetPassword Error : ",err);
            return res.status(500).send({"status":false,"message":err,"data":null});
        }        
    }

    async sendEmail(req, res){ 
        try{
            const input = req.body;
            let {body,to,subject, store_id} = input; 
            if(!(body && to && store_id && subject)){
                throw("Please provide required details");
            }            
            const update = await this._AuthService.sendEmail({ ...input });
            return res.status(200).send({ 'status': true, 'message': 'Send sms successfully!', 'data': update });
        }catch(err){
            console.log("resetPassword Error : ",err);
            return res.status(500).send({"status":false,"message":err,"data":null});
        }        
    }

    async storeDetails(req, res){
        try{
            const body  = req.body;
            const {store_id} = body;
            if(!store_id){
                throw("Please provide store id");
            }
            const data = await this._AuthService.storeDetails({store_id});
            return res.status(200).send({"status":true, "message":"Data Found!", data});            
        }catch(err){
            console.log("login Error : ",err);
    	    return res.status(500).send({"status":false, "message":err, "data":null});
        }        
    }

    async webLogin(req, res){
        try{
            const {store_id} = req.body;
            if(!store_id){
                throw("Please provide required details !");
            }            
            const storeStatus = await this._AuthService.storeStatus({store_id});
            if(!storeStatus) throw("Store is closed!");
            if(storeStatus && storeStatus.status && storeStatus.status == "CLOSED") throw("Store is closed!");

            const password  = `cyn_${store_id}`;
            const hmac_password = crypto.createHmac('sha256', Constants.SecurityKey).update(password).digest('hex');

            const encript_Data = { "expiresIn": Date.now() + (30*1000*60), "data": {str_loc:store_id,empscrt:hmac_password} }; // 30 mins expiry        
            const AuthToken = jwt.encode(encript_Data, Constants.SecurityKey);

            let [store_details, StoreConfig, gateway, empDetail]= await Promise.all([
                this._AuthService.storeDetails({store_id}),
                this._AuthService.storeConfig({store_id}),
                this._AuthService.getStoreGatway({store_id}),
                this._AuthService.getEmpDetails({store_id,"is_created_by_root" : true})
            ]);
            store_details = {
                ...store_details
                ,emp_no: empDetail?.emp_no,
                emp_session_id: empDetail?.emp_session_id
                ,
                gateway:{
                    mid:gateway?.merchant_id,
                    type:gateway?.type,
                    host: gateway?.type === "paytm"? process.env.PAYTM_HOST: ""
                },
            };
            return res.status(200).send({"status":true, "message":"authenticated succesfully", "data":{store_id,token: AuthToken, store_details ,StoreConfig}});
        }catch(err){
            console.log("store login Error : ",err);
    	    return res.status(403).send({"status":false, "message":err, "data":null});
        }   
    }
    
}

module.exports = AuthConroller