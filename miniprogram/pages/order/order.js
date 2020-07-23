// miniprogram/pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 0,
    selectList: [{ // 饮料类型选择
        title: '热销推荐'
      },
      {
        title: '烧仙草'
      },
      {
        title: '鲜奶果茶'
      },
      {
        title: '芝士系列'
      },
      {
        title: '魔王奶茶'
      },
      {
        title: '冰爽夏日'
      },
      {
        title: '羊羊加料'
      },
    ],
    foodTypeList: [{
        image: '/images/img/medal.png',
        name: '蓝颜知己',
        detail: '蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己',
        price: '18',
        type: '常规',
      },
      {
        image: '/images/img/medal.png',
        name: '蓝颜知己',
        detail: '蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己',
        price: '18',
        type: '常规',
      },
      {
        image: '/images/img/medal.png',
        name: '蓝颜知己',
        detail: '蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己',
        price: '18',
        type: '常规',
      },
      {
        image: '/images/img/medal.png',
        name: '蓝颜知己',
        detail: '蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己',
        price: '18',
        type: '常规',
      },
      {
        image: '/images/img/medal.png',
        name: '蓝颜知己',
        detail: '蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己',
        price: '18',
        type: '常规',
      }
    ],
    sizeContentWindow: true,
    sizeName: '蓝颜知己',
    glassList: [{
        name: '常规一人份'
      },
      {
        name: '大杯'
      }
    ],
    foodList: [{
        name: '常规'
      },
      {
        name: '豆花布丁'
      },
      {
        name: '红豆'
      },
      {
        name: '焦糖冻'
      },
      {
        name: '晶球'
      },
      {
        name: '咖啡冻'
      },
      {
        name: '烧仙草'
      },
      {
        name: '燕麦'
      },
      {
        name: '椰果'
      },
      {
        name: '芋圆'
      },
      {
        name: '珍珠'
      },
      {
        name: '芝士奶盖'
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
    iceList:[ // 冰类型选择
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
    selectedIce:0,
    glassType:'常规',
    foodType: '常规',
    sugarType: '正常糖',
    iceType:'正常冰',
    price:'19',

  },
  // 饮料类型选择
  typeSelect(e) {
    console.log(e);
    let that = this;
    let index = e.currentTarget.dataset.index
    console.log(index);
    that.setData({
      selected: index,
    })
  },
  // 规格选择
  sizeContent(e) {
    console.log(e);
    const name = e.currentTarget.dataset.name;
    this.setData({
      sizeContentWindow: false,
      sizeName: name,
    })
  },
  // 隐藏遮罩层
  hiddenwindow() {
    this.setData({
      sizeContentWindow: true,
    })
  },
  // 杯型选择
  glassSelect(e) {
    console.log(e);
    let that = this;
    let indexOne = e.currentTarget.dataset.index
    console.log(indexOne);
    that.setData({
      selectedGlass: indexOne,
      glassType: that.data.glassList[0].name
    })
  },
  // 规格选择
  foodSelect(e) {
    console.log(e);
    let that = this;
    const index = e.currentTarget.dataset.index;
    console.log(index);
    that.setData({
      selectedFood: index,
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
      iceType: that.data.iceSelect[index].name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getTypeList()
  },
  getTypeList(){
    const db = wx.cloud.database()
    db.collection('type').get({
      success: res => {
        console.log(res)
        this.setData({
          selectList: res.data
        })
      }
    })
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

  }
})