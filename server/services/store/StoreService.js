const moment = require("moment");
const tz = require("moment-timezone");
const fs = require("fs");
const StoreDataService = require("./StoreDataService");
const UtilDataService = require("../common/UtilDataService");
const HtmlService = require("../common/HtmlService");
const SmsService = require("../common/SmsService");
const EmailSmsService = require("../common/EmailSmsService");
const EmpDataService = require("../employee/EmpDataService");
const ReportService = require("../report/ReportService");

class StoreService {
  constructor() {
    this._StoreDataService = new StoreDataService();
    this.UtilDataService = new UtilDataService();
    this.HtmlService = new HtmlService();
    this.SmsService = new SmsService();
    this.EmailSmsService = new EmailSmsService();
    this._EmpDataService = new EmpDataService();
    this.ReportService = new ReportService();
  }

  async closeStore(body) {
    const result = await this._StoreDataService.closeStore(body);
    const { store_id } = body;
    if (result && (body?.notify_email || body?.notify_mobile_number)) {
      //*****code here to get data for email templete
      let { business_dateOnly = null, date_time = null } =
        await this.UtilDataService.getDateByTz({ store_id });
      const input = {
        from: business_dateOnly,
        to: business_dateOnly,
        store_id: [store_id],
      };
      const data = await this.ReportService.dailySale(input);
      const payment_details = await this.ReportService.paymentTypeWise(input);
      const store_details = await this._StoreDataService.getStoreDetails({
        store_id,
      });
      let currency;
      if (store_details.store_currency == "USD") {
        currency = "$";
      } else if (store_details.store_currency == "INR") {
        currency = "₹";
      } else {
        currency = "";
      }
      const param = {
        sales: data,
        payment_details: payment_details,
        store_name: store_details.store_name,
        time: date_time,
        currency,
        time_zone: store_details.store_timezone,
      };

      if (body?.notify_email) {
        try {
          const html = await this.HtmlService.storeClose(param);
          const obj = {
            to: body?.notify_email,
            subject: `Store (${body?.store_id}) Closed`,
            body: html,
            isHtml: true
          };
          // await this.EmailSmsService.sendGmail(obj);
          await this.EmailSmsService.sendMailUsingAzureGraph(obj);
        } catch (err) {
          console.log("Sorry Failed to send mail");
        }
      }
      if (body?.notify_mobile_number) {
        try {
          const mobile_number = body?.notify_mobile_number || "+19089230052";
          const sms = await this.SmsService.storeClose(param);
          if (store_details.store_country == "US") {
            await this.EmailSmsService.sendSmsByTwilio({
              body: sms,
              to: mobile_number,
            });
          } else if (store_details.store_country == "India") {
            await this.EmailSmsService.sendSmsByBhash({
              body: sms,
              mobile: mobile_number,
            });
          }
        } catch (err) {
          console.log("Sorry Sms Not being Sent");
        }
      }
    }
    return result;
  }

  async openStore(body) {
    const result = await this._StoreDataService.openStore(body);
    return result;
  }
  async storeDetails(body, selectedFields={}) {
    const data = await this._StoreDataService.getStoreDetails(body, selectedFields);
    if (data && data.store_logo) {
      data.store_display_logo = `${process.env.CYNTRA_S3_IMG_URL}/${data.store_id}/${data.store_logo}`;
    }
    return data;
  }

  async checkStoreConfig(body) {
    const data = await this._StoreDataService.checkStoreConfig(body);
    return data;
  }

  async getStoreConfig(body) {
    const data = await this._StoreDataService.getStoreConfig(body);
    return data;
  }

  async getStoreGatway(body) {
    const data = await this._StoreDataService.getStoreGatway(body);
    return data;
  }
  async saveKdsSetting(body) {
    const result = await this._StoreDataService.saveKdsSetting(body);
    return result;
  }
  async kdsSetting(body) {
    const status = await this._StoreDataService.kdsSettingDetails(body);
    return status;
  }

  async orderSource(body) {
    const status = await this._StoreDataService.orderSourceDetails(body);
    return status;
  }

  async associatedStore(body) {
    const result = await this._StoreDataService.getAssociatedStore(body);
    return result;
  }

  async allAssociatedStore(body) {
    const result = await this._StoreDataService.getAllAssociatedStore(body);
    return result;
  }

  async checkMasterAndGetAllAssociatedStore(body) {
    const result = await this._StoreDataService.checkMasterAndGetAllAssociatedStore(body);
    return result;
  }

  async associatedStoreDetails(body) {
    const status = await this._StoreDataService.getAssociatedStoreDetails(body);
    return status;
  }

  async allStoreInfo(body) {
    const status = await this._StoreDataService.getallStoreInfo(body);
    return status;

  }

  async cloverRefreshToken(body, _id) {    
    const result = await this._StoreDataService.getCloverRefreshToken(body);
    if(result?.access_token){
      await this._StoreDataService.saveCloverRefreshToken({info: result, _id });      
    }
    return result;
  }

}

module.exports = StoreService;
