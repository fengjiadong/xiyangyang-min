// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('shoppingCart')   //集合名称
    .add({
      data: [{
        commodityId: event.commodityId,
        userId: event.userId,
        openId: wxContext.OPENID,
        count: event.count,
        price: event.price,
        totalPrice: event.totalPrice,
        specifications: event.specifications
      }]
    })
  return {
    result:result
  }
}