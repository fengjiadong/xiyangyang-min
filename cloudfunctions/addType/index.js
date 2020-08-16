// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('type')   //集合名称
    .add({
      data: {
        openId: wxContext.OPENID,
        name: event.name,
        invalid: event.invalid,
        createTime: new Date(),
        updateTime: new Date(),
        isDelete:false,
        sort:event.sort
      }
    })
  return {
    result:result
  }
}