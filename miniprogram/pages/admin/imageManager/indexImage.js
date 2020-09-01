// miniprogram/pages/admin/imageManager/indexImage.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList:[],
    type:'index'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
    wx.showLoading({ 
      title : '加载中...', 
      mask : true, 
    });
    this.getImage();
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

  ChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
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
            cloudPath: "indexImg/" + new Date().getTime() +"-"+ Math.floor(Math.random() * 1000),//云储存的路径及文件名
            filePath : chooseres.tempFilePaths[0], //要上传的图片/文件路径 这里使用的是选择图片返回的临时地址
            success : (uploadres) => { //上传图片到云储存成功
              console.log(uploadres)
              // 直接存在数据库中
              this.saveImage(uploadres.fileID)
             
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
  getImage(){
    db.collection("image").where({
      type:this.data.type
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          imageList: res.data
        })
        wx.hideLoading() //让提示框隐藏、消失
      }
    })
  },
  saveImage(fileId){
    wx.cloud.callFunction({
      name: 'addImage',
      data: {
        fileId: fileId,
        type: this.data.type
      },
      success: res => {
          console.log('添加图片',res)
          if(res.result.result._id){
            this.getImage();
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 500
            })
            
          }
      }
    })
  },
  deleteImage(e) {
    let that = this;
    wx.showModal({
      title: '操作提示',
      content: '确定要删除本图片吗',
      success (res) {
        if (res.confirm) {
          wx.showLoading({ 
            title : '删除中..', 
            mask : true, 
          });
         
          let index = e.currentTarget.dataset.index;
          let list = that.data.imageList;
          console.log(list[index]._id);
          wx.cloud.callFunction({
            name: "deleteImage",
            data: {
              id: list[index]._id,
              fileId: list[index].fileId
            },
            success(res) {
              that.getImage();
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 500
              })
              console.log("删除云函数", res)
             
            }
          })
        }
      }
    })
    
  }
})