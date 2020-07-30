// miniprogram/pages/food-detail/food-detail.js
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    imageUrl: '',
    name:'',
    price:0,
    detail:'',
    glassList: [{
      name: '常规一人份'
    },
    {
      name: '大杯'
    }
    ],
    foodList: [{
      name: '常规',
      selectedFood: true
    },
    {
      name: '豆花布丁',
      selectedFood: false
    },
    {
      name: '红豆',
      selectedFood: false
    },
    {
      name: '焦糖冻',
      selectedFood: false
    },
    {
      name: '晶球',
      selectedFood: false
    },
    {
      name: '咖啡冻',
      selectedFood: false
    },
    {
      name: '烧仙草',
      selectedFood: false
    },
    {
      name: '燕麦',
      selectedFood: false
    },
    {
      name: '椰果',
      selectedFood: false
    },
    {
      name: '芋圆',
      selectedFood: false
    },
    {
      name: '珍珠',
      selectedFood: false
    },
    {
      name: '芝士奶盖',
      selectedFood: false
    }
    ],
    sugarList: [{ // 糖度选择
      name: '正常糖'
    },
    {
      name: '七分糖'
    },
    {
      name: '五分糖'
    },
    {
      name: '三分糖'
    },
    {
      name: '不加糖'
    },
    ],
    iceList: [ // 冰类型选择
      {
        name: '正常冰'
      },
      {
        name: '常温'
      },
      {
        name: '少冰'
      },
      {
        name: '多冰'
      }
    ],
    selectedGlass: 0,
    selectedFood: 0,
    selectedSugar: 0,
    selectedIce: 0,
    glassType: '常规',
    foodType: '常规',
    sugarType: '正常糖',
    iceType: '正常冰',
  },
  // 杯型选择
  glassSelect(e) {
    console.log(e);
    let that = this;
    let indexOne = e.currentTarget.dataset.index
    console.log(indexOne);
    that.setData({
      selectedGlass: indexOne,
      glassType: that.data.glassList[indexOne].name
    })
  },
  // 规格选择
  foodSelect(e) {
    console.log(e);
    let that = this;
    const index = e.currentTarget.dataset.index;
    console.log(index);
    let list = that.data.foodList;
    list[index].selectedFood = !list[index].selectedFood;
    that.setData({
      foodList: list,
      foodType: that.data.foodList[index].name
    })
  },
  // 精度选择
  sugarSelect(e) {
    console.log(e);
    let that = this;
    let index = e.currentTarget.dataset.index
    console.log(index);
    that.setData({
      selectedSugar: index,
      sugarType: that.data.sugarList[index].name
    })
  },
  // 冰度选择
  iceSelect(e) {
    console.log(e);
    let that = this;
    let index = e.currentTarget.dataset.index
    console.log(index);
    that.setData({
      selectedIce: index,
      iceType: that.data.iceList[index].name
    })
  },
  // 跳转至购物车
  goShopTaxi() {
    // 存入购物车
    // wx.switchTab({
    //   url: '../shopping-list/shopping',
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    console.log(id)
    this.getCommodity(id);
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
  getCommodity(id){
    db.collection('commodity').where({
      _id:id
    }).get({
      success: res => {
        this.setData({
          id:id,
          imageUrl: res.data[0].image,
          name: res.data[0].name,
          detail: res.data[0].detail,
          price: res.data[0].price
        })
      }
    })
  }
})