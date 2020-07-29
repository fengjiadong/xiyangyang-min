// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // let result = await db.collection('user')   //test 集合名称
  //   .add({
  //     data: [{
  //       nickName: '张三',
  //       openId: '123333333',
  //       price: 101,
  //     }]
  //   })
  // return {        //一定要有返回值返回给给调用的那个函数
  //   result
  // }
  return {result:'123123123123123123'}
}