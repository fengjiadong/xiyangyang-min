// miniprogram/pages/history-list/history-list.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [
      {
        imageUrl: '../../images/img/history.png',
        title: '青春遇上喜羊羊',
        time: '2020-07-14 20:34',
        price: '19'
      }
    ]

  },
  // 详情跳转
  goListDetail(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    wx.navigateTo({
      url: '../shopping-list-detail/shopping-list-detail?id='+ this.data.historyList[index]._id,
    })
  },
  // 再来一单
  againOrder() {
    wx.switchTab({
      url: '../order/order',
    })
  },
  // 删除
  deleteFood(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    let list = this.data.historyList;
    list.splice(index, 1);
    this.setData({
      historyList: list
    })
  },
  searchOrder(){
    let userId = wx.getStorageSync('userId')
    db.collection('order').where({
      userId:userId
    }).orderBy('createTime','desc').get({
      success: res => {
        console.log('[数据库] [查询记录] 成1功: ', res)
        for(let i = 0; i< res.data.length;i++){
          res.data[i].createTime = this.formatDate(res.data[i].createTime,'yyyy-MM-dd hh:mm:ss')
        }
        this.setData({
          historyList: res.data
        })
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.searchOrder()
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
  ,
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