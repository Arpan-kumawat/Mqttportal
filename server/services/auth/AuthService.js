const _ = require("lodash");
const AuthDataService = require('./AuthDataService');

class AuthService {
    constructor(){
        this._AuthDataService= new AuthDataService();
    }

    async checkUser(body){
       const result = await this._AuthDataService.checkUser(body); 
       return result;        
    }

    
}

module.exports = AuthService