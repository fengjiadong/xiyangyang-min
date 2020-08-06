// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  // 本函数弃用了
  const wxContext = cloud.getWXContext()
  let result = await db.collection('commodity')   //集合名称
    .doc(event.id).update({
      data: {
        salesVolume:1,
        updateTime: new Date()
      }
    })
  return {
    result:result
  }
}

