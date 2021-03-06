// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('order')   //集合名称
    .add({
      data: {
        type: event.type,
        userId: event.userId,
        openId: wxContext.OPENID,
        totalPrice: event.totalPrice,
        distributionPrice: event.distributionPrice,
        status: event.status,
        remarks: event.remarks,
        orderNum: event.orderNum,
        commoditys: event.commoditys,
        address: event.address,
        reduction: event.reduction, // 满减的金额
        createTime: new Date(),
        updateTime: new Date(),
        time: event.time,
        phone: event.phone,
      }
    })
  return {
    result:result
  }
}