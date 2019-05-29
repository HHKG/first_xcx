// pages/member/cash/cash.js
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
    money:'',
    bank: '',
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
    var back = encodeURIComponent('/' + that.route);
  
    that.setData({
      pattern: app.globalData.pattern,
      token: token,
      back: back
    })
    // console.log(wx.getStorageSync('member'))
    // if (token == undefined || token == '') {
    //   token = util.checklogin(back);
    //   that.setData({
    //     token: token
    //   })
    //   //return;
    // }
    var member = wx.getStorageSync('member')
    var money = member.Balance;
    var bank = member.bank;
 
   that.setData({
     money: money,
     bank: bank,
   })
 //  console.log(that.data)
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
    getCurrentPages()[getCurrentPages().length - 1].onLoad()
    if (wx.getStorageSync('token')) {
      var raction = 'record';
      var road = 'cash'
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
  gotowithdraw:function(){
   // console.log(this.data.bank)
    if (this.data.bank == 0 || this.data.bank ==undefined){
      wx.showModal({
        title: '提示',
        content: '请先绑定银行卡',
        success(res){
            if(res.confirm){
              wx.navigateTo({
                url: '/pages/member/cash/binding/binding',
              })
            }
        }
      })
    }else{
      wx.navigateTo({
        url: 'authentication/withdraw/withdraw',
      })
    }
  },
  gotobudget:function(){
    wx.navigateTo({
      url: '../consumerGold/consumerGold',
    })
  }
  ,
  /**
   * 跳转到绑定银行卡页面
   */
  gotobinding:function(){
    wx.navigateTo({
      url: '/pages/member/cash/binding/binding',
    })
  },
  exitpattern: function () {
    util.exitpattern();
  }
})