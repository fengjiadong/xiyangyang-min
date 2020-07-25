// miniprogram/pages/shopping-list/shopping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [{
        id: '123',
        image: '/images/img/taxi-one.png',
        price: '19',
        isActive: false,
        name: '蓝颜知己',
        number: 1,
      },
      {
        id: '123',
        image: '/images/img/taxi-two.png',
        price: '19',
        isActive: false,
        name: '蓝颜知己',
        number: 1,
      },
      {
        id: '123',
        image: '/images/img/taxi-one.png',
        price: '19',
        isActive: false,
        name: '蓝颜知己',
        number: 1,
      },
      {
        id: '123',
        image: '/images/img/taxi-one.png',
        price: '19',
        isActive: false,
        name: '蓝颜知己',
        number: 1,
      },
      {
        id: '123',
        image: '/images/img/taxi-two.png',
        price: '19',
        isActive: false,
        name: '蓝颜知己',
        number: 1,
      },
      {
        id: '123',
        image: '/images/img/taxi-one.png',
        price: '19',
        isActive: false,
        name: '蓝颜知己',
        number: 1,
      },
      {
        id: '123',
        image: '/images/img/taxi-two.png',
        price: '19',
        isActive: false,
        name: '蓝颜知己',
        number: 1,
      },
    ],
    isActive: false,
    deleteIs: false,
    totalPrice: 123
  },
  // 是否选中
  isSelect(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    let list = this.data.shopList;
    list[index].isActive = !list[index].isActive;
    this.setData({
      shopList: list,
      isActive:false
    })
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