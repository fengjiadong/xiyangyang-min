// miniprogram/pages/shopping-list/shopping.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    settings: {},
    peiSongPrice: 3, // 配送费
    reduction: 0, // 减去的金额
    shopList: [{
      // id: '123',
      // image: '/images/img/taxi-one.png',
      // price: 10,
      // isActive: false,
      // name: '蓝颜知己',
      // number: 1,
    }
    ],
    minPrice: 0, // 起送价
    distributionPrice: 0,// 配送费
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
    remarks: '', //留言
    logged: false,
    openId: '',
    isClose: false,
    payStatus: 0, // 支付状态，0未在支付状态、1正在支付、2支付成功
    successOrderId: ''
  },
  // 从数据库得到购物车
  getShopping() {
    wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
      title: '加载中', //提示框显示的提示信息
      mask: true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
    });
    // shopList
    let userId = wx.getStorageSync('userId')
    db.collection('shoppingCart').where({
      userId: userId
    }).orderBy('createTime', 'desc').get({
      success: res => {
        console.log('[数据库] [查询记录] 成1功: ', res)
        this.setData({
          shopList: res.data
        })
        wx.hideLoading()
      }
    })
  },

  // 是否选中
  isSelect(e) {
    const index = e.currentTarget.dataset.index;
    let list = this.data.shopList;
    list[index].isActive = !list[index].isActive;
    console.log(list[index])
    this.setData({
      shopList: list
    })

    let total = 0;
    this.data.shopList.forEach(ele => {
      if (ele.isActive) {
        total = total + ele.totalPrice;
      }
    })

    this.setData({
      totalPrice: this.changeTwoDecimal_f(total),
    })
    let isActive = true;
    let priceList = []
    for (let i = 0; i < this.data.shopList.length; i++) {
      if (this.data.shopList[i].isActive) {
        priceList.push(this.data.shopList[i])
      } else {
        isActive = false
      }
    }
    this.setData({
      priceList: priceList,
      isActive: isActive
    })
    this.fullReduction()
  },
  // 全选
  isAllSelect() {
    let isActive = true;
    let list = this.data.shopList;
    for (let i = 0; i < list.length; i++) {
      if (!list[i].isActive) {
        isActive = false;
        let e = {
          currentTarget: {
            dataset: {
              index: i
            }
          }
        }
        this.isSelect(e)
      }
    };
    if (isActive) {
      for (let i = 0; i < list.length; i++) {
        let e = {
          currentTarget: {
            dataset: {
              index: i
            }
          }
        }
        this.isSelect(e)
      }
    }
    this.setData({
      isActive: !isActive
    })
  },
  deletePayShoppingEntity(index) {
    let list = this.data.shopList;
    console.log(list[index]._id);
    wx.cloud.callFunction({
      name: "deleteShopping",
      data: {
        id: list[index]._id
      },
      success(res) {
        console.log("删除云函数", res)
      }
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
          wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
            title: '删除中', //提示框显示的提示信息
            mask: true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
          });
          console.log(list[index]._id)
          wx.cloud.callFunction({
            name: "deleteShopping",
            data: {
              id: list[index]._id
            },
            success(res) {
              wx.hideLoading()
              console.log("删除云函数", res)
              list.splice(index, 1)
              that.setData({
                shopList: list,
              })
              let total = 0;
              that.data.shopList.forEach(ele => {
                if (ele.isActive) {
                  total = total + ele.totalPrice;
                }
              })

              that.setData({
                totalPrice: that.changeTwoDecimal_f(total),
              })
            }
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
      return;
    }
    list[index].number--;
    list[index].totalPrice = this.changeTwoDecimal_f(list[index].price * list[index].number);
    if (list[index].isActive) {
      console.log(this.data.totalPrice)
      this.data.totalPrice = parseFloat(this.data.totalPrice) - parseFloat(list[index].price);
      this.setData({
        totalPrice: this.changeTwoDecimal_f(this.data.totalPrice)
      })
    }
    this.setData({
      shopList: list
    })
    this.upShopping(list[index]);
    this.fullReduction()
  },
  // 数量增加
  addNumber(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index;
    let list = this.data.shopList;
    list[index].number++;
    list[index].totalPrice = this.changeTwoDecimal_f(list[index].price * list[index].number);
    if (list[index].isActive) {
      console.log(this.data.totalPrice)
      this.data.totalPrice = parseFloat(this.data.totalPrice) + parseFloat(list[index].price);
      this.setData({
        totalPrice: this.changeTwoDecimal_f(this.data.totalPrice)
      })
    }

    this.setData({
      shopList: list
    })
    this.upShopping(list[index]);
    this.fullReduction()
  },
  //购买
  buy() {
    // 判断是否已打烊
    db.collection("setting").get({
      success: res => {
        this.setData({
          minPrice: res.data[0].price,
          distributionPrice: res.data[0].distributionPrice,
        })
        if (res.data[0].close) {
          wx.showToast({
            title: '本店已打烊~',
            icon: 'none'
          })
          // 已打烊，不能购买商品。
          this.setData({
            isClose: true
          })
        } else {

          // 未打烊，可以购买商品.
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
            if (this.data.titltTabName === '外卖配送') {
              this.searchAddress();
            }
            wx.setNavigationBarTitle({
              title: '提交订单'
            })
          }
        }
      }
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
    const name = e.currentTarget.dataset.name;
    if (name === '外卖配送') {
      this.searchAddress()
    }
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
  // 获取上门自取电话
  getOneValue(e) {
    this.setData({
      onePhone: e.detail.value
    })
  },
  remarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  // 获取外卖配送电话
  getTwoValue(e) {
    this.setData({
      twoPhone: e.detail.value
    })
  },
  // 删除已购买的购物车里面的内容
  deletePayShopping() {
    let list = this.data.shopList;
    let orderList = []
    for (let i = 0; i < list.length; i++) {
      if (list[i].isActive) {
        orderList.push(list[i])
        this.deletePayShoppingEntity(i);
      }
    }

  },
  // 在数据库中生成订单然后跳转到详情页
  toOrderInfo(order) {
    this.setData({
      payStatus: 2
    })
    wx.cloud.callFunction({
      name: 'addOrder',
      data: order,
      success: res => {
        console.log('订单已生成:', res)
        if (res.result.result._id) {
          this.addRecord(res.result.result._id, order)
          // 删除购物车里已购买的商品
          this.deletePayShopping()
          this.setData({
            successOrderId: res.result.result._id
          })
        } else {
          // 支付成功了，但是存数据库失败了，请对本页面截图，然后联系商户退款.
          wx.showToast({
            title: '订单生产失败，请联系商家.',
          })
        }
      }
    })
  },
  // 给订单创建流转记录
  addRecord(orderId, order) {
    let userId = wx.getStorageSync('userId')
    let info = wx.getStorageSync('userInfo');
    wx.cloud.callFunction({
      name: "addRecord",
      data: {
        userId: userId,
        orderId: orderId,
        operator: info.name,
        describe: '用户昵称：' + info.nickName + '下单,下单金额:' + order.totalPrice + '。',//
        status: order.status
      },
      success(res) {
        wx.hideLoading({
          complete: (res) => { },
        })
      },
      fail(res) {
        wx.hideLoading({
          complete: (res) => { },
        })
        console.log("提交失败", res)
      }
    })
  },
  // 异步查询支付状态
  queryPayStatus(order, count) {
    console.log(count + '异步处理：' + this.data.payStatus)
    if (this.data.payStatus === 1) {
      // 执行查询方法
      // 如果查询到支付成功，那么就创建工单信息
      let that = this;
      wx.cloud.callFunction({
        name: "zhifu",
        data: {
          isQuery: true,
          orderid: order.orderNum,
          nonceStr: order.orderNum //调用自己的uuid函数
        },
        success(res) {
          if (res.result.returnCode === 'SUCCESS') {
            console.log("异步查询结果:", res.result.tradeStateDesc + "-" + res.result.tradeState)
            if (res.result.tradeState === 'SUCCESS') {
              console.log('支付成功！')
              that.toOrderInfo(order);
            } else {
              setTimeout(function () {
                that.queryPayStatus(order, ++count);
              }, 2000)
            }
          } else {
            setTimeout(function () {
              that.queryPayStatus(order, ++count);
            }, 1000)
          }
        }
      });

    }
  },
  // 微信支付-调用微信底层
  pay(payData, order) {
    var that = this;
    that.setData({
      payStatus: 1
    })
    const payment = payData.payment //这里注意，上一个函数的result中直接整合了这里要用的参数，直接展开即可使用
    console.log(payment)
    // that.queryPayStatus(order)
    wx.requestPayment({
      appId: payment.appId,
      nonceStr: payment.nonceStr,
      package: payment.package,
      paySign: payment.paySign,
      signType: payment.signType,
      timeStamp: payment.timeStamp,
      success(res) {
        console.log('pay success', res)
        wx.showToast({
          title: '正在加载',
          icon: 'success',
          duration: 2000,
        })
        //跳转到支付成功页面
        console.log('支付成功~', order)
        that.setData({
          payStatus: 2
        })
       
        setTimeout(function () {
          wx.navigateTo({
            url: '../shopping-list-detail/shopping-list-detail?id=' + that.data.successOrderId
          })
        }, 2000)
      },
      fail(res) {
        // console.error('pay fail', res)
        //跳转到支付失败页面
        wx.showToast({
          title: '取消支付',
          icon: 'none',
          duration: 1000,
          mask: false
        })
        that.setData({
          payStatus: 0
        })
      }
    })
    this.queryPayStatus(order, 0)
  },
  // 微信支付-第一步，调用云函数得到相关的参数，然后调用pay方法.
  payment(order) {
    console.log('开始调用微信支付')
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    var uuid = order.orderNum //调用自己的uuid函数
    var body = "喜羊羊-茶饮"
    console.log("uuid", uuid)
    wx.cloud.callFunction({
      name: "zhifu",
      data: {
        body: body,
        isQuery: false,
        orderid: uuid,
        money: order.totalPrice, //支付金额
        nonceStr: uuid //调用自己的uuid函数
      },
      success(res) {
        wx.hideLoading({
          complete: (res) => { },
        })
        console.log("提交成功", res.result)
        //创建自己的未支付订单
        that.pay(res.result, order)
      },
      fail(res) {
        wx.hideLoading({
          complete: (res) => { },
        })
        console.log("提交失败", res)
      }
    })

  },

  // 立即支付按钮
  immediateBuy() {
    // payment
    switch (this.data.titltTabName) {
      case '上门自取':
        // console.log('上门自取')
        if (this.data.onePhone === '') {
          wx.showToast({
            title: '请填写收货人电话',
            icon: 'none',
            duration: 2000
          })
        } else {
          console.log(this.data.time, this.data.onePhone);
          // 生成订单然后支付
          this.generate()
          this.setData({
            sizeContentWindow: true
          })
        }
        break;
      case '外卖配送':
        if (this.data.totalPrice < this.data.minPrice) {
          wx.showToast({
            title: '起送价最低' + this.data.minPrice + '元哦~',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        // console.log('外卖配送')
        // 生成订单然后支付
        this.generate()
        this.setData({
          sizeContentWindow: true
        })
        break;
    }
  },
  // 生成订单信息，然后跳转支付页面
  // 
  generate() {
    let list = this.data.shopList;
    let orderList = []
    for (let i = 0; i < list.length; i++) {
      if (list[i].isActive) {
        orderList.push(list[i])
      }
    }
    let userId = wx.getStorageSync('userId')
    if (!userId) {
      this.goLogin();
      return;
    }
    let order = {}
    order.commoditys = orderList;
    order.totalPrice = this.data.totalPrice;
    order.orderNum = this.uuid(32, 32)
    order.type = this.data.titltTabName
    order.status = '待商家确认'
    order.createTime = new Date()
    order.userId = userId
    order.distributionPrice = this.data.distributionPrice
    order.reduction = this.data.reduction // 满减的金额
    order.remarks = this.data.remarks
    if (this.data.titltTabName === '上门自取') {
      order.phone = this.data.onePhone
      order.time = this.data.time
      console.log(this.data.time, this.data.onePhone);
    } else {
      order.address = this.data.addressArray[this.data.address]
      order.totalPrice = this.data.totalPrice + parseFloat(this.data.distributionPrice)
      order.distributionPrice = parseFloat(this.data.distributionPrice)
    }
    this.payment(order)
    //  console.log(order)
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
    this.setData({
      sizeContentWindow: true,
      isActive: false,
      totalPrice: 0,
      priceList: []
    })
    let openId = wx.getStorageSync('openId');
    let logged = false;
    if (openId) {
      this.getShopping();
      logged = true;
    }
    this.setData({
      openId: openId,
      logged: logged
    })

    db.collection("setting").get({
      success: res => {
        this.setData({
          settings: res.data[0]
        })
      }
    })

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
  // 判断商品是否改变价格
  getCommodityPrice() {
    // 暂时先不写
  },
  // 获取配送地址
  searchAddress() {
    let userId = wx.getStorageSync('userId')
    console.log(userId)
    db.collection('address').where({
      parentId: userId
    }).get({
      success: res => {
        console.log(res)
        if (res.data.length < 1) {
          wx.showLoading({
            title: '正在跳转配送地址管理页面',
          })
          setTimeout(function () {
            // 如果配送地址小于1 那么就跳转到管理地址页面
            wx.navigateTo({
              url: '../address-list/address-list',
            })
            wx.hideLoading({
              success: (res) => { },
            })
          }, 500)
        }
        this.setData({
          addressArray: res.data
        })
      }
    })
  }
  ,
  upShopping(shopping) {
    wx.cloud.callFunction({
      name: 'upShopping',
      data: shopping,
      success: res => {
        // console.log('云函数更新',res)
      }
    })
  },
  // 跳转到登陆页
  goLogin() {
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function () {
      wx.navigateTo({
        url: '../login/login',
      })
      wx.hideLoading({
        success: (res) => { },
      })
    }, 500)
  },
  // 计算满减
  fullReduction() {
    console.log(this.data.settings)

    let total = 0;
    let totalFull = 0;
    this.data.shopList.forEach(ele => {
      if (ele.isActive) {
        total = total + ele.totalPrice;
        if (!ele.discount || ele.discount == 0) {
          totalFull = totalFull + ele.totalPrice;
        }
      }
    })
    if (totalFull >= this.data.settings.full) {
      total = total - this.data.settings.reduction;
      this.setData({
        totalPrice: this.changeTwoDecimal_f(total),
        reduction: this.data.settings.reduction
      })
    } else {
      this.setData({
        totalPrice: this.changeTwoDecimal_f(total),
        reduction: 0
      })
    }

  },
  uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) {
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
  },
  changeTwoDecimal_f(x) {
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
      return 0;
    }
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
      pos_decimal = s_x.length;
      s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
      s_x += '0';
    }
    return parseFloat(s_x);
  }
})