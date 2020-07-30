// pages/edit-add-address/edit-add-address.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    genderList: ['先生', '女士'],
    gender: 0,
    tipList: ['家', '公司', '学校'],
    tip: 1,
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
    let userId = wx.getStorageSync('userId')
    let data = {
      address: this.data.address,
      gender: this.data.gender === 0?'先生':'女士',
      name:this.data.name,
      phone: this.data.phone,
      type: this.data.tip===0?'家': this.data.tip===1?'公司':'学校',
      userId:userId,
      id:this.data.id
    }
    console.log(data)
    if(!this.data.id){
      console.log("添加")
      wx.cloud.callFunction({
        name: 'addAddress',
        data: data,
        success: res => {
          console.log(res)
           wx.navigateBack({
              delta: 1,
           })
        }
      })
    }else{
      console.log("修改")
      wx.cloud.callFunction({
        name: 'upAddress',
        data: data,
        success: res => {
          console.log(res)
           wx.navigateBack({
              delta: 1,
           })
        }
      })
    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      if(options.id){
        this.setData({
          id:options.id
        })
        this.getAddress(options.id)
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
  getAddress(id){
    db.collection('address').where({
      _id:id
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          address:res.data[0].address,
          phone:res.data[0].phone,
          gender:res.data[0].gender==='先生'?0:1,
          name:res.data[0].name,
          tip:res.data[0].type ==='家'?0:res.data[0].type ==='公司'?1:2
        })
      }
    })
  }
})