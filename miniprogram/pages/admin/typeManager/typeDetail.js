// miniprogram/pages/admin/typeManager/typeDetail.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sorts:[],
    index: 0,
    info:{
      name:'',
      invalid:false,
      isDelete:false,
      sort:0
    }
  },
  PickerChange(e) {
    console.log(e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      wx.showLoading({
        title: '正在加载',
      })
      
      db.collection('type').doc(options.id).get({
        success: res=>{
          console.log(res)
          this.setData({
            info:res.data
          })
          wx.hideLoading()
        }
      })
    } else {
      this.getCount()
    }
  },
  updateValue(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
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
  getCount(){
  db.collection("type").count({
     success : res =>{
       console.log(res)
       this.data.index = res.total;
     }
   })
  },
  invalid(e){
    this.data.info.invalid = !e.detail.value
    this.setData({
      info: this.data.info
    })
    console.log(this.data.info.invalid)
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
    this.data.info.sort = this.data.index;
    console.log(this.data.info)
    wx.showLoading({
      title: '正在添加..',
    })
    wx.cloud.callFunction({
      name: 'addType',
      data: this.data.info,
      success: res => {
        console.log(res)
        wx.hideLoading({
          success: (res) => {},
        })
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
    wx.showLoading({
      title: '加载中..',
    })
    console.log(this.data.info)
    wx.cloud.callFunction({
      name: 'upType',
      data: this.data.info,
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
  delete(){
    this.data.info.isDelete = true
    this.setData({
      info: this.data.info
    })
    this.save();
  }
})