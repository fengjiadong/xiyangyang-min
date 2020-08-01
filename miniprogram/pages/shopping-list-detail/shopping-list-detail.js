// miniprogram/pages/shopping-list-detail/shopping-list-detail.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    foodList: [,
    ],
    order: 18,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.id = 'd1cc6d125f255a9e002df34c16b194fa'
     if(options.id){
        this.setData({
          id:options.id
        })
        this.getOrderInfo(options.id);
     }
  },
  getOrderInfo(id){
    db.collection('order').doc(id).get({
        success: res => {
          console.log(res)
          res.data.createTime = this.formatDate(res.data.createTime,'yyyy-MM-dd hh:mm:ss')
          console.log(this.formatDate(res.data.createTime,'yyyy-MM-dd hh:mm:ss'))
          this.setData({
            foodList:res.data.commoditys,
            order:res.data
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