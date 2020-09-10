// miniprogram/pages/admin/dataInfo/dataInfo.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayWCorderCount:0,
    dayWCpriceSum:0,
    dayWWCorderCount:0,
    dayWWCprice:0,
    dayYTHorderCount:0,
    dayYTHprice:0,
    date: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '查询中',
    })
    console.log(this.formatDate(new Date(),'yyyy-MM-dd'))
    this.setData({
      date: this.formatDate(new Date(),'yyyy-MM-dd')
    })
    let daySart=new Date(new Date(new Date().toLocaleDateString()).getTime())
    let dayEnd=new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    this.wancheng(daySart,dayEnd);
    this.weiwancheng(daySart,dayEnd);
    this.yituihui(daySart,dayEnd);
    setTimeout(function(){
      wx.hideLoading({
        success: (res) => {},
      })
    },500)
  },
  DateChange(e) {
    wx.showLoading({
      title: '查询中',
    })
    this.setData({
      date: e.detail.value
    })
    let daySart=new Date(new Date(new Date(e.detail.value).toLocaleDateString()).getTime())
    let dayEnd=new Date(new Date(new Date(e.detail.value).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    this.wancheng(daySart,dayEnd);
    this.weiwancheng(daySart,dayEnd);
    this.yituihui(daySart,dayEnd);
    setTimeout(function(){
      wx.hideLoading({
        success: (res) => {},
      })
    },500)
  },
  wancheng(daySart,dayEnd){
    const _ = db.command
    db.collection('order').where({
        createTime: _.gte(daySart).and(_.lte(dayEnd)),
        status:'订单已完成'
    }).get({
      success: res=>{
        console.log(res)
        let priceSum = 0;
        for(let i =0;i< res.data.length;i++){
          priceSum+=res.data[i].totalPrice
        }
        this.setData({
          dayWCorderCount:res.data.length,
          dayWCpriceSum: parseFloat(priceSum.toFixed(2))
        })
      }
    })
  },
  weiwancheng(daySart,dayEnd){
    const _ = db.command
    db.collection('order').where({
        createTime: _.gte(daySart).and(_.lte(dayEnd)),
        status: _.nin(['订单已退回','订单已完成'])
    }).get({
      success: res=>{
        console.log(res)
        let priceSum = 0;
        for(let i =0;i < res.data.length;i++){
          priceSum += res.data[i].totalPrice
          console.log(res.data[i].totalPrice)
        }
        console.log(priceSum)
        let dayCount = this.data.dayWCpriceSum+parseFloat(priceSum.toFixed(2))
        this.setData({
          dayWWCorderCount:res.data.length,
          dayWWCpriceSum: parseFloat(priceSum.toFixed(2)),
          dayCount : parseFloat(dayCount.toFixed(2))
          
        })
      }
    })
  },
  yituihui(daySart,dayEnd){
    const _ = db.command
    db.collection('order').where({
        createTime: _.gte(daySart).and(_.lte(dayEnd)),
        status: '订单已退回'
    }).get({
      success: res=>{
        console.log(res)
        let priceSum = 0;
        for(let i =0;i< res.data.length;i++){
          priceSum+=res.data[i].totalPrice
        }
        this.setData({
          dayYTHorderCount:res.data.length,
          dayYTHpriceSum:parseFloat(priceSum.toFixed(2))
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  formatDate(date, fmt) {
    if (typeof date == 'string') {
      date = new Date(date)
    }

    if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";

    if (!date || date == null) return null;
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  }
})