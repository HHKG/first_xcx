// pages/member/cash/authentication/authentication.js
// pages/member/index.js
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
    disabled: true,
    truename: '',
    card: '',
    back: '',
    token: '',

  },
/**
 * 输入框的值
 */
  nameinput: function(e) {
    var that=this;
    if (e.detail.value !== '' && that.data.card){
    that.setData({
      truename: e.detail.value,
       disabled:false
    })
  }else{
    that.setData({
      truename: e.detail.value,
      disabled: true
    })
  }
   
  },
  cardinput: function(e) {
    var that = this;
    if (that.data.truename !== '' && e.detail.value) {
      that.setData({
        card: e.detail.value,
        disabled: false
      })
    } else {
      that.setData({
        card: e.detail.value,
        disabled: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    var that = this;

    var token = wx.getStorageSync('token');
    that.setData({
      pattern: app.globalData.pattern,

      token: token
    })

    if (token == undefined || token == '') {
      var back = encodeURIComponent('/' + that.route);
      token = util.checklogin(back);
      that.setData({
        token: token
      })
      return;
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    getCurrentPages()[getCurrentPages().length - 1].onLoad()
    if (wx.getStorageSync('token')) {
      var raction = 'record';
      var road = 'authentication'
      var rsign = utilMd5.hexMD5(raction + randomstr + road + time);
      wx.request({
        url: app.host + raction,
        method: 'post',
        dataType: 'json',
        header: {
          token: wx.getStorageSync('token')
        },
        data: {
          from: app.from,
          time: time,
          road: road,
          action: raction,
          sign: rsign
        },
        success: function(res) {}
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  Land: function() {
    var name = this.data.truename;
    var card = this.data.card;
    var action = 'realName';
    var sign = utilMd5.hexMD5(action + card + name + randomstr + time);
    var data = {
      cardnumber: card,
      from: app.from,
      time: time,
      name: name,
      action: action,
      sign: sign
    };
    wx.request({
      url: app.host + action,
      method: 'POST',
      data: data,
      header: {
        token: wx.getStorageSync('token')
      },
      dataType: 'json',
      success(data) {
        if (data.data.code == 1) {
          wx.showToast({
            title: '实名认证成功',
          })
          // var member = wx.getStorageSync('member');
          // member.bank = 1;
          // wx.setStorageSync('member', member)
          wx.reLaunch({
            url: "/pages/member/index",
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: data.data.msg,
          })
        }
        // console.log(data.data);


      }
    })
  },
  exitpattern: function() {
    util.exitpattern();
  }
})