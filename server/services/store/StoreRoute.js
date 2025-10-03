const express = require('express');
const StoreController = require("./StoreController");
const router = express.Router();

const Store = new StoreController();

router.post("/job/auto-sod-eod", Store.autoStoreSodEod);
router.post("/details", Store.storeDetails);
router.post("/kds-setting", Store.kdsSetting);
router.post("/save-kds-setting", Store.saveKdsSetting);
router.post("/order-source", Store.orderSource);
router.post("/associated-store", Store.associatedStoreInfo);
router.post("/all-store-details", Store.allStoreDetails);
router.post("/clover/token", Store.cloverToken);

router.use("/store", router);
module.exports = router;