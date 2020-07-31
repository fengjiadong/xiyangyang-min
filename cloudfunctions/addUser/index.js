// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('user')   //test 集合名称
    .add({
      data: [{
        avatarUrl: event.avatarUrl,
        nickName: event.nickName,
        openId: wxContext.OPENID,
        city: event.city,
        country: event.country,
        gender: event.gender,
        language: event.language,
        province: event.province,
        isDelete:false,
        createTime: new Date()
      }]
    })
  return {
    result:result
  }
}