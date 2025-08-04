const crypto = require("crypto");
const querystring = require("qs");
const VNPayConfig = require("../config/vnpay.config");

exports.createPaymentUrl = (amount) => {
  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: VNPayConfig.vnp_TmnCode,
    vnp_Amount: amount * 100,
    vnp_CurrCode: "VND",
    vnp_BankCode: "NCB",
    vnp_TxnRef: Math.floor(Math.random() * 100000000),
    vnp_OrderInfo: `Thanh toan don hang`,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: VNPayConfig.vnp_ReturnUrl,
    vnp_IpAddr: "127.0.0.1",
    vnp_CreateDate: getNow(),
    vnp_ExpireDate: getFuture(15),
  };

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", VNPayConfig.secretKey);
  const signed = hmac.update(signData).digest("hex");

  vnp_Params.vnp_SecureHash = signed;
  return `${VNPayConfig.vnp_PayUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;
};

function getNow() {
  const date = new Date();
  return date.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
}

function getFuture(minutes) {
  const date = new Date(Date.now() + minutes * 60000);
  return date.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
}
