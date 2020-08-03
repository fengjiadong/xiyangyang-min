// miniprogram/pages/admin/commodity/editCommodity.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDj:false,
    imgList:[],
    info:{
      image:'',
      invalid:false,
      id:'',
      name:'',
      type:'',
      price:0,
      detail:'',
      priceTow:0,
      priceThree:0,
      isDelete:false
    },
    types:[],
    index:0,
    imgIndex:0
  },
  PickerChange(e) {
    // console.log(e);
    this.data.info.type = this.data.types[e.detail.value]._id
    this.setData({
      index: e.detail.value,
      info:this.data.info
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      success: (chooseres) => {
        wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
          title : '图片上传中', //提示框显示的提示信息
          mask : true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
        });
        console.log(chooseres)
        let url = chooseres.tempFilePaths[0];
        url.indexOf("")
          //选择图片后可以在这里上传
          wx.cloud.uploadFile({
            cloudPath: "img/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000),//云储存的路径及文件名
            filePath : chooseres.tempFilePaths[0], //要上传的图片/文件路径 这里使用的是选择图片返回的临时地址
            success : (uploadres) => { //上传图片到云储存成功
              console.log(uploadres)
              this.data.info.image = uploadres.fileID;
              this.setData({
                info:this.data.info
              })
              wx.hideLoading() //让提示框隐藏、消失
            },
            fail : (err) => {
              console.log(err)
            }
          })
        this.setData({
          imgList: chooseres.tempFilePaths
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getType();
    if(options.id){
      wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
        title : '数据读取中', //提示框显示的提示信息
        mask : true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
      });
      this.data.info.id = options.id;
      this.setData({
        info:this.data.info
      })
      this.getCommodity();
    }
   
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
  updateValue(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
  },
  invalid(e){
    this.data.info.invalid = !e.detail.value;
    this.setData({
      info: this.data.info
    })
    console.log(this.data.info.invalid)
  },
  add(){
    this.setData({
      isDj:true
    })
    wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
      title : '加载中', //提示框显示的提示信息
      mask : true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
    });
    if(!this.check()){
      this.setData({
        isDj:false
      })
      return;
   }
    // console.log(this.data.info)
    wx.cloud.callFunction({
      name: 'addCommodity',
      data: this.data.info,
      success: res => {
        console.log(res)
        wx.hideLoading() //让提示框隐藏、消失
        if(res.result.result._id){
          this.data.info.id = res.result.result._id;
          this.setData({
            info:this.data.info
          })
          wx.setStorageSync('addCommodity',this.data.info);
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 500
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        }else{
          this.setData({
            isDj:false
          })
        }
      }
    })
  },
  save(){
    this.setData({
      isDj:true
    })
    wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
      title : '加载中', //提示框显示的提示信息
      mask : true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false时可以操作屏幕
    });
    if(!this.check()){
        this.setData({
          isDj:false
        })
        return;
    }
    console.log( this.data.info)
    // console.log(this.data.info)
    wx.cloud.callFunction({
      name: 'upCommodity',
      data: this.data.info,
      success: res => {
        console.log(res)
        wx.hideLoading() //让提示框隐藏、消失
        if(res.result.result.stats.updated > 0){
          wx.setStorageSync('commodity',this.data.info);
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 500
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        }else{
          this.setData({
            isDj:true
          })
        }
      }
    })
  },
  delete(){
    this.setData({
      isDj:true
    })
    wx.showModal({
      title: '操作提示',
      content: '确定要删除本商品吗',
      success (res) {
        if (res.confirm) {
          this.data.info.isDelete = true;
          this.setData({
            info: this.data.info
          })
          this.save();
        } else if (res.cancel) {
          console.log('用户点击取消')
          this.setData({
            isDj: false
          })
        }
      }
    })
    
  },
  getType(){
    db.collection('type').get({
      success: res => {
        this.data.info.type = res.data[0]._id;
        this.setData({
          types: res.data,
          info:this.data.info
        })
      }
    })
  },
  getCommodity(){
    db.collection('commodity').where({
      _id:this.data.info.id
    }).get({
      success: res => {
        let info = {
          type:res.data[0].type,
          price:parseFloat(res.data[0].price),
          detail:res.data[0].detail,
          invalid: res.data[0].invalid,
          isDelete:res.data[0].isDelete,
          priceTow:parseFloat(res.data[0].priceTow),
          priceThree:parseFloat(res.data[0].priceThree),
          name:res.data[0].name,
          image:res.data[0].image,
          id:res.data[0]._id
        }
        this.setData({
          info:info,
          imgList:[res.data[0].image]
        })
        for(let i = 0;i < this.data.types.length;i++){
          if(this.data.info.type === this.data.types[i]._id){
            this.setData({
              index:i
            })  
            break;
          }
        }
        wx.hideLoading()
      }
    })
  },
  check(){
    let info = this.data.info;
    console.log(this.data.info)
    if(!info.name){
      wx.showToast({
        title: '请输入商品名称',
        duration: 1000,
        icon: 'none'
      })
      return false;
    }
    if(!info.price){
      wx.showToast({
        title: '请输入商品价格',
        duration: 1000,
        icon: 'none'
      })
      return false;
    }
    if(!info.image){
      wx.showToast({
        title: '请上传商品图片',
        duration: 1000,
        icon: 'none'
      })
      return false;
    }
    this.data.info.price = parseFloat(this.data.info.price);
    if(info.priceTow){
      this.data.info.priceTow = parseFloat(this.data.info.priceTow);
    }else{
      this.data.info.priceTow = 0;
    }
    if(info.priceThree){
      this.data.info.priceThree = parseFloat(this.data.info.priceThree);
    }else{
      this.data.info.priceThree = 0;
    }
    this.setData({
      info:this.data.info
    })
    return true;
  }
})