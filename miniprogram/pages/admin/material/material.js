// miniprogram/pages/admin/material/material.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    specifications:[]
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
    this.searchMaterial()
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
  upMaterial(e){
    let index = e.currentTarget.dataset.index;
    let item = this.data.specifications[index];
    wx.navigateTo({
      url: 'materialDetail?id='+item._id+"&name="+item.name+'&price='+item.price,
    })
  },
  addMaterial(){
    wx.navigateTo({
      url: 'materialDetail'
    })
  },
  searchMaterial(){
    db.collection('specifications').where({
      isDelete:false
    }).get({
      success: res => {
        this.setData({
          specifications: res.data
        })
        console.log('[数据库] [查询记录] 成1功: ', res)
      }
    })
  }
})