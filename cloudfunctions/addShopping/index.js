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
        name: event.name,
        userId: event.userId,
        openId: wxContext.OPENID,
        number: 1,
        price: parseFloat(event.price),
        totalPrice: parseFloat(event.price),
        isActive: false,
        specifications: event.specifications,
        image: event.image,
        discount: event.discount,
        iceType: event.iceType,
        glassType: event.glassType,
        sugarType: event.sugarType,
        specificationsPrice: event.specificationsPrice,
        selectedType: event.selectedType,
        createTime: new Date(),
        updateTime: new Date()
      }]
    })
  return {
    result:result
  }
}