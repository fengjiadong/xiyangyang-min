// miniprogram/pages/admin/setting/setting.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    close:false,
    distributionPrice:0,
    price:0,
    reduction: 0,
    full: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection("setting").doc('3adec2825f2a9e43001870f53e337dff').get({
      success: res =>{
        console.log(res)
        this.setData({
          close:res.data.close,
          price: res.data.price,
          distributionPrice:res.data.distributionPrice,
          full:res.data.full,
          reduction:res.data.reduction
        })
      }
    })
  },

  close(e){
    this.setData({
      close: e.detail.value
    })
  },
  save(){
    if(!this.data.full){
        this.data.full = 0;
    }
    if(!this.data.reduction){
      this.data.reduction = 0;
    }
    if(parseFloat(this.data.full) <= parseFloat(this.data.reduction)){
   wx.showToast({
     title: '满减金额冲突',
     icon:'none'
   })
      return;
    }
    wx.showLoading({
      title: '正在保存设置',
    })
    wx.cloud.callFunction({
      name: "upSetting",
      data: {
        close: this.data.close,
        price:  parseFloat(this.data.price),
        distributionPrice: parseFloat(this.data.distributionPrice),
        full:parseFloat(this.data.full),
        reduction:parseFloat(this.data.reduction)
      },
      success(res) {
        if(res.result.result.stats.updated == 1){
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 500
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
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
  updateValue(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
  },
})