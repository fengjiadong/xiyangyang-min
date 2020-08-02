// miniprogram/pages/admin/online/orderInfo.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // options.id = 'b31a516f5f255edb002febcd084dc862'
    // options.nickName = '苏晨杨-风一样的男人'
    // options.image = 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKGnJf2QzzEKm0LEcpA66V9fLbwvNqljKsOqtb9ACq3o6YfRYCaFB5t3gm2xoY0F1ModjHMgibOXgQ/132'
    this.getOrder(options);
  },
  getOrder(options){
    db.collection('order').doc(options.id).get({
      success: res => {
        res.data.avatarUrl = options.image
        res.data.nickName = options.nickName
        res.data.createTime = this.formatDate(res.data.createTime,'yyyy-MM-dd hh:mm:ss')
        this.setData({
          info: res.data
        })
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
  // 接收订单
  receiveOrder(){
    const that = this;
    wx.showModal({
      title: '确认接收吗？',
      content: '注:接收后订单进入处理中状态.',
      success(res) {
        if (res.confirm) {
          console.log(that.data.info)
          wx.cloud.callFunction({
            name: "upOrder",
            data: {
              id: that.data.info._id,
              status: '商家已确认正在处理中'
            },
            success(res) {
              that.data.info.status = '商家已确认正在处理中';
              that.setData({
                info:that.data.info
              })
            }
          })
        } else {

        }
      }
    })
  }
  ,
  // 处理完成转入下一个状态
  processedOrder(){
    const that = this;
    let type = ''
    if(that.data.info.type ==='上门自取'){
      type = '已处理完成待上门自取'
    }else{
      type = '已处理完成待骑手送达'
    }
    wx.showModal({
      title: '确认处理完成了吗？',
      content: '注:处理完成后订单进入配送中/待取货状态.',
      success(res) {
        if (res.confirm) {
          console.log(that.data.info)
          wx.cloud.callFunction({
            name: "upOrder",
            data: {
              id: that.data.info._id,
              status: type
            },
            success(res) {
              that.data.info.status = type;
              that.setData({
                info:that.data.info
              })
            }
          })
        } else {

        }
      }
    })
  }
  ,
  // 完成订单(客户已取/送达~)
  finish(){
    const that = this;
    let type = ''
    wx.showModal({
      title: '确认订单完成了吗？',
      content: '注:处理完成后订单进入已完成状态.',
      success(res) {
        if (res.confirm) {
          console.log(that.data.info)
          wx.cloud.callFunction({
            name: "upOrder",
            data: {
              id: that.data.info._id,
              finishTime: new Date(),
              status: '订单已完成'
            },
            success(res) {
              that.data.info.status = '订单已完成';
              that.data.info.finishTime = that.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss');
              that.setData({
                info:that.data.info
              })
            }
          })
        }
      }
    })
  }
  ,
  formatDate(date, fmt) {
    if (typeof date == 'string') {
      date = new Date(date)
    }
  
    if (!fmt) fmt = "yyyy-MM-dd hh:mm:ss";
  
    if (!date || date == null) return null;
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  }
})