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
    specifications:[],
    specificationsPrice:0,
    glassList: [{
      name: '常规',
      price: 0
    },
    {
      name: '大份',
      price: 20
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
      glassType: that.data.glassList[indexOne].name,
      price:  this.changeTwoDecimal_f(this.changeTwoDecimal_f(that.data.glassList[indexOne].price) + this.data.specificationsPrice)
    })
  },
  // 小料规格选择
  foodSelect(e) {
    console.log(e);
    let that = this;
    const index = e.currentTarget.dataset.index;
    console.log(index);
    let list = that.data.specifications;
    list[index].selectedFood = !list[index].selectedFood;
    that.setData({
      specifications: list,
      foodType: that.data.specifications[index].name
     
    })
    if(list[index].selectedFood){
      this.setData({
        specificationsPrice: this.data.specificationsPrice + that.data.specifications[index].price,
        price:  this.changeTwoDecimal_f(this.changeTwoDecimal_f(this.data.price) +  that.data.specifications[index].price)
      })
    }else{
      this.setData({
        specificationsPrice: this.data.specificationsPrice - that.data.specifications[index].price,
        price:  this.changeTwoDecimal_f(this.changeTwoDecimal_f(this.data.price) -  that.data.specifications[index].price)
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
  // 跳转至购物车
  goShopTaxi() {
    wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
      title : '正在加入购物车', //提示框显示的提示信息
      mask : true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
    });
    // 得到小料选择数量
    let list = this.data.specifications;
    let specifications = []
    for(let i = 0;i < list.length; i++){
      if(list[i].selectedFood){
        specifications.push(list[i]);
      }
    }
    let userId = wx.getStorageSync('userId')
    let shopping = {}
    shopping.commodityId= this.data.id;
    shopping.name = this.data.name;
    shopping.userId = userId;
    shopping.image = this.data.imageUrl;
    shopping.iceType = this.data.iceType;
    shopping.glassType = this.data.glassList[this.data.selectedGlass];
    shopping.specifications = specifications;
    shopping.sugarType = this.data.sugarType;
    shopping.price = this.data.price;
    shopping.specificationsPrice = this.data.specificationsPrice;
    console.log(shopping)
    wx.cloud.callFunction({
      name: "addShopping",
      data: shopping,
      success(res) {
        // wx.hideLoading()
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
    var id = options.id;
    console.log(id)
    this.getCommodity(id);
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

        let glassList = [];
        let type = {name:'常规',price:res.data[0].price}
        glassList.push(type)
        if(res.data[0].priceTow && res.data[0].priceTow > 0){
          let typeTow = {name:'大份',price:res.data[0].priceTow}
          glassList.push(typeTow)
        }
        if(res.data[0].priceThree && res.data[0].priceThree > 0){
          let typeThree = {name:'超大份',price:res.data[0].priceThree}
          glassList.push(typeThree)
        }
        console.log(glassList)
        this.setData({
          glassList:glassList
        })
      }
    })
  },
  // 查询小料
  getSpecifications(){
    db.collection('specifications').where({
      isDelete:false,
      invalid:false
    }).get({
      success: res => {
        this.setData({
          specifications: res.data
        })
        console.log('[数据库] [查询记录] 成1功: ', res)
      }
    })
  }
  ,
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