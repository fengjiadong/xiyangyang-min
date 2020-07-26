// pages/edit-add-address/edit-add-address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderList: ['男', '女'],
    gender: 0,
    tipList: ['家', '公司', '学校'],
    tip: Number,
    name: '',
    phone: '',
    address: ''
  },
  // 性别选择
  genderSeclect(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    this.setData({
      gender: index
    })
  },
  // 标签选择
  tipSelect(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    this.setData({
      tip: index
    })
  },
  // 保存
  save(){
    wx.navigateBack({
      delta: 1,
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