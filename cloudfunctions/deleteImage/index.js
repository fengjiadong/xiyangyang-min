// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()    //链接数据库
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection('image').doc(event.id).remove()
  const fileIDs = [event.fileId]
  cloud.deleteFile({
    fileList: fileIDs,
  })
  return {
    result:result
  }
}