// miniprogram/pages/home-page/home-page.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:'',
    background: ['/images/img/six.jpg', '/images/img/two.jpg', '/images/img/three.jpg','/images/img/one.jpg'],
  },
  // 跳转至点单页面
  goOrder(){
    wx.switchTab({
      url: '/pages/order/order'
    });  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isClose();
    
  },
  isClose(){
    db.collection("setting").get({
      success: res=>{
        if(res.data[0].close){
          // wx.showToast({
          //   title: '本店已打烊~可以先逛逛加入购物车奥~',
          // })
          this.setData({
            msg:'温馨提示： 本店已打烊~可以先逛逛加入购物车哦~'
          })
        }
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
      this.isClose();
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