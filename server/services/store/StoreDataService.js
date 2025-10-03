const mongoose = require("mongoose");
const axios = require("axios");
const ObjectId = mongoose.Types.ObjectId;
const moment = require("moment");
const tz = require("moment-timezone");
const StoreMaster = require("../../models/StoreMaster");
const GatewayCredential = require("../../models/GatewayCredential");
const CashierCollection = require("../../models/CashierCollection");
const StoreCurrentStatus = require("../../models/StoreCurrentStatus");
const UtilDataService = require("../common/UtilDataService");
const KdsSettings = require("../../models/KdsSettings");
const OrderSourceList = require("../../models/OrderSourceList");
const AssociatedStore = require("../../models/AssociatedStore");
const StoreConfiguration = require("../../models/StoreConfiguration");

class StoreDataService {
  constructor() {
    this.UtilDataService = new UtilDataService();
  }

  async getStoreDetails(body, selectedFields={}) {
    let { store_id } = body;
    let cond = { store_id: store_id };
    const data = await StoreMaster.findOne(cond, selectedFields);
    return (data && data.toJSON()) || null;
  }

  async checkStoreConfig(body) {
    const isSeparateStore = await StoreMaster.exists({ ...body });
    return isSeparateStore;
  }

  async getStoreConfig(body) {
    const { store_id } = body;
    const data = await StoreConfiguration.findOne({ store_id });
    return (data && data.toJSON()) || null;
  }

  async getStoreGatway(body) {
    let { store_id, type } = body;
    let cond = { store_id: store_id, status: true };
    if (type) cond = { ...cond, type };
    const data = await GatewayCredential.findOne(cond);
    return (data && data.toJSON()) || null;
  }

  async getEmpSession(body) {
    let { store_id, emp_no } = body;
    let { date_time, business_date } = await this.UtilDataService.getDateByTz({
      store_id,
    });
    business_date = new Date(
      moment(business_date).format("YYYY-MM-DD") + "T00:00:00.000Z"
    );
    let cond = { store_id: store_id, business_date, status: "In" };
    if (emp_no) cond["emp_no"] = emp_no;
    const data = await CashierCollection.findOne(cond);
    return (data && data.toJSON()) || null;
  }

  async getEmployeeCollection(body) {
    let { store_id, emp_no } = body;
    let { status_result } = await this.UtilDataService.getDateByTz({
      store_id: store_id,
    });
    let store_status_id = new ObjectId(status_result._id);
    let cond = {
      store_id: store_id,
      store_status_id: store_status_id,
      emp_no: { $nin: [null, ""] },
    };
    if (emp_no) cond["emp_no"] = emp_no;
    const data = await CashierCollection.find(cond);
    return data;
  }

  async closeStore(body) {
    let { store_id } = body;
    let data_1 = {
      store_id: store_id,
      status: "CLOSED",
    };
    let { date_time } = await this.UtilDataService.getDateByTz({ store_id });
    let result1 = await StoreCurrentStatus.findOne({ store_id }, null, {
      sort: { opening_date: -1 },
    });
    let obj = { closing_date: date_time };
    if (result1) {
      if (result1.status != "OPEN") return false;
      let _id = result1._id;
      data_1 = { ...data_1, ...obj };
      await StoreCurrentStatus.updateOne({ _id }, data_1);
    }
    return true;
  }

  async openStore(body) {
    let { store_id } = body;
    let data_1 = {
      store_id: store_id,
      status: "OPEN",
    };
    let { date_time, calender_date, tomorrow_business_date } =
      await this.UtilDataService.getDateByTz({ store_id });
    let result1 = await StoreCurrentStatus.findOne({ store_id }, null, {
      sort: { opening_date: -1 },
    });
    let obj = {
      business_date: calender_date,
      opening_date: date_time,
      closing_date: null,
    };
    if (result1) {
      if (result1.status != "CLOSED") return result1;
      let last_business_date = result1.business_date;
      let today_business_date = new Date(
        moment(calender_date).format("YYYY-MM-DD")
      );
      if (moment(today_business_date).isSame(last_business_date)) {
        obj.business_date = tomorrow_business_date;
      } else if (moment(today_business_date).isBefore(last_business_date)) {
        obj.business_date = tomorrow_business_date;
      } else if (moment(today_business_date).isAfter(last_business_date)) {
        obj.business_date = calender_date;
      }
    }
    data_1 = { ...data_1, ...obj };
    await StoreCurrentStatus.create(data_1);
    return data_1;
  }

  async saveKdsSetting(body) {
    let { store_id, device_id } = body;
    body = { ...body, updated_at: new Date() };
    let cond = { store_id, device_id };
    if (body._id) {
      cond._id = new ObjectId(body._id);
      delete body._id;
      body = { ...body, action: "U" };
    } else {
      body = { ...body, created_at: new Date(), action: "C" };
    }

    const result = await KdsSettings.findOneAndUpdate(
      { ...cond },
      { ...body },
      { upsert: true, new: true }
    );
    return result;
  }

  async kdsSettingDetails(body) {
    const { store_id, device_id } = body;
    let cond = {
      store_id: store_id.toString(),
      device_id: device_id,
    };
    const data = await KdsSettings.findOne(cond, null, {
      sort: { created_at: -1 },
    });
    return data;
  }

  async orderSourceDetails(body) {
    const { store_id } = body;
    let cond = {
      store_id: store_id.toString(),
    };
    const data = await OrderSourceList.find(cond);
    return data;
  }

  async getAssociatedStore(body) {
    const { store_id } = body;
    const isSeparateStore = await StoreMaster.exists({
      store_id,
      is_separate: true,
    });
    if (isSeparateStore) {
      return { store_id };
    }
    const data = await AssociatedStore.findOne({ associated: store_id });
    return (data && data.toJSON()) || null;
  }

  async getAllAssociatedStore(body) {
    const { store_id } = body;    
    const data = await AssociatedStore.findOne({ associated: store_id });
    return (data && data.toJSON()) || null;
  }

  async checkMasterAndGetAllAssociatedStore(body) {
    const { store_id } = body;    
    const data = await AssociatedStore.findOne({ store_id: store_id });
    return (data && data.toJSON()) || null;
  }

  async getAssociatedStoreDetails(body) {
    const { store_id } = body;
    const selectedField = {
      store_id: 1,
      store_name: 1,
      store_org_name: 1,
      parent_store_id: 1,
      store_logo: {
        $concat: [
          `${process.env.CYNTRA_S3_IMG_URL}/`,
          "$store_id",
          "/",
          "$store_logo",
        ],
      },
    };
    let dataResult = await StoreMaster.find(
      { parent_store_id: store_id },
      selectedField
    );
    return dataResult;
  }


  async getallStoreInfo() {
  
    const pipeline = [
      {
        $lookup: {
          from: "orempf",
          localField: "store_id",
          foreignField: "store_id",
          as: "employee_details",
        },
      },
      {
        $lookup: {
          from: "gateway_credential",
          localField: "store_id",
          foreignField: "store_id",
          as: "payment_details",
        },
      },
      {
        $lookup: {
          from: "store_current_status",
          localField: "store_id",
          foreignField: "store_id",
          as: "status_store",
        },
      },
      {
        $lookup: {
          from: "store_configuration",
          localField: "store_id",
          foreignField: "store_id",
          as: "store_config",
        },
      },
      {
        $lookup: {
          from: "store_order_type",
          localField: "store_id",
          foreignField: "store_id",
          as: "store_order_type",
        },
      },
      {
        $lookup: {
          from: "store_tnd",
          localField: "store_id",
          foreignField: "store_id",
          as: "tender_type",
        },
      },
      {
        $unwind: {
          path: "$status_store",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "status_store.updated_at": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          store_id: { $first: "$store_id" },
          name: { $first: "$store_name" },
          store_currency:{ $first: "$store_currency" },
          tender_type:{ $first: "$tender_type" },
          store_config:{ $first: "$store_config" },
          store_order_type:{ $first: "$store_order_type" },
          employee_details: { $first: "$employee_details" },
          payment_details: { $first: "$payment_details" },
          status_store: { $first: "$status_store" },
        },
      },
      {
        $project: {
          _id: 0,
          store_id: 1,
          name: 1,
          store_currency:1,
          tender_type:1,
          store_config:1,
          store_order_type:1,
          employee_details: 1,
          payment_details: 1,
          status_store: 1,
        },
      },
    ];
    
    const result = await StoreMaster.aggregate(pipeline).exec();
    return result.length > 0 ? result : null;
    
    
  }

  async getCloverRefreshToken(body) {
    return new Promise((resolve, reject) => {
      try {
        const options = {};       
        const url = process.env.CLOVER_API_ENDPOINT + '/oauth/v2/refresh';
        axios.post(url, body, options)
          .then(function (response) {
            // console.log("Success api ");
            return resolve(response.data);
          })
          .catch(async function (error) {
            return reject(error?.response?.data);
          });
      } catch (err) {
        console.log("orderStatusUpdate API err", err);
        return reject(err);
      }
    });	
	}

  async saveCloverRefreshToken(body) {
    const { _id, info } = body;
    await GatewayCredential.updateOne({ _id }, {info});
	}

}

module.exports = StoreDataService;
