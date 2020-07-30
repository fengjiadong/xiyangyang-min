//获取云实例
const cloud = require('wx-server-sdk')
//云初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
//获取微信调用上下文信息，其中包括Openid，Appid等
const wxContext = cloud.getWXContext()
//获取用户openid
const openid = wxContext.OPENID
const appid = 'wxb7badeac5d975b5f'
const mch_id = '1601026104' // 微信支付商户号
const random = require("random.js")
const body = "喜羊羊-茶饮"
//随便填写个服务器就行，我在使用中没有遇到什么问题
const notify_url = 'http://www.weixin.qq.com/wxpay/pay.php'
const trade_type = 'JSAPI'
const key = '1a79a4d60de6718e8e5b326e338ae533'

const crypto = require("crypto")
const requestData = require("requestData.js")
const request = require("request")
const xmlreader = require("xmlreader")

exports.main = async (event, context) => {

  const out_trade_no = Date.parse(new Date()).toString()
  const total_fee = event.total_fee;
  const spbill_create_ip = event.spbill_create_ip;

  let stringA = `appid=${appid}&body=${body}&
      mch_id=${mch_id}&nonce_str=${random}&
      notify_url=${notify_url}&openid=${openid}&
      out_trade_no=${out_trade_no}&
      spbill_create_ip=${spbill_create_ip}&
      total_fee=${total_fee}™_type=${trade_type}&
      key=1a79a4d60de6718e8e5b326e338ae533`
  var sign = crypto.createHash('md5').update(stringA).digest('hex').toUpperCase()
  let dataBody = reqData(
    appid,
    mch_id,
    random,
    sign,
    body,
    out_trade_no,
    total_fee,
    spbill_create_ip,
    notify_url,
    trade_type,
    openid
  )

  return new Promise(reslove => {
    request({
      //官方统一下单api的url
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      //请求方法，post
      method: "POST",
      //需要传送的订单，就是刚刚我们生成的dataBody
      body: dataBody
    }, body => {
      //body就是我们收到的数据，我们需要得到其中的prepay_id
      //使用xmlreader解析body，获得其中的prepay_id
      xmlreader.read(body, res => {
        let prepay_id = res.xml.prepay_id.text()
        let timeStamp = Date.parse(new Date()).toString()
        let str = `appId=${appid}&nonceStr=${random}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=1a79a4d60de6718e8e5b326e338ae533`
        let paySign = crypto.createHash('md5').update(str).digest('hex')
        //返回上面的五个参数
        reslove({
          data: {
            timeStamp: timeStamp,
            nonceStr: random,
            package: `prepay_id=${prepay_id}`,
            signType: 'MD5',
            paySign: paySign
          }
        })
      })
    })
  })

}