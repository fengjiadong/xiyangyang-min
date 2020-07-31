// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('address')   //集合名称
    .add({
      data: [{
        address: event.address,
        parentId: event.userId,
        openId: wxContext.OPENID,
        gender: event.gender,
        name: event.name,
        phone: event.phone,
        type: event.type,
        isDelete:false,
        createTime: new Date()
      }]
    })
  return {
    result:result
  }
}