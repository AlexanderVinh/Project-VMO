const crypto = require('crypto');

const vnpayConfig = {
  vnp_PayUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: 'http://localhost:3000/api/v1/payment/vnpay-return',
  vnp_TmnCode: '0S7T01T8',
  vnp_HashSecret: 'BEZLUPOPOTXTDYZHCBGDJBHFJPBLSARL',
  vnp_ApiUrl: 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction',

  md5: (message) => {
    return crypto.createHash('md5').update(message, 'utf-8').digest('hex');
  },

  sha256: (message) => {
    return crypto.createHash('sha256').update(message, 'utf-8').digest('hex');
  },

  hmacSHA512: (key, data) => {
    return crypto.createHmac('sha512', key).update(data, 'utf-8').digest('hex');
  },

  // Tương đương hàm hashAllFields trong Java
  hashAllFields: (params) => {
    const sortedKeys = Object.keys(params).sort();
    const signData = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
    return vnpayConfig.hmacSHA512(vnpayConfig.vnp_HashSecret, signData);
  },

  getIpAddress: (req) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddress;
    return ip.includes('::ffff:') ? ip.replace('::ffff:', '') : ip;
  },

  getRandomNumber: (len) => {
    let chars = '0123456789';
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

module.exports = vnpayConfig;
