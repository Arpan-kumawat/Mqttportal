const _ = require("lodash");
const EmpDataService = require('./EmpDataService');


class AuthService {
    constructor() {
        this._EmpDataService = new EmpDataService();

    }




    async empList(body) {
        const data = await this._EmpDataService.getEmpList(body);
        return data;
    }

    async saveEmp(body) {
        const { store_id, emp_no, } = body;
        if (!emp_no) {
            const _empid = await this._EmpDataService.generateEmpId({
                store_id,
            });
            body = { ...body, emp_no: _empid };
        }

        const result = await this._EmpDataService.saveEmpDetail(body);



        //   const emailHtml = ({

        //     emp_no: result?.emp_no,
        //     password: result?.password,

        //   });
        //   const _obj = {
        //     to: email_id,
        //     subject:
        //       "Congratulations! Your Store Setup is Complete - Get Started Now!",
        //     body: emailHtml,
        //     isHtml: true,
        //   };
        // await this._EmailSmsService.sendGmail(_obj);
        //   await this._EmailSmsService.sendMailUsingAzureGraph(_obj);

        delete result.password;
        return result;
    }

}

module.exports = AuthService