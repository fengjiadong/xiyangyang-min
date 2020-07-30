// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const res = await cloud.cloudPay.unifiedOrder({
    "body": "喜羊羊茶饮",
    "outTradeNo": "1217752501012014070332333688",
    "spbillCreateIp": "127.0.0.1",
    "subMchId": "1601026104",
    "totalFee": 1,
    "envId": "test-f0b102",
    "functionName": "pay_cb",
    "tradeType":"JSAPI",
    "openid": wxContext.OPENID
  })
  return res
}