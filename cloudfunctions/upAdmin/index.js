// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('admin')   //集合名称
    .doc(event._id).update({
      data: {
        openId:wxContext.OPENID,
        image: event.image,
        gender: event.gender,
        name: event.name,
        phone: event.phone,
        isDelete: event.isDelete,
        invalid: event.invalid,
        nickName: event.nickName,
        post: event.post,
        role: event.role,
        roleNum: event.roleNum,
        userId: event.userId,
        updateTime: new Date()
      }
    })
  return {
    result:result
  }
}