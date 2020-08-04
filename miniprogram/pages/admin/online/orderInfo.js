// miniprogram/pages/admin/online/orderInfo.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      _id: ''
    },
    scroll: 0,
    orderRecord:[]
    
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
  getOrder(options) {
    db.collection('order').doc(options.id).get({
      success: res => {
        res.data.avatarUrl = options.image
        res.data.nickName = options.nickName
        res.data.createTime = this.formatDate(res.data.createTime, 'yyyy-MM-dd hh:mm:ss')
        this.setData({
          info: res.data
        })
        this.searchOrderRecord()
      }
    })
  },
  // 监控页面显示时去获取订单信息
  showGetOrder() {
    db.collection('order').doc(this.data.info._id).get({
      success: res => {
        res.data.createTime = this.formatDate(res.data.createTime, 'yyyy-MM-dd hh:mm:ss')
        res.data.avatarUrl = this.data.info.avatarUrl
        res.data.nickName = this.data.info.nickName
        this.setData({
          info: res.data
        })
        this.searchOrderRecord()
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
    if (this.data.info._id) {
      this.showGetOrder()
    }
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
  // 查询流转记录
  searchOrderRecord(){
    console.log("this.data.info._id",this.data.info._id)
      db.collection('orderRecord').where({
        orderId:this.data.info._id
      }).get({
        success: res =>{
          
          this.displayRecord(res.data)
          console.log(res.data)
         
        }
      })
  },
  displayRecord(data){
    let length = data.length-1;
    for(let i = 0; i <data.length; i ++){
      data[i].status2 = data[i].status;
      data[i].status = data[i].status==='待商家确认'?'用户已下单':data[i].status==='商家已确认正在处理中'?'正在处理中':
      data[i].status==='已处理完成待上门自取'?'已处理完成':data[i].status==='已处理完成待骑手送达'?'已处理完成':data[i].status;
      // data[i].status = data[i].status==='商家已确认正在处理中'?'正在处理中':data[i].status==='已处理完成待上门自取'?'待客户自取':data[i].status;
    }
    if(data[data.length -1 ].status === '用户已下单'){
      data.push({
        status:'待商家确认'
      })
    }else if(data[data.length -1 ].status === '正在处理中'){
      data.push({
        status:'待处理完成'
       })
    }else if(data[data.length -1 ].status2 === '已处理完成待上门自取'){
      data.push({
        status:'待自取'
       })
    }else if(data[data.length -1 ].status2 === '已处理完成待骑手送达'){
      data.push({
        status:'待送达'
       })
    }else{
      length = data.length-1
    }
    this.setData({
      orderRecord:data,
    })
    this.setData({
      scroll: length
    })
   
  },
  // 进入退款页面
  refund() {
    let info = this.data.info;
    wx.navigateTo({
      url: 'refund?id=' + info._id + "&orderNum=" + info.orderNum + "&price=" + info.totalPrice,
    })
  },
  // 接收订单
  receiveOrder() {
    const that = this;
    wx.showModal({
      title: '确认接收吗？',
      content: '注:接收后订单进入处理中状态.',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '处理中',
          })
          console.log(that.data.info)
          wx.cloud.callFunction({
            name: "upOrder",
            data: {
              id: that.data.info._id,
              status: '商家已确认正在处理中'
            },
            success(res) {
              wx.hideLoading({
                success: (res) => { },
              })
              that.data.info.status = '商家已确认正在处理中';
              that.addRecord("商家已确认正在处理中")
              that.setData({
                info: that.data.info
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
  processedOrder() {
    const that = this;
    let type = ''
    if (that.data.info.type === '上门自取') {
      type = '已处理完成待上门自取'
    } else {
      type = '已处理完成待骑手送达'
    }
    wx.showModal({
      title: '确认处理完成了吗？',
      content: '注:处理完成后订单进入配送中/待取货状态.',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '处理中',
          })
          console.log(that.data.info)
          wx.cloud.callFunction({
            name: "upOrder",
            data: {
              id: that.data.info._id,
              status: type
            },
            success(res) {
              wx.hideLoading({
                success: (res) => { },
              })
              that.data.info.status = type;
              that.addRecord(type)
              that.setData({
                info: that.data.info
              })
            }
          })
        } else {

        }
      }
    })
  }
  ,
  // 给订单创建流转记录
  addRecord(status) {
    let userId = wx.getStorageSync('userId')
    let adminInfo = wx.getStorageSync('admin')
    console.log(adminInfo)
    let that = this
    wx.cloud.callFunction({
      name: "addRecord",
      data: {
        userId: userId,
        orderId: this.data.info._id,
        operator: adminInfo.name,
        status: status
      },
      success(res) {
        wx.hideLoading({
          complete: (res) => { },
        })
        that.searchOrderRecord();
      },
      fail(res) {
        wx.hideLoading({
          complete: (res) => { },
        })
        console.log("提交失败", res)
      }
    })
  },
  // 完成订单(客户已取/送达~)
  finish() {
    const that = this;
    let type = ''
    wx.showModal({
      title: '确认订单完成了吗？',
      content: '注:处理完成后订单进入已完成状态.',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '处理中',
          })
          console.log(that.data.info)
          wx.cloud.callFunction({
            name: "upOrder",
            data: {
              id: that.data.info._id,
              finishTime: new Date(),
              status: '订单已完成'
            },
            success(res) {
              wx.hideLoading({
                success: (res) => { },
              })
              that.data.info.status = '订单已完成';
              that.data.info.finishTime = that.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
              that.addRecord('订单已完成')
              that.setData({
                info: that.data.info
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