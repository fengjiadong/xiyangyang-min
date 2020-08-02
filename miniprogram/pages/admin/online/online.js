// miniprogram/pages/admin/online/online.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initPage:0,
    TabCur: 0,
    scrollLeft:0,
    pendingList:[], // 待确认订单列表
    processingList:[], // 处理中订单列表,
    processedList:[], // 处理完成待配送
    takeOwnList:[], // 待上门自取，
    finishList:[], // 已完成订单
    tab:['待确认','处理中','配送中','待自取','已完成']
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
    // if(this.data.TabCur === 0){
    //   this.searchPendingList()
    // }
    if(this.data.TabCur === 1){
      this.searchProcessingList()
    }
    if(this.data.TabCur === 2){
      this.searchProcessedList()
    }
    if(this.data.TabCur === 3){
      this.searchTakeOwnList()
    }
    if(this.data.TabCur === 4){
      this.searchFinishList()
    }
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
      status: '待商家确认'
    })
    // 发起监听
    .watch({
      onChange: function(snapshot) {
        console.log('snapshot', snapshot.docChanges[0])
        that.searchPendingList()
        if(snapshot.docChanges[0].dataType === 'add'){
          let innerAudioContext = wx.createInnerAudioContext();
          innerAudioContext.autoplay = true
          innerAudioContext.src = 'cloud://xiyangyang-l5zon.7869-xiyangyang-l5zon-1302640380/634.wav';//获取音频地址
          innerAudioContext.obeyMuteSwitch = false
          innerAudioContext.play();//播放
        }else{
           that.setData({
            initPage:1
           })
        }
       
      },
      onError: function(err) {
        console.error('the watch closed because of error', err)
      }
    })
  },
  // 已完成列表
  searchFinishList(){
    wx.showLoading({ 
      title : '加载中',
      mask : true, 
    });
    db.collection('order').orderBy('createTime', 'desc')
    .where({ status: '订单已完成' }).get({
      success: res => {
        this.setData({
          finishList: res.data
        })
        console.log( res.data)
        for (let i = 0;i < res.data.length;i++){
            this.searchFinishListGetUser(res.data[i],i)   
        }
        wx.hideLoading()
      }
    })
  },
  // 待自取的列表
  searchTakeOwnList(){
    wx.showLoading({ 
      title : '加载中',
      mask : true, 
    });
    db.collection('order').orderBy('createTime', 'desc')
    .where({ status: '已处理完成待上门自取' }).get({
      success: res => {
        this.setData({
          takeOwnList: res.data
        })
        console.log( res.data)
        for (let i = 0;i < res.data.length;i++){
            this.searchTakeOwnListGetUser(res.data[i],i)   
        }
        wx.hideLoading()
      }
    })
  },
  // 处理完成待已处理完成待骑手送达列表
  searchProcessedList(){
    wx.showLoading({ 
      title : '加载中',
      mask : true, 
    });
    db.collection('order').orderBy('createTime', 'desc')
    .where({ status: '已处理完成待骑手送达' }).get({
      success: res => {
        this.setData({
          processedList: res.data
        })
        console.log( res.data)
        for (let i = 0;i < res.data.length;i++){
            this.searchProcessedListGetUser(res.data[i],i)   
        }
        wx.hideLoading()
      }
    })
  },
  // 获取处理中订单列表
  searchProcessingList(){
    wx.showLoading({ 
      title : '加载中',
      mask : true, 
    });
    db.collection('order').orderBy('createTime', 'desc')
    .where({ status: '商家已确认正在处理中' }).get({
      success: res => {
        this.setData({
          processingList: res.data
        })
        console.log( res.data)
        for (let i = 0;i < res.data.length;i++){
            this.searchProcessingListGetUser(res.data[i],i)   
        }
        wx.hideLoading()
      }
    })
  },
  // 得到待确认的订单
  searchPendingList(){
    wx.showLoading({ 
      title : '加载中',
      mask : true, 
    });
    // 按 progress 降序
    db.collection('order').orderBy('createTime', 'desc')
    .where({ status: '待商家确认' }).get({
      success: res => {
        this.setData({
          pendingList: res.data
        })
        console.log( res.data)
        for (let i = 0;i < res.data.length;i++){
            this.searchPendingListGetUser(res.data[i],i)   
        }
        // console.log(this.data.pendingList)
        wx.hideLoading()
      }
    })
  },
  // 已完成订单列表用来获取用户信息的
  searchFinishListGetUser(order,index){
    db.collection('user').doc(order.userId).get({
      success: res => {
        this.data.finishList[index].nickName = res.data.nickName
        this.data.finishList[index].avatarUrl = res.data.avatarUrl
        this.data.finishList[index].createTime = this.formatDate(this.data.finishList[index].createTime,'yyyy-MM-dd hh:mm:ss')
        this.setData({
          finishList: this.data.finishList
        })
      }
    })
  },
  // 待确认订单中用来获取用户信息的
  searchPendingListGetUser(order,index){
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
  // 处理中订单用来获取用户信息的
  searchProcessingListGetUser(order,index){
    db.collection('user').doc(order.userId).get({
      success: res => {
        this.data.processingList[index].nickName = res.data.nickName
        this.data.processingList[index].avatarUrl = res.data.avatarUrl
        this.data.processingList[index].createTime = this.formatDate(this.data.processingList[index].createTime,'yyyy-MM-dd hh:mm:ss')
        this.setData({
          processingList: this.data.processingList
        })
      }
    })
  },
  // 获取配送中的列表用户信息
  searchProcessedListGetUser(order,index){
    db.collection('user').doc(order.userId).get({
      success: res => {
        this.data.processedList[index].nickName = res.data.nickName
        this.data.processedList[index].avatarUrl = res.data.avatarUrl
        this.data.processedList[index].createTime = this.formatDate(this.data.processedList[index].createTime,'yyyy-MM-dd hh:mm:ss')
        this.setData({
          processedList: this.data.processedList
        })
      }
    })
  },
  // 获取待自取订单用户信息
  searchTakeOwnListGetUser(order,index){
    db.collection('user').doc(order.userId).get({
      success: res => {
        this.data.takeOwnList[index].nickName = res.data.nickName
        this.data.takeOwnList[index].avatarUrl = res.data.avatarUrl
        this.data.takeOwnList[index].createTime = this.formatDate(this.data.takeOwnList[index].createTime,'yyyy-MM-dd hh:mm:ss')
        this.setData({
          takeOwnList: this.data.takeOwnList
        })
      }
    })
  }
  ,
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