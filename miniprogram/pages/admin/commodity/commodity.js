const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    lists: [],
    load: true
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   // 
   let info =  wx.getStorageSync('commodity');
   let addInfo =  wx.getStorageSync('addCommodity');
   if(info){
    wx.clearStorageSync('commodity')
      console.log('info',info)
      let list = this.data.list;
      for(var i = 0; i <list.length; i++){
        for(var j = 0; j < list[i].item.length; j++){
          if(list[i].item[j]._id === info.id){
              console.log('找到了-')
              list[i].item.splice(j,1)
              // list[i].item[j] = info;
              // list[i].item[j]._id = info.id;
              this.setData({
                list:list
              })
              if(!info.isDelete){
                this.moveInfo(info)
              }
              break;
          }
        }
      }
   }
   if(addInfo){
      this.moveInfo(addInfo);
   }
    
  },
  // 给某个分类添加一个商品
  moveInfo(addInfo){
    wx.clearStorageSync('addCommodity')
    let list = this.data.list;
    for(var i = 0; i <list.length; i++){
      console.log(list[i])
      if(list[i]._id === addInfo.type){
         console.log('找到了类型了')
         list[i].item.unshift(addInfo)
         list[i].item[0]._id = addInfo.id;
         this.setData({
          list:list
         })
         console.log('添加好了')
         break;
      }
    }
  }
,
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.getType();

  },
  onReady() {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  // 获取商品类型
  getType() {
    db.collection('type').get({
      success: res => {
        this.setData({
          lists: res.data
        })
        let list = [{}];
        for (let i = 0; i < this.data.lists.length; i++) {
          list[i] = {};
          list[i].name = this.data.lists[i].name
          list[i].id = i;
          list[i]._id = this.data.lists[i]._id;
          let that = this;
          db.collection('commodity').where({
            type:that.data.lists[i]._id,
            isDelete:false
          }).get({
            success: res => {
            list[i].item = res.data;
            that.setData({
              list: list
            })
            }
          })
        }
        this.setData({
          list: list,
          listCur: list[0]
        })
        wx.hideLoading() //让提示框隐藏、消失
      }
    })
  },
  searchCommodity(typeId){
    db.collection('commodity').where({
      type:typeId
    }).get()
  }
  ,addCommodity(){
      console.log('跳转到添加商品页')
      wx.navigateTo({
        url: 'editCommodity',
      })
  },
  upCommodity(e){
    // console.log()
    wx.navigateTo({
      url: 'editCommodity?id='+e.currentTarget.dataset.id,
    })
  }
})