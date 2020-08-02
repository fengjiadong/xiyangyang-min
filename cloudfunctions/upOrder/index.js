// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('order')   //集合名称
    .doc(event.id).update({
      data: {
        status: event.status,
        finishTime: event.finishTime,
        refundDesc: event.refundDesc,
        updateTime: new Date()
      }
    })
  return {
    result:result
  }
}