// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('setting')   //集合名称
    .doc('3adec2825f2a9e43001870f53e337dff').update({
      data: {
        close:event.close,
        price: parseFloat(event.price),
        distributionPrice: parseFloat(event.distributionPrice),
        updateTime: new Date()
      }
    })
  return {
    result:result
  }
}