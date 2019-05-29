// pages/member/cash/authentication/withdraw/withdraw.js
var app = getApp();
var utilMd5 = require('../../../../../utils/md5.js');
var util = require('../../../../../utils/util.js');
var time = Date.parse(new Date()) / 1000;
var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pattern: app.globalData.pattern,
    bankname: '',
    bankcard: '',
    lessmoney: app.lesswithdraw,
    money: '',
    username: '',
    getmoney: 0,
    token: '',
    back: '',
    disabled: true,
    value:''
  },
  cashinput: function(e) {
    var val = e.detail.value;
    var limit = val.toString().replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^0+(?=\d)/, '');
   // console.log(limit);
    this.setData({
      value: limit,
      // disable:!this.data.disable
    })
      if(e.detail.value !== '') {
      this.setData({
        getmoney: e.detail.value,
        disabled: false
      })
    } else {
      this.setData({
        getmoney: e.detail.value,
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
    var url = '/' + that.route;
    var back = encodeURIComponent(url);
    var token = wx.getStorageSync('token');
    that.setData({
      pattern: app.globalData.pattern,
      back: back,
      token: token
    })

    if (token == undefined || token == '') {
      token = util.checklogin(back);
      that.setData({
        token: token
      })
      return;
    }
    var action = 'getwithdrawal';
    var sign = utilMd5.hexMD5(action + app.globalData.pattern + randomstr + time);
    var data = {
      pattern: app.globalData.pattern,
      from: app.from,
      time: time,
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
          that.setData({
            bankname: data.data.data.E_BankName,
            bankcard: data.data.data.E_Card,
            money: data.data.data.E_Balance,
            username: data.data.data.E_UserName
          })
        } else {
          wx.showToast({
            icon:'none',
            title: data.data.msg,
          })
        }
      }
    })
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
      var road = 'withdraw'
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
    var that = this;
    var hasmoney = that.data.money;
    var bank = that.data.bankname;
    var cardno = that.data.bankcard;
    var money = that.data.getmoney;
    var user = that.data.username;
    var lessmoney = that.data.lessmoney
    if (lessmoney > parseFloat(money)) {
      //   mui.toast('提现不能少于50元'); return;
      wx.showToast({
        icon:'none',
        title: '提现不能少于' + lessmoney + '元',
      });
      return;
    }
    if (parseFloat(money) > hasmoney) {
      wx.showToast({
        icon:'none',
        title: '余额不足',
      });
      return;
      // mui.toast('余额不足'); return;
    }
    var pattern = that.data.pattern;
    if(pattern==1){
      wx.showToast({
        title: '提现成功',
        duration: 2000,
      });
      var pages = getCurrentPages(); // 当前页面
      var beforePage = pages[pages.length - 2]; // 前一个页面
      setTimeout(function(){
        wx.navigateBack({
          success: function () {
            beforePage.onLoad(); // 执行前一个页面的onLoad方法
          }
        })
      },2000)
    }
    else{
    var action = 'insertwithdrawal';
    var sign = utilMd5.hexMD5(action + bank + cardno + money + pattern + randomstr + time + user);
    var data = {
      money: money,
      cardno: cardno,
      bank: bank,
      user: user,
      pattern: pattern,
      from: app.from,
      time: time,
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
            title: '提交成功',
          })
          var member = wx.getStorageSync('member');
          member.Balance = member.Balance - money;
          wx.setStorageSync('member', member)
          var pages = getCurrentPages(); // 当前页面
          var beforePage = pages[pages.length - 2]; // 前一个页面
          setTimeout(function () {
            wx.navigateBack({
              success: function () {
                beforePage.onLoad(); // 执行前一个页面的onLoad方法
              }
            })
          }, 2000)
          // wx.redirectTo({
          //   url: '/pages/member/cash/cash',
          // })
        } else {
          wx.showToast({
            icon:'none',
            title: data.data.msg,
          })
        }
      }
    })
  }
  },
  exitpattern: function() {
    util.exitpattern(this.data.back);
  }
})