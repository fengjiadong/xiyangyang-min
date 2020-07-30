// miniprogram/pages/address-list/address-list.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [{
        name: '喜羊羊',
        phone: '16787977897',
        type: '家',
        address: '青青草原羊村二号楼 301室'
      },
      {
        name: '喜羊羊',
        phone: '16787977897',
        type: '家',
        address: '青青草原羊村二号楼 301室'
      },
      {
        name: '喜羊羊',
        phone: '16787977897',
        type: '家',
        address: '青青草原羊村二号楼 301室'
      },
      {
        name: '喜羊羊',
        phone: '16787977897',
        type: '家',
        address: '青青草原羊村二号楼 301室'
      },
    ]
  },
  // 地址编辑
  editAddress(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    wx.navigateTo({
      url: '../edit-add-address/edit-add-address',
    })
  },
  // 地址编辑
  addAddress() {
    wx.navigateTo({
      url: '../edit-add-address/edit-add-address',
    })
  },
  searchList(){

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