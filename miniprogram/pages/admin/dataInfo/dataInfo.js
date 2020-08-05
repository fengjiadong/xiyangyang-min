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
    date: '2018-12-25',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '查询中',
    })
    console.log(new Date().toLocaleDateString())
    this.setData({
      date: new Date().toLocaleDateString()
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
          dayWCpriceSum:priceSum
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
        for(let i =0;i< res.data.length;i++){
          priceSum+=res.data[i].totalPrice
        }
        this.setData({
          dayWWCorderCount:res.data.length,
          dayWWCpriceSum:priceSum
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
          dayYTHpriceSum:priceSum
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

  }
})