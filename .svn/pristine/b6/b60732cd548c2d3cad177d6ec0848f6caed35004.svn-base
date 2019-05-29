// pages/member/certificate/certificate.js
var app = getApp();
var time = Date.parse(new Date()) / 1000;
var utilMd5 = require('../../../utils/md5.js');
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     height:0,
     pattern: app.globalData.pattern,
     zhengshu:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this;
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
      return
    } 
    that.setData({
      pattern: app.globalData.pattern,
      zhengshu: app.host + '/getmembercertificate?token=' + token
    })
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
    this.getImage();
   var system=wx.getSystemInfoSync();
    console.log(system);
    var pageH = system.windowHeight,
        pageW=system.windowWidth;
        var height=750/pageW*pageH;
       this.setData({
         height:height
       })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getCurrentPages()[getCurrentPages().length - 1].onLoad()
    if (wx.getStorageSync('token')) {
      var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
      var raction = 'record';
      var road = 'certificate'
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
  /**
   * 点击放大图片
   */
  lookImage:function(){
   wx.previewImage({
     urls: [this.data.zhengshu],
   })
  },
  exitpattern: function () {
    util.exitpattern();
  },
  /**
   * 获取图片信息
   */
 getImage:function(){
   wx.getImageInfo({
     src: this.data.zhengshu,
     success:function(res){
      console.log(res);
     }
   })
 }
})