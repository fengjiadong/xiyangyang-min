// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('commodity')   //集合名称
    .doc(event.id).update({
      data: {
        openId: wxContext.OPENID,
        type: event.type,
        price: event.price,
        priceTow: event.priceTow,
        priceThree: event.priceThree,
        detail: event.detail,
        invalid: event.invalid,
        isDelete: event.isDelete,
        name: event.name,
        image: event.image,
        updateTime: new Date()
      }
    })
  return {
    result:result
  }
}