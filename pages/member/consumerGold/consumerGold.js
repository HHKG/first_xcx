// pages/member/consumerGold/consumerGold.js
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
    hidden: true,
    balance:'',
    token: '',
    back: ''
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
    var maction = 'getbalance';
    var msign = utilMd5.hexMD5(maction + app.globalData.pattern + randomstr + time);
    wx.request({
      method: 'POST',
      url: app.host + maction,
      dataType: 'json',
      header: { token: token },
      data: { pattern: app.globalData.pattern, from: app.from, time: time, action: maction, sign: msign },
      success: function (data) {
        if (data.data.code == 9201) {
          util.checklogin(encodeURIComponent('/' + that.route));
          return;
        }
        if (data.data.code == 1) {
          // console.log(data.data.data[0])
          if (data.data.balance.length>0){
           that.setData({
             pattern: wx.getStorageSync('pattern'),
             balance: data.data.balance,
             hidden: true
           })
          } else {
            that.setData({
              hidden: false
            })
          }
        }
      }
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getCurrentPages()[getCurrentPages().length - 1].onLoad()
    if (wx.getStorageSync('token')) {
      var raction = 'record';
      var road = 'consumergold'
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
  exitpattern: function () {
    util.exitpattern();
  }
})