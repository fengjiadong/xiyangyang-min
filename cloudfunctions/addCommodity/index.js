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
    .add({
      data: {
        openId: wxContext.OPENID,
        type: event.type,
        priceTow: event.priceTow,
        price: event.price,
        // priceTofw: event.priceTow,
        // priceTow: enevt.priceTow,
        priceThree: event.priceThree,
        detail: event.detail,
        invalid: event.invalid,
        isDelete: event.isDelete,
        name: event.name,
        image: event.image,
        createTime: new Date(),
        updateTime: new Date()
      }
    })
  return {
    result: result
  }
}