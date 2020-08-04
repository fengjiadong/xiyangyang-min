// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('orderRecord')
    .add({
      data: {
        openId: wxContext.OPENID,
        operator: event.operator,
        userId: event.userId,
        createTime: new Date(),
        orderId: event.orderId,
        status: event.status,
        describe: event.describe?event.describe:event.operator+'将订单状态改为['+event.status+']'
      }
    })
  return {
    result: result
  }
}