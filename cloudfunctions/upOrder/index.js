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
    .doc(event.id).update({
      data: {
        status: event.status,
        finishTime: event.finishTime,
        refundDesc: event.refundDesc,
        updateTime: new Date()
      }
    })
    if(event.status !== '订单已完成'){
      return {
        result: result
      }
    }
    let results = await db.collection('order')   //集合名称
    .doc(event.id).get()
    let commoditys = results.data.commoditys;
    let upRes = [];
    for(let i =0;i < commoditys.length; i++ ){
      let commdodity = await db.collection('commodity')   //集合名称
       .doc(commoditys[i].commodityId).get()
       commdodity.data.salesVolume = commdodity.data.salesVolume?commdodity.data.salesVolume+1:1
       // 修改销量
       let upCommidity = await db.collection('commodity')   //集合名称
       .doc(commdodity.data._id).update({data: {salesVolume:commdodity.data.salesVolume,updateTime: new Date()}})
       upRes.push(upCommidity)
    }
  return {
    commoditys: commoditys,
    upRes: upRes,
    result: result,
    query: results
  }
}

