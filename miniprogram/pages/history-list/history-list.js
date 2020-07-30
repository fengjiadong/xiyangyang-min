// miniprogram/pages/history-list/history-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [
      {
        imageUrl: '../../images/img/history.png',
        title: '青春遇上喜羊羊',
        time: '2020-07-14 20:34',
        price: '19'
      },
      {
        imageUrl: '../../images/img/history.png',
        title: '青春遇上喜羊羊',
        time: '2020-07-14 20:34',
        price: '19'
      },
      {
        imageUrl: '../../images/img/history.png',
        title: '青春遇上喜羊羊',
        time: '2020-07-14 20:34',
        price: '19'
      },
      {
        imageUrl: '../../images/img/history.png',
        title: '青春遇上喜羊羊',
        time: '2020-07-14 20:34',
        price: '19'
      },
      {
        imageUrl: '../../images/img/history.png',
        title: '青春遇上喜羊羊',
        time: '2020-07-14 20:34',
        price: '19'
      },
      {
        imageUrl: '../../images/img/history.png',
        title: '青春遇上喜羊羊',
        time: '2020-07-14 20:34',
        price: '19'
      },
      {
        imageUrl: '../../images/img/history.png',
        title: '青春遇上喜羊羊',
        time: '2020-07-14 20:34',
        price: '19'
      },
      {
        imageUrl: '../../images/img/history.png',
        title: '青春遇上喜羊羊',
        time: '2020-07-14 20:34',
        price: '12'
      },
      {
        imageUrl: '../../images/img/history.png',
        title: '青春遇上喜羊羊',
        time: '2020-07-14 20:34',
        price: '11'
      },
    ]

  },
  // 详情跳转
  goListDetail(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    wx.navigateTo({
      url: '../shopping-list-detail/shopping-list-detail',
    })
  },
  // 再来一单
  againOrder() {
    wx.switchTab({
      url: '../order/order',
    })
  },
  // 删除
  deleteFood(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    let list = this.data.historyList;
    list.splice(index, 1);
    this.setData({
      historyList: list
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