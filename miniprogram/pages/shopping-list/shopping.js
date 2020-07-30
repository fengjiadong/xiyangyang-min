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
    priceList: [],
    onePhone: '', // 自取电话
    twoPhone: '', //外卖配送电话 
    logged: false,
    openId: ''
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
      let total = 0;

      this.data.priceList.forEach(ele => {
        total = total + ele.price * ele.num;
      })
      console.log(total);
      this.setData({
        totalPrice: total
      })
    } else if (list[index].isActive === false) {
      console.log(this.data.shopList)
      priceList.splice(index, 1);
      console.log(priceList);
      let total = 0;

      this.data.priceList.forEach(ele => {
        total = total + ele.price * ele.num;
      })
      this.setData({
        totalPrice: total,
        priceList: priceList
      })
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
      let total = 0;
      list.forEach(ele => {
        total = total + ele.price * ele.number;
      })
      console.log(total);
      this.setData({
        totalPrice: total
      })
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
    const that = this;
    console.log(e)
    const index = e.currentTarget.dataset.index;
    let list = that.data.shopList;
    wx.showModal({
      title: '提示',
      content: '  确认删除吗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          list.splice(index, 1)
          that.setData({
            shopList: list,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
          return
        }
      }
    })

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
    console.log(this.data.priceList)
    if (this.data.priceList.length === 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        sizeContentWindow: false
      })
      wx.setNavigationBarTitle({
        title: '提交订单'
      })
    }
  },
  // 取消
  hidden() {
    this.setData({
      sizeContentWindow: true
    })
  },
  // 时间选择
  bindTimeChange: function(e) {
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
  addressChange: function(e) {
    console.log('地址选择', e.detail.value)
    this.setData({
      address: e.detail.value
    })
  },
  // 获取上门自取电话
  getOneValue(e) {
    this.setData({
      onePhone: e.detail.value
    })
  },
  // 获取外卖配送电话
  getTwoValue(e) {
    this.setData({
      twoPhone: e.detail.value
    })
  },
  // 微信支付
  pay(payData) {
    var that = this;
    const payment = payData.payment //这里注意，上一个函数的result中直接整合了这里要用的参数，直接展开即可使用
    console.log(payment)
    wx.requestPayment({
      appId:payment.appId,
      nonceStr:payment.nonceStr,
      package:payment.package,
      paySign:payment.paySign,
      signType:payment.signType,
      timeStamp:payment.timeStamp,
      success(res) {
        console.log('pay success', res)
        //跳转到支付成功页面
      },
      fail(res) {
        console.error('pay fail', res)
        //跳转到支付失败页面
      }
    })
  },
  // 微信支付
  payment() {
    console.log('开始支付')
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    var uuid = this.uuid(16, 16) //调用自己的uuid函数
    console.log("uuid:"+uuid)
    var body = "喜羊羊-茶饮"
    wx.cloud.callFunction({
      name: "zhifu",
      data: {
        body: body,
        orderid: "" + uuid,
        money: 1, //支付金额
        nonceStr: this.uuid(32, 32) //调用自己的uuid函数
      },
      success(res) {
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log("提交成功", res.result)
        //创建自己的未支付订单
        that.pay(res.result)
      },
      fail(res) {
        wx.hideLoading({
          complete: (res) => {},
        })
        console.log("提交失败", res)
      }
    })

  },
  // 立即支付
  immediateBuy() {
    switch (this.data.titltTabActive) {
      case 0:
        if (this.data.onePhone === '') {
          wx.showToast({
            title: '请填写收货人电话',
            icon: 'none',
            duration: 2000
          })
        } else {
          console.log(this.data.time, this.data.onePhone);
          wx.navigateTo({
            url: '../shopping-list-detail/shopping-list-detail',
          });
          this.setData({
            sizeContentWindow: true
          })
        }
        break;
      case 1:
        if (this.data.twoPhone === '') {
          wx.showToast({
            title: '请填写收货人电话',
            icon: 'none',
            duration: 2000
          })
        } else {
          console.log(this.data.time, this.data.addressArray[address]);
          wx.navigateTo({
            url: '../shopping-list-detail/shopping-list-detail',
          });
          this.setData({
            sizeContentWindow: true
          })
        }
        break;
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      sizeContentWindow: true
    })
    let openId = wx.getStorageSync('openId');
    let logged = false;
    if (openId) {
      logged = true;
    }
    this.setData({
      openId: openId,
      logged: logged
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  goLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],i;
    radix = radix || chars.length;
    if (len) {
      // Compact form
      for (i = 0; i < len; i++){ 
        uuid[i] = chars[0 | Math.random() * radix];
      }
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join("");
  }
})