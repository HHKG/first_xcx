// pages/member/update/paySuccess/paySuccess.js
var app = getApp();
var utilMd5 = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js');
var time = Date.parse(new Date()) / 1000;

var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pattern: app.globalData.pattern,
    money:'',
    type: '',
    grade: '',
    lastmoney: '',
    sn:''
   
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
    }
    var sn=options.sn;
    if(sn){
      that.setData({
        sn: sn,
      })
      var action = 'rechargeresult';
      var sign = utilMd5.hexMD5(action + randomstr + sn+ time);
      var data = { sn:sn, from: app.from, time: time, action: action, sign: sign };
      wx.request({
        url: app.host + action,
        method: 'POST',
        data: data,
        header: { token: token},
        dataType: 'json',
        success(data) {

          console.log(data.data);
          if (data.data.code == 1) {
            that.setData({
              money: data.data.data.E_PayPrice,
              grade: data.data.data.E_Name,
              lastmoney: data.data.data.E_Consumption,
            })
          }else{
            wx.showToast({
              icon:'none',
              title: data.data.msg,
            })
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }

        }
      })
    }else{
      wx.reLaunch({
        url: '/pages/index/index',
      })
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
    getCurrentPages()[getCurrentPages().length - 1].onLoad({sn:this.data.sn})
    if (wx.getStorageSync('token')) {
      var raction = 'record';
      var road = 'updatesuccess'
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
  gotoorder:function(){
      wx.navigateTo({
        url: '../../order/order',
      })
  },
    gotomember: function () {
      wx.reLaunch({
        url: '/pages/member/index',
      })
  },
  exitpattern: function () {
    util.exitpattern();
  }
})