const express = require('express');
const AuthConroller = require("./AuthController");
const router = express.Router();

const Auth = new AuthConroller();

router.post("/login", Auth.login);
router.post("/web-login", Auth.webLogin);
router.post("/update-password", Auth.updatePassword);
router.post("/manager-authentication", Auth.managerAuthentication);
router.post("/reset-password", Auth.resetPassword);
router.post("/device-logout", Auth.deviceLogout);
router.post("/store-details", Auth.storeDetails);
router.post("/send-sms", Auth.sendSms);
router.post("/send-email", Auth.sendEmail);
router.use("/auth", router);
module.exports = router;