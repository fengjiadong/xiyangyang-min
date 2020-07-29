// miniprogram/pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: '喜羊羊',
      avatarUrl: '../../images/img/my.png',
    },
    openId:""
  },
  // 调转至购物车
  goShopTaxi() {
    wx.switchTab({
      url: '../shopping-list/shopping',
    })
  },
  // 调转至订单历史
  goHistoryList() {
    wx.navigateTo({
      url: '../history-list/history-list',
    })
  },
  // 调转至收获地址
  goAddressList() {
    wx.navigateTo({
      url: '../address-list/address-list',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = wx.getStorageSync('userInfo');
    if (!info) {
      wx.switchTab({
        url: '../login/login',
      })
    }
    let openId = wx.getStorageSync('openId');
    // console.log(info)
    this.setData({
      userInfo: info,
      openId: openId
    })
    let thes = this;
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
  goAdmin(){
    console.log('进入商户端')
  }
})