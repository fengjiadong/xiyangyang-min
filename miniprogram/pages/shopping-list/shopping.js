// miniprogram/pages/shopping-list/shopping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [{
      id: '123',
      image: '/images/img/taxi-one.png',
      price: 10,
      isActive: false,
      name: '蓝颜知己',
      number: 1,
    },
    {
      id: '123',
      image: '/images/img/taxi-two.png',
      price: 11,
      isActive: false,
      name: '蓝颜知己',
      number: 1,
    },
    {
      id: '123',
      image: '/images/img/taxi-one.png',
      price: 12,
      isActive: false,
      name: '蓝颜知己',
      number: 1,
    },
    {
      id: '123',
      image: '/images/img/taxi-one.png',
      price: 13,
      isActive: false,
      name: '蓝颜知己',
      number: 1,
    },
    {
      id: '123',
      image: '/images/img/taxi-two.png',
      price: 14,
      isActive: false,
      name: '蓝颜知己',
      number: 1,
    },
    {
      id: '123',
      image: '/images/img/taxi-one.png',
      price: 15,
      isActive: false,
      name: '蓝颜知己',
      number: 1,
    },
    {
      id: '123',
      image: '/images/img/taxi-two.png',
      price: '16',
      isActive: false,
      name: '蓝颜知己',
      number: 1,
    },
    ],
    isActive: false,
    deleteIs: false,
    totalPrice: 0, // 合计总价
    sizeContentWindow: true,
    time: '12:00',
    titleList: [{
      name: '上门自取'
    },
    {
      name: '外卖配送'
    }
    ],
    titltTabActive: 0,
    titltTabName: '上门自取',
    addressArray: ['地址1', '地址2', '地址3'],
    address: 0,
    totalNum: 7,
    priceList: []
  },
  // 是否选中
  isSelect(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    let list = this.data.shopList;
    list[index].isActive = !list[index].isActive;
    this.setData({
      shopList: list,
      isActive: false
    })
    let priceList = this.data.priceList;

    if (list[index].isActive === true) {
      console.log(list[index].price);
      priceList.push({
        price: list[index].price,
        num: list[index].number
      });
      this.setData({
        priceList: priceList
      })
      let total = this.data.totalPrice;

      this.data.priceList.forEach(ele => {
        total = total + ele.price * ele.num;
      })
      console.log(total);
      this.setData({
        totalPrice: total
      })
    } else if (list[index].isActive === false) {
      priceList.splice(index, 1);
      console.log(priceList);
    }

  },
  // 是否全选
  isAllSelect() {
    let isActive = this.data.isActive;
    let list = this.data.shopList;
    for (let i = 0; i < list.length; i++) {
      list[i].isActive = !list[i].isActive;
      isActive = !isActive;
      console.log(list[i].isActive, isActive)

      // if (list[i].isActive == false) {
      //   list[i].isActive = true
      // }
    };
    if (isActive === true) {
      for (let i = 0; i < list.length; i++) {
        list[i].isActive = true
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        list[i].isActive = false
      }
    }
    this.setData({
      shopList: list,
      isActive: isActive
    })
  },
  // 删除
  deleteFood(e) {
    console.log(e)

  },
  // 数量减少
  deleteNumber(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    let list = this.data.shopList;
    if (list[index].number === 1) {
      // this.setData({
      //   deleteIs: false
      // })
      return;
    }
    list[index].number--;
    this.setData({
      shopList: list,
    })


  },
  // 数量增加
  addNumber(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index;
    let list = this.data.shopList;
    list[index].number++;
    this.setData({
      shopList: list
    })
  },
  //购买
  buy() {
    this.setData({
      sizeContentWindow: false
    })
    wx.setNavigationBarTitle({
      title: '提交订单'
    })
  },
  // 取消
  hidden() {
    this.setData({
      sizeContentWindow: true
    })
  },
  // 时间选择
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  // 类型切换
  titleTabSelect(e) {
    console.log(e);
    // const index = e.currentTarget.dataset.index;
    // this.setData({
    //   titltTabActive: index
    // })
    const name = e.currentTarget.dataset.name;
    this.setData({
      titltTabName: name
    })
  },
  // 地址选择
  addressChange: function (e) {
    console.log('地址选择', e.detail.value)
    this.setData({
      address: e.detail.value
    })
  },
  // 立即支付
  immediateBuy() {
    wx.navigateTo({
      url: '../shopping-list-detail/shopping-list-detail',
    })
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