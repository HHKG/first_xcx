// pages/outer/outer.js
var app = getApp();
var utilMd5 = require('../../utils/md5.js');
var util = require('../../utils/util.js');
var time = Date.parse(new Date()) / 1000;
var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharename: '',
    shareimg: '',
    shareurl: '',
    current:0,
    id:0,
    area:2,
    btn:3,
    hidden:true,
    phonenum:'400-990-8830',
    version: app.globalData.version
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.incode) {
      wx.setStorageSync('incode', options.incode)

    }
    var that = this;
    var saction = 'shareinfo';
    var id = 'dujiaodi';
    var ssign = utilMd5.hexMD5(saction + randomstr + id + time);
    wx.request({
      url: app.host + saction,
      method: 'get',
      dataType: 'json',
      data: { from: app.from, time: time, action: saction, share: id, sign: ssign },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            sharename: res.data.data.E_Name,
            shareimg: res.data.data.E_Img,
            shareurl: res.data.data.E_Url,
          })
        }
      }
    })
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
    return {
      title: this.data.sharename,
      path: this.data.shareurl + '?incode=' + wx.getStorageSync('myincode'),
      imageUrl: this.data.shareimg,

    };
    // // 显示当前页面的转发按钮
    // wx.showShareMenu({
    //   withShareTicket: true,
    // });
    // // 隐藏转发按钮
    // // wx.hideShareMenu()

    // return{
    //   title:'测试的标题',
    //   path:'pages/index/index?Invitation=12561',
    //   imageUrl:'/images/service_banner.png',
    //   success(res){
    //     // 获取转发详细信息
    //     wx.getShareInfo({
    //       shareTicket: res.shareTickets[0],
    //       success(res) {
    //       }
    //     });
    //   },
      
    // }
  },
  /**
   * 导航栏切换
   */
  changeTab:function(e){
    var id=e.currentTarget.dataset.id;
    var area=e.currentTarget.dataset.area;
    this.setData({
      id:id,
      area:area
    })
  }
  ,
  /**
   * 页面滑动触发悬浮按钮动画
   */
  onPageScroll:function(e){
    var that=this;
    var scrollH=e.scrollTop;
    if(scrollH>300){
      that.setData({
        btn:1
      })
    }else{
      that.setData({
        btn: 3
      })
    }
  }
  ,
  /**
   * 轮播图滑动触发的事件
   */
  changeDot:function(event){
    var dotActive = event.currentTarget.dataset.dotactive;
    var current=event.detail.current;
      this.setData({
        current: current
      })
  },

  /**
   * 弹窗的交互
   */
  pop: function () {
    this.setData({
      hidden: !this.data.hidden
    })
  },
  /**
   * 拨打电话
   */
   makeCall:function(){
     var that=this;
     wx.showActionSheet({
       itemList: ['呼叫','添加联系人'],
       success:function(res){
        if(res.tapIndex==0){
          wx.makePhoneCall({
            phoneNumber: '400-990-8830',
          })
        }
        // 添加联系人
         if (res.tapIndex == 1){
          wx.addPhoneContact({
            firstName: '虔心荟',
            phoneNumber: that.data.phonenum
          })
         }
       }
     })
   },
   /**
    * 跳到房源列表
    */
  toRoomList:function(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/holiday/roomList/roomList?id='+id,
    })
  }
  ,
  /**
   * 跳转到免费攻略页面
   */
  gotoFree: function () {
    wx.navigateTo({
      url: '/pages/holiday/free/free',
    })
  }
})