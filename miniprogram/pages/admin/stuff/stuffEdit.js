// miniprogram/pages/admin/stuff/stuffEdit.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
    types:[{name:'管理员',roleNum:1},{name:'超级管理员',roleNum:0}],
    gender:[{name:'男'},{name:'女'}],
    index:0,
    genderIndex:0,
    info:{
      nickName:'待选择',
      gender:'男',
      role:'管理员',
      post:'员工',
      roleNum:1,
      isDelete:false,
      invalid:false
    },
    imgIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      // 找到管理员详情
      db.collection('admin').doc(options.id).get({
        success: res=>{
          console.log(res)
          let gender = res.data.gender=='男'?0:1
          let roleNum = res.data.roleNum ==0?1:0
          this.setData({
            info:res.data,
            genderIndex:gender,
            index:roleNum,
            imgList:[res.data.image]
          })
        }
      })
    }
    
  },
  PickerChange(e) {
    // console.log(e);
    this.data.info.role = this.data.types[e.detail.value].name
    this.data.info.roleNum = this.data.types[e.detail.value].roleNum
    this.setData({
      index: e.detail.value,
      info:this.data.info
    })
  },
  GenderChange(e) {
    this.data.info.gender = this.data.gender[e.detail.value].name
    this.setData({
      genderIndex: e.detail.value,
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
            cloudPath: "stuff/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000),//云储存的路径及文件名
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let selectUser = wx.getStorageSync('selectUser');
    console.log(selectUser)
    if(selectUser){
      this.data.info.userId = selectUser._id
      this.data.info.nickName = selectUser.nickName
      wx.removeStorageSync('selectUser')
      this.setData({
        info:this.data.info
      })
    }
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
  wxChange(){
    wx.navigateTo({
      url: '../user/user?wxName=1',
    })
   
  },
  add(){
    console.log(this.data.info)
    wx.showLoading({
      title: '正在添加..',
    })
    console.log(this.data.info)
    wx.cloud.callFunction({
      name: "addAdmin",
      data: this.data.info,
      success(res) {
        if(res.result.result._ids[0]){
          wx.showToast({
            title: '添加成功!',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        }
      }
    })
  },
  save(){
    wx.showLoading({
      title: '正在保存..',
    })
    console.log(this.data.info)
    wx.cloud.callFunction({
      name: "upAdmin",
      data: this.data.info,
      success(res) {
        console.log(res.result.result.stats.updated)
        if(res.result.result.stats.updated){
          wx.showToast({
            title: '修改成功!',
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        }
      }
    })
  },
  delete(){
    this.data.info.isDelete = true;
    this.data.info.invalid = true;
    this.setData({
      info: this.data.info
    })
    this.save();
  },
  updateValue(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
  },
  invalid(e){
    this.data.info.invalid = !e.detail.value
    this.setData({
      info: this.data.info
    })
    console.log(this.data.info.invalid)
  }
})