// pages/member/rebate/rebate.js
// pages/member/myPlan/myPlan.js
var app = getApp();
var utilMd5 = require('../../../utils/md5.js');
var util = require('../../../utils/util.js');
var time = Date.parse(new Date()) / 1000;
var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pattern: app.globalData.pattern,
    plan:'rebateActive',
    coupon:'',
    bills:'',
    coupons:'',
    token: '',
    back: '',
    billhidden:true,
    couponhidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this;
    that.getrebate('plan');
    var token = wx.getStorageSync('token');
    that.setData({
      pattern: app.globalData.pattern,
      token: token,
    })
    if (token == undefined || token == '') {
      token = util.checklogin(back);
      that.setData({
        token: token,
      })
      return;
    }
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getNetworkType({
      success: function (res) {
        console.log(res);
        if (res.networkType == 'none') {
          wx.showToast({
            icon: 'none',
            title: "当前网络不可用",
            success: function (res) {
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }, 1000)
            }
          });

        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getCurrentPages()[getCurrentPages().length - 1].onLoad()
    if (wx.getStorageSync('token')) {
      var raction = 'record';
      var road = 'rebate'
      var rsign = utilMd5.hexMD5(raction + randomstr + road + time);
      wx.request({
        url: app.host + raction,
        method: 'post',
        dataType: 'json',
        header: { token: wx.getStorageSync('token') },
        data: { from: app.from, time: time, road: road, action: raction, sign: rsign },
        success: function (res) {
        }
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
  gotorebate:function(e){
    var type=e.target.dataset.type;
    
    this.getrebate(type)
  },
  getrebate:function(type){
    var that=this;
    var maction = 'rebate';
    var msign = utilMd5.hexMD5(maction + app.globalData.pattern + randomstr + time+type);
    wx.request({
      method: 'POST',
      url: app.host + maction,
      dataType: 'json',
      header: { token: wx.getStorageSync('token') },
      //header: { token: '66bacc4d1dc28d08fc288de33d7bdf1ee3f741f558902bd0b8a2561a3d88236' },
      data: { type: type, pattern: app.globalData.pattern, from: app.from, time: time, action: maction, sign: msign },
      success: function (data) {
        if (data.data.code == 9201) {
          console.log(1);
           util.checklogin(encodeURIComponent('/' + that.route));
           return;
       
        }
        if (data.data.code == '1') {
          if(type=='plan'){
              var hidden=true;
            if (data.data.bills.length==0) hidden=false
            that.setData({
              plan: 'rebateActive',
              coupon:'',
              coupons:[],
              bills: data.data.bills,
              billhidden: hidden,
              couponhidden: true
            })
          }
          if (type =='coupon'){
            console.log(data.data.coupon)
            var hidden = true;
            if (data.data.coupon.length == 0) hidden = false
            that.setData({
              plan: '',
              bills:[],
              coupon: 'rebateActive',
              coupons: data.data.coupon,
              billhidden: true,
              couponhidden: hidden
            
            })
          }
          // console.log(data.data.data[0])
        }
      }
    })
 
  },
  exitpattern: function () {
    util.exitpattern();
  }
  ,
  /**
   * 去参加分享计划
   */
  gotoproject:function(){
    wx.navigateTo({
      url: '/pages/project/project?project=' +'MZJBQKj3NmPolKOv8qbj',
    })
  }
})