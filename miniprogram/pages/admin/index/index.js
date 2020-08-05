// miniprogram/pages/admin/index/index.js
const app = getApp();
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ColorList: app.globalData.ColorList,
    admin:{}
  }, 
  SetShadow(e) {
    this.setData({
      shadow: e.detail.value
    })
  },
  SetBorderSize(e) {
    this.setData({
      bordersize: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getAdmin(){
    // 获取管理员权限
    let userId = wx.getStorageSync('userId');
    db.collection('admin').where({
      userId:userId
    }).get({
      success: res => {
        console.log(res)
        if(res.data.length > 0){
          this.setData({
            admin:res.data[0]
          })
        }else{
          wx.navigateBack({
            delta: 1
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
    this.getAdmin()
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
  // 调转至收获地址
  goOnlinePage() {
    console.log('跳转到在线订单页')
    wx.navigateTo({
      url: '../online/online',
    })
  },
  // 调转至收获地址
  goUserPage() {
    console.log('跳转到用户管理页')
    wx.navigateTo({
      url: '../user/user',
    })
  },
  goMaterialPage(){
    console.log('跳转到小料管理页')
    wx.navigateTo({
      url: '../material/material',
    })
  },
  goCommodityPage(){
    console.log('跳转到商品管理页')
    wx.navigateTo({
      url: '../commodity/commodity',
    })
  }
  ,
  goStuffPage(){
    console.log('跳转到用户管理页')
    wx.navigateTo({
      url: '../stuff/stuff',
    })
  }
})