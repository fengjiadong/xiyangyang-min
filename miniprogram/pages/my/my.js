// miniprogram/pages/my/my.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: '喜羊羊',
      avatarUrl: '',
    },
    logged: false,
    openId: "",
    isAdmin:false
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
  onLoad: function(options) {
    let info = wx.getStorageSync('userInfo');
    let logged = false;
    if (info) {
      logged = true;
    }
    let openId = wx.getStorageSync('openId');
    this.setData({
      userInfo: info,
      openId: openId,
      logged: logged
    })
  
    // db
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let openId = wx.getStorageSync('openId');

    let info = wx.getStorageSync('userInfo');
    let logged = false;
    if (openId) {
      logged = true;
    }
    this.setData({
      openId: openId,
      logged: logged,
      userInfo: info,
    })
    let userId = wx.getStorageSync('userId');
    db.collection('admin').where({
      userId:userId
    }).get({
      success: res => {
        console.log(res)
        if(res.data.length > 0){
          this.setData({
            isAdmin:true
          })
          wx.setStorageSync('admin', res.data[0])
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  goAdmin() {
    console.log('进入商户端')
    wx.navigateTo({
      url: '../admin/index/index',
    })
  },
  goLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  }
})