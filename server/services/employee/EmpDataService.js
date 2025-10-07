const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const orempf = require('../../models/EmployeeMaster');


class EmpDataService {
    constructor(){
       
    }

  async generateEmpId(body) {
    const { store_id } = body;
    const doc = await orempf.findOne({ store_id })
      .sort({ emp_no: -1 })
      .collation({ locale: "en_US", numericOrdering: true })
      .limit(1)
      .exec();

    const emp_no = doc?.emp_no ? doc.emp_no : `${store_id}0`;

    const max_number = emp_no.replaceAll(`${store_id}`, "");

    return `${store_id}${parseInt(max_number) + 1}`;
  }

  async saveEmpDetail(body) {
    let { store_id, emp_no } = body;
    emp_no = emp_no.toString();
    body = { ...body, updated_at: new Date() };
    let cond = { emp_no };
    if (body._id) {
      cond._id = new ObjectId(body._id);
      delete body._id;
      body = { ...body, action: "U" };
    } else {
      const password = store_id + emp_no.slice(-5);
      body = {
        ...body,
        password,
        created_at: new Date(),
        action: "C",
        status: true,
      };
    }
    const result = await orempf.findOneAndUpdate(
      { ...cond },
      { ...body },
      { upsert: true, new: true }
    );
    return result;
  }


}

module.exports = EmpDataService