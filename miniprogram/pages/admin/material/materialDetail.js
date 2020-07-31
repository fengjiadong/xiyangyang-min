// miniprogram/pages/admin/material/materialDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    name:'',
    price:0,
    invalid:false,
    isDelete:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.id){
      this.setData({
        id:options.id,
        name:options.name,
        price:options.price,
        invalid:options.invalid==='true'
      })
    }
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
  add(){
    wx.cloud.callFunction({
      name: 'addMaterial',
      data: this.data,
      success: res => {
        console.log(res)
        if(res.result.result._id){
          wx.showToast({
            title: '成功',
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
  save(){
    wx.cloud.callFunction({
      name: 'upMaterial',
      data: this.data,
      success: res => {
        console.log(res)
        if(res.result.result.stats.updated > 0){
          wx.showToast({
            title: '成功',
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
  updateValue(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
  },
  invalid(e){
    this.setData({
      invalid: !e.detail.value
    })
    console.log(this.data.invalid)
  },
  delete(){
    this.setData({
      isDelete: true
    })
    this.save();
  }
})