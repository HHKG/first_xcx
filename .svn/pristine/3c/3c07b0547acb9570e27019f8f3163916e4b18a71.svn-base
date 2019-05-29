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
    plan:[],
    token: '',
    back: '',
    hidden:true

  },
  /**
 * 跳转计划详情
 */
  gotoproject: function () {
    console.log('ok');
    wx.navigateTo({
      url: '/pages/project/project?project=MZJBQKj3NmPolKOv8qbj',
    })
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
      // var back = encodeURIComponent('/' + that.route);
      token = util.checklogin(back);
      that.setData({
        token: token,
      })
      return;
    }
    var maction = 'myproject';
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
    
        }
        if (data.data.code == '1') {
          // console.log(data.data.data[0])
          var hidden = true;
          if (data.data.data.length == 0) {
            var hidden = false;
          }
          that.setData({
            plan: data.data.data,
            hidden: hidden
          })

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
      var road = 'myplan'
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
  gotorate:function(){
      wx.navigateTo({
        url: '../rebate/rebate?leixing=plan',
      })
  },
  exitpattern: function () {
    util.exitpattern();
  }
})