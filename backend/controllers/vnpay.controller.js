// controllers/vnpay.controller.js
const vnpay = require("../config/vnpay.config");
const dateFormat = require("dateformat");
const qs = require("qs");

exports.createPaymentUrl = (req, res) => {
  const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const tmnCode = vnpay.vnp_TmnCode;
  const secretKey = vnpay.secretKey;
  const vnpUrl = vnpay.vnp_PayUrl;
  const returnUrl = vnpay.vnp_ReturnUrl;

  const date = new Date();
  const createDate = dateFormat(date, "yyyymmddHHMMss");
  const orderId = dateFormat(date, "HHMMss");
  const amount = req.body.amount;
  const bankCode = req.body.bankCode;

  let locale = req.body.language;
  if (!locale) locale = "vn";

  const currCode = "VND";
  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: "Thanh toan don hang: " + orderId,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params["vnp_SecureHash"] = vnpay.hashAllFields(vnp_Params);
  const paymentUrl = vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });

  return res.json({ paymentUrl });
};
