// miniprogram/pages/admin/online/refund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    refundDesc:'',
    orderNum:'',
    price:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderNum:options.orderNum,
      price: options.price,
      id:options.id
    })
   
  },
 refund(){
   let that = this;
  wx.showModal({
    title: '确认接收吗？',
    content: '注:接收后订单进入处理中状态.',
    success(res) {
      if (res.confirm) {
        wx.cloud.callFunction({
          name: "refund",
          data: {
            orderNum: that.data.orderNum,
            refundFee: that.data.price,//退款金额
            money: that.data.price, //订单金额
            nonceStr: that.data.orderNum, //调用自己的uuid函数
            refundDesc: that.data.refundDesc,
            out_refund_no: that.data.orderNum
          },
          success(res) {
            console.log('退款申请',res.result)
            if(res.result.returnCode === 'SUCCESS'){
              that.upOrder()
              wx.showToast({
                title: '退单成功',
                icon: 'success',
                duration: 500
              })
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)
            }else{
              // 退款失败
              wx.showToast({
                title: '退单失败:'+res.result.errCodeDes,
                icon: 'none',
                duration: 2000
              })
            }
            
          }
        })
      }
    }
  })
    
 },
 upOrder(){
  wx.cloud.callFunction({
    name: "upOrder",
    data: {
      id: this.data.id,
      status: '订单已退回',
      refundDesc:this.data.refundDesc
    },
    success(res) {
       console.log('更新订单信息')
    }
  })
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

  }
})