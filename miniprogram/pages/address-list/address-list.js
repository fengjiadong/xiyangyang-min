// miniprogram/pages/address-list/address-list.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [
    ]
  },
  // 地址编辑
  editAddress(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    wx.navigateTo({
      url: '../edit-add-address/edit-add-address?id='+this.data.addressList[index]._id,
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
    wx.showLoading({
      title: '正在加载数据',
    })
    this.searchAddress();
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
  searchAddress(){
    let userId = wx.getStorageSync('userId')
    console.log(userId)
    db.collection('address').where({
      parentId:userId
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          addressList:res.data
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  }
})