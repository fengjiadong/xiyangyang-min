// miniprogram/pages/admin/user/user.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key:'',
    queryResult:[],
    pageNo:1,
    maxNum:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.search();
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
  bindconfirm(e){
    this.setData({
      key: e.detail.value
    })
  },
  // 根据nickName关键字模糊查询匹配
  search(){
    db.collection('user').where({
      nickName: db.RegExp({
        regexp: this.data.key,
        option: 'i'
      })
    }).skip((this.data.pageNo - 1) * this.data.maxNum).limit(this.data.maxNum).get({
      success: res => {
        this.setData({
          queryResult: res.data
        })
        console.log('[数据库] [查询记录] 成1功: ', res)
      }
    })
  }
})