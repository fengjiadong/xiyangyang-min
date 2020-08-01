// miniprogram/pages/admin/online/online.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft:0,
    pendingList:[],
    tab:['待确认','处理中','配送中','待自取','已完成']
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const watcher = db.collection('order')
    // 按 progress 降序
    .orderBy('createTime', 'desc')
    .where({
      // 填入当前用户 openid，或如果使用了安全规则，则 {openid} 即代表当前用户 openid
      status: '待商家确认订单'
    })
    // 发起监听
    .watch({
      onChange: function(snapshot) {
        // console.log('snapshot', snapshot.docChanges)
        that.searchPendingList()
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
  searchPendingList(){
    wx.showLoading({ 
      title : '加载中',
      mask : true, 
    });
    // 按 progress 降序
    db.collection('order').orderBy('createTime', 'desc')
    .where({ status: '待商家确认订单' }).get({
      success: res => {
        this.setData({
          pendingList: res.data
        })
        console.log( res.data)
        for (let i = 0;i < res.data.length;i++){
            this.getOrderUserInfo(res.data[i],i)   
        }
        // console.log(this.data.pendingList)
        wx.hideLoading()
      }
    })
  },
  getOrderUserInfo(order,index){
    db.collection('user').doc(order.userId).get({
      success: res => {
        // console.log("用户信息",res)
        this.data.pendingList[index].nickName = res.data.nickName
        this.data.pendingList[index].avatarUrl = res.data.avatarUrl
        this.data.pendingList[index].createTime = this.formatDate(this.data.pendingList[index].createTime,'yyyy-MM-dd hh:mm:ss')
        this.setData({
          pendingList: this.data.pendingList
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 进入订单详情
  orderInfo(e){
      console.log(e.currentTarget.dataset.info)
      let info = e.currentTarget.dataset.info
      wx.navigateTo({
        url: 'orderInfo?id='+info._id+"&nickName="+info.nickName+"&image="+info.avatarUrl,
      })
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