// miniprogram/pages/login/login.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged: false,
    openId: ''
  },
  // 获取头像
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        userInfo: e.detail.userInfo
      })
      wx.setStorageSync('userInfo', this.data.userInfo)
      wx.switchTab({
        url: '../home-page/home-page',
      })
      const db = wx.cloud.database()
      //获取openId
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log(res)
          wx.setStorageSync('openId', res.result.event.userInfo.openId)
          db.collection('user').where({
            openId: res.result.event.userInfo.openId
          }).get({
            success: res => {
              console.log(res)
              if (res.data.length < 1){
                 this.addUser();
              }else{
                wx.setStorageSync('userId', res.data[0]._id)
              }
            }
          })

        }
      })
      // this.infoUser()
    }
  },
  addUser() {
    console.log('添加用户信息')
    let data  = {
      avatarUrl: this.data.userInfo.avatarUrl,
      city: this.data.userInfo.city,
      country: this.data.userInfo.country,
      gender: this.data.userInfo.gender,
      language: this.data.userInfo.language,
      nickName: this.data.userInfo.nickName,
      province: this.data.userInfo.province
    }
     //获取openId
      wx.cloud.callFunction({
        name: 'addUser',
        data: data,
        success: res => {
          console.log(res)
          wx.setStorageSync('userId', res.data[0]._id)
        }
      })
    console.log(data)
  },
  // 获取用户信息
  getInfo() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              this.setData({
                userInfo: res.userInfo,
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let info = wx.getStorageSync('userInfo');
    if (info) {
      wx.switchTab({
        url: '../home-page/home-page',
      })
    }

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

  }
})