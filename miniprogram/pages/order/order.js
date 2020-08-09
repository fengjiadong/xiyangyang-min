// miniprogram/pages/order/order.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['cloud://xiyangyang-l5zon.7869-xiyangyang-l5zon-1302640380/image/five.jpg', '/images/img/four.jpg', '/images/img/seven.jpg'],
    price:0, //显示在弹窗里的
    selected: 0,
    specificationsPrice:0,
    selectedCommoity:{},
    specifications: [],
    selectedType: {},
    selectList: [{ // 饮料类型选择
      title: '热销推荐'
    }],
    foodTypeList: [
      // {
      //   image: '/images/img/medal.png',
      //   name: '蓝颜知己',
      //   detail: '蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己蓝颜知己',
      //   price: '18',
      // }
    ],
    sizeContentWindow: true,
    sizeName: '蓝颜知己',
    glassList: [{
        name: '常规一人份'
      }
    ],
    // 小料列表
    specifications: [],
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
    foodType: [],
    sugarType: '正常糖',
    iceType: '正常冰',
  },
  // 饮料类型选择
  typeSelect(e) {
    console.log(e);
    let that = this;
    let index = e.currentTarget.dataset.index
    console.log(index);
    that.setData({
      selected: index,
      selectedType: this.data.selectList[index]
    })
    this.searchCommodity(this.data.selectedType._id)
   
  },
  // 规格选择
  sizeContent(e) {
    console.log(e);
    const name = e.currentTarget.dataset.name;
    const index = e.currentTarget.dataset.index;
    const info = this.data.foodTypeList[index];
    console.log(this.data.foodTypeList[index])
    for(var i = 0; i < this.data.specifications.length;i++){
      this.data.specifications[i].selectedFood = false
    }
    this.setData({
      sizeContentWindow: false,
      sizeName: name,
      price:info.price?info.price:info.priceTow?info.priceTow:info.priceThree,
      specifications:this.data.specifications
    })
    let glassList = [];
    if (info.price && info.price > 0) {
      let price = {
        name: '常规',
        price: info.price
      }
      glassList.push(price)
    }
    if (info.priceTow && info.priceTow > 0) {
      let typeTow = {
        name: '大份',
        price: info.priceTow
      }
      glassList.push(typeTow)
    }
    if (info.priceThree && info.priceThree > 0) {
      let typeThree = {
        name: '超大份',
        price: info.priceThree
      }
      glassList.push(typeThree)
    }
    console.log(glassList)
    this.setData({
      glassList: glassList,
      selectedCommoity:info
    })
  },
  // 隐藏遮罩层
  hiddenwindow() {
    this.setData({
      sizeContentWindow: true,
      selectedGlass:0,
      selectedSugar:0,
      selectedIce:0,
      glassList:[],
      specificationsPrice:0,
      price:0,
      sizeName:'',
      selectedCommoity:{}
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
      glassType: that.data.glassList[indexOne].name,
      price: this.changeTwoDecimal_f(this.changeTwoDecimal_f(that.data.glassList[indexOne].price) + this.data.specificationsPrice)
    })
  },
  // 小料选择
  foodSelect(e) {
    console.log(e);
    let that = this;
    const index = e.currentTarget.dataset.index;
    console.log(index);
    let list = that.data.specifications;
    list[index].selectedFood = !list[index].selectedFood;
    that.setData({
      specifications: list,
    })
    if (list[index].selectedFood) {
      let selectList = that.data.foodType;
      selectList.push(that.data.specifications[index].name);
      console.log(selectList)
      this.setData({
        foodType: selectList,
        specificationsPrice: this.data.specificationsPrice + that.data.specifications[index].price,
        price: this.changeTwoDecimal_f(this.changeTwoDecimal_f(this.data.price) + that.data.specifications[index].price)
      })
    } else {
      let noselectList = that.data.foodType;
      for (let i = 0; i <= noselectList.length; i++) {
        if (noselectList[i] == that.data.specifications[index].name) {
          noselectList.splice(i, 1)
        }
      }
      console.log(noselectList)
      this.setData({
        foodType: noselectList,
        specificationsPrice: this.data.specificationsPrice - that.data.specifications[index].price,
        price: this.changeTwoDecimal_f(this.changeTwoDecimal_f(this.data.price) - that.data.specifications[index].price)
      })
    }
    console.log(that.data.specifications)
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
  // 跳转到登陆页
  goLogin() {
    wx.showLoading({
      title: '正在加载',
    })
    setTimeout(function(){
      wx.navigateTo({
        url: '../login/login',
      })
      wx.hideLoading({
        success: (res) => {},
      })
    },500)
    
  },
  // 跳转至详情页面
  goDetail(e) {
    let userId = wx.getStorageSync('userId')
    if(!userId){
      this.goLogin();
      return;
    }
    if(this.data.selectedType.name === '羊羊加料'){
      this.sizeContent(e)
      return;
    }
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../food-detail/food-detail?id=' + e.currentTarget.dataset.id,
      success: function (res) {},
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  // 跳转至购物车
  goShopTaxi() {
    wx.showLoading({
      title: '正在加入购物车',
    })
    let userId = wx.getStorageSync('userId')
    if(!userId){
      this.goLogin();
      return;
    }
    // 得到小料选择数量
    let list = this.data.specifications;
    let specifications = []
    for (let i = 0; i < list.length; i++) {
      if (list[i].selectedFood) {
        specifications.push(list[i]);
      }
    }
   
    let shopping = {}
    shopping.commodityId = this.data.selectedCommoity._id;
    shopping.name = this.data.selectedCommoity.name;
    shopping.userId = userId;
    shopping.image = this.data.selectedCommoity.image;
    shopping.iceType = this.data.iceType;
    shopping.glassType = this.data.glassList[this.data.selectedGlass];
    shopping.specifications = specifications;
    shopping.sugarType = this.data.sugarType;
    shopping.price = this.data.price;
    shopping.specificationsPrice = this.data.specificationsPrice;
    shopping.selectedType = this.data.selectedType.name
    console.log(shopping)
    wx.cloud.callFunction({
      name: "addShopping",
      data: shopping,
      success(res) {
        wx.hideLoading()
        //存入购物车
        wx.switchTab({
          url: '../shopping-list/shopping',
        })
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取type
    this.getType();
    this.getSpecifications();
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
    })
    // this.getType();
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
  getType() {
    wx.showLoading({
      title: '正在加载',
    })
    db.collection('type')
    .orderBy('sort', 'ase').get({
      success: res => {
        this.setData({
          selectList: res.data
        })
        wx.hideLoading({
          success: (res) => {},
        })
        this.searchCommodity(this.data.selectList[0]._id)
        console.log('[数据库] [查询记录] 成1功: ', res)
      }
    })
  },
  searchCommodity(typeId) {
    wx.showLoading({
      title: '正在加载',
    })
    this.setData({
      foodTypeList: []
    })
    db.collection('commodity').where({
      type: typeId,
      isDelete:false,
      invalid:false
    }).get({
      success: res => {
        this.setData({
          foodTypeList: res.data
        })
        wx.hideLoading({
          success: (res) => {},
        })
        console.log('[数据库] [查询记录] 成1功: ', res)
      }
    })
  },
  // 查询小料
  getSpecifications() {
    db.collection('specifications').where({
      isDelete: false,
      invalid: false
    }).get({
      success: res => {
        this.setData({
          specifications: res.data
        })
        console.log('[数据库] [查询记录] 成1功: ', res)
      }
    })
  },
  changeTwoDecimal_f(x) { 
    　　var f_x = parseFloat(x); 
      　　if (isNaN(f_x)) 
      　　{ 
      　　　　return 0; 
      　　} 
      　　var f_x = Math.round(x*100)/100; 
      　　var s_x = f_x.toString(); 
      　　var pos_decimal = s_x.indexOf('.'); 
      　　if (pos_decimal < 0) 
      　　{ 
      　　　　pos_decimal = s_x.length; 
      　　s_x += '.'; 
      　　} 
      　　while (s_x.length <= pos_decimal + 2) 
      　　{ 
      　　　　s_x += '0'; 
      　　} 
    　　return parseFloat(s_x); 
      }
})