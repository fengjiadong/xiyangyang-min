// miniprogram/pages/admin/user/user.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    keyWord:'',
    queryResult: [],
    pageNo: 1,
    maxNum: 10,
    isLoad: true,
    isOver: false,
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.search();
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
    if(!this.data.isOver){
      this.setData({
        pageNo: this.data.pageNo+1,
        isLoad: true
      })
      this.search();
    }
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindconfirm(e) {
    this.setData({
      key: e.detail.value,
      keyWord:''
    })
  },
  searchByKey(){
    this.setData({
      keyWord: this.data.key,
      pageNo:1,
      queryResult:[],
      isOver:false
    })
    console.log(this.data.keyWord)
    this.search()
  },
  // 根据nickName关键字模糊查询匹配
  search() {
    db.collection('user').where({
      nickName: db.RegExp({
        regexp: this.data.keyWord,
        option: 'i'
      })
    }).count({
      success: res =>{
        console.log(res)
        this.setData({
          count: res.total
        })
      }
    })
    db.collection('user').where({
      nickName: db.RegExp({
        regexp: this.data.keyWord,
        option: 'i'
      })
    }).skip((this.data.pageNo - 1) * this.data.maxNum).limit(this.data.maxNum).get({
      explain: true,
      success: res => {
        console.log('[数据库] [查询记录] 成1功: ', res)
        if (res.data.length < 1) {
          this.setData({
            isOver: true,
            isLoad: false
          })
          return;
        }
        this.searchOrderCount(res.data);
        if (res.data.length < 5) {
          console.log(res.data.length)
          this.setData({
            isOver: true
          })
        }
      }
    })
  },
  searchOrderCount(data){
    console.log('进入方法')
    const _ = db.command
    const $ = _.aggregate
    let userIds = []
    for(let i =0;i < data.length;i++){
      userIds.push(data[i]._id)
    }
    console.log("userIds",userIds)
    // 查询用户的下单次数以及下单金额
    db.collection('order').aggregate().
    // 微信的一个bug, 模拟器使用$.操作符，手机端无效，手机端必须使用_.操作符。
    match({
      userId: _.in(userIds),
      status: _.neq('订单已退回')
    })
    .group({
      _id: '$userId',
      sum: $.sum('$totalPrice'),
      count: $.sum(1)
    })
    .end({
      success: res => {
        console.log("res",res)
        for(let i =0;i < data.length;i++){
          if(res.list.length < 1){
            data[i].sum = 0;
            data[i].count = 0;
            continue;
          }
          for(let j =0;j < res.list.length;j++){
            if(data[i]._id === res.list[j]._id){
              data[i].sum = res.list[j].sum;
              data[i].count = res.list[j].count;
            }else{
              data[i].sum = 0;
              data[i].count = 0;
            }
          }
        }
        console.log("user",data)
        // 查询下单次数
        let list = this.data.queryResult.concat(data)
        this.setData({
          queryResult: list,
          isLoad: false,
        })
      }
    })
    
  }
})