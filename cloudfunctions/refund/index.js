const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  console.log(event)
  const res = await cloud.cloudPay.refund({
    "sub_mch_id": "1601026104",
     "nonce_str": event.nonceStr,
     "out_trade_no": event.orderNum, // 商戶订单号
     "out_refund_no": event.out_refund_no, // 商户退款号
     "total_fee" :  Math.round(parseFloat(event.money)*100),// 订单金额
     "refund_fee":  Math.round(parseFloat(event.refundFee)*100), // 申请退款金额
     "refund_desc": event.refundDesc, // 退款原因
  })
  return res
}