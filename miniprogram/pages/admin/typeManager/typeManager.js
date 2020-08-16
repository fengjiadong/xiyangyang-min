// miniprogram/pages/admin/typeManager/typeManager.js
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    types:[]
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
    this.searchType()
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
  searchType(){
    db.collection('type').where({
      isDelete: false
    }).orderBy('sort', 'ase').get({
      success: res => {
        this.setData({
          types: res.data
        })
        console.log('[数据库] [查询记录] 成1功: ', res)
        this.searchCommodityCount(res.data)
      }
    })
  },
  searchCommodityCount(data){
    // 分类下的商品数量以及价格总和
    console.log(data)
    const _ = db.command
    const $ = _.aggregate
    let typeIds = []
    for(var i = 0;i <  data.length; i++){
        typeIds.push(data[i]._id)
    }
    console.log(typeIds)
    db.collection('commodity').aggregate(). match({
      type: _.in(typeIds),
      isDelete: false
    }).group({
      _id: '$type',
      sum: $.sum('$price'),
      count: $.sum(1)
    }) .end({
      success: res => {
        console.log("res", res)
        for(let i = 0;i< res.list.length;i++){
            this.setCount(res.list[i])
        }
      }
    })
  },
  setCount(data){
    for(let i = 0;i < this.data.types.length;i++){
      if(this.data.types[i]._id === data._id){
        this.data.types[i].sum = data.sum;
        this.data.types[i].count = data.count;
      }
    }
    this.setData({
      types: this.data.types
    })
  },
  upType(e){
    let index = e.currentTarget.dataset.index;
    let item = this.data.types[index];
    wx.navigateTo({
      url: 'typeDetail?id='+item._id+"&name="+item.name+"&invalid="+item.invalid,
    })
  },
  addType(){
    wx.navigateTo({
      url: 'typeDetail'
    })
  }
})