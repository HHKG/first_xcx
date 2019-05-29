// pages/member/myInvite/myInvite.js
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
    sharename: '',
    shareimg: '',
    shareurl: '',
    pattern: app.globalData.pattern,
    hidden: true,
    count: 0,
    invites: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    var action = 'myinvitemember';
    var that = this;
    var token = wx.getStorageSync('token');

    that.setData({
      token: token,
      pattern: app.globalData.pattern,
    })
    if (token == undefined || token == '') {
      token = util.checklogin(back);
      that.setData({
        token: token,
      })
      return
    }
    var sign = utilMd5.hexMD5(action + app.globalData.pattern + randomstr + time);

    wx.request({
      url: app.host + action,
      method: 'POST',
      dataType: 'json',
      header: {
        token: token
      },
      data: {
        pattern: app.globalData.pattern,
        from: app.from,
        time: time,
        action: action,
        sign: sign
      },
      success: function(res) {
        //console.log(res);
        if (res.data.code == 1) {
          if (res.data.invites.length == 0) {
            that.setData({
              hidden: false
            })
          } else {
            that.setData({
              invites: res.data.invites,
              count: res.data.count,
              hidden: true
            })
          }
        }
      }
    })
    var saction = 'shareinfo';
    var id = '1';
    var ssign = utilMd5.hexMD5(saction + randomstr + id + time);
    wx.request({
      url: app.host + saction,
      method: 'get',
      dataType: 'json',
      data: {
        from: app.from,
        time: time,
        action: saction,
        share: id,
        sign: ssign
      },
      success: function(res) {
        if (res.data.code == 1) {
          //  console.log(res);
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
  onReady: function() {
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
  onShow: function() {
    getCurrentPages()[getCurrentPages().length - 1].onLoad()
    if (wx.getStorageSync('token')) {
      var raction = 'record';
      var road = 'myinvite'
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
    return {
      title: this.data.sharename,
      path: this.data.shareurl + '&incode=' + wx.getStorageSync('myincode'),
      imageUrl: this.data.shareimg,

    };
  },
  exitpattern: function() {
    util.exitpattern();
  },
  gotoinvite: function() {
    wx.navigateTo({
      url: '../imitate/imitate',
    })
  }

})