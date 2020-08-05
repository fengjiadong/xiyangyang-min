// miniprogram/pages/admin/setting/setting.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    close:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection("setting").doc('3adec2825f2a9e43001870f53e337dff').get({
      success: res =>{
        console.log(res)
        this.setData({
          close:res.data.close
        })
      }
    })
  },

  close(e){
    this.setData({
      close: e.detail.value
    })
    console.log(this.data.close)
    wx.cloud.callFunction({
      name: "upSetting",
      data: {
        close: this.data.close,
      },
      success(res) {
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