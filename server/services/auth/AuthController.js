
const _ = require("lodash");

const AuthService = require('./AuthService');

class AuthConroller {
    constructor(){
        this._AuthService= new AuthService();
        this.login = this.login.bind(this);    
    }

    async login(req, res){
        try{
            const body = req.body;
            const Employee = await this._AuthService.checkUser(body);

            if(!Employee){
                throw("Please provide valid login details")
            }           
            
            return res.status(200).send({"status":true, "message":"Authentication Done Successfully !", "data":Employee});            
        }catch(err){
            console.log("login Error : ",err);
    	    return res.status(500).send({"status":false, "message":err, "data":null});
        }        
    }


}

module.exports = AuthConroller