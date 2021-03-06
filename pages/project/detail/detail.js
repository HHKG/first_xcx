// pages/index/project/detail/detail.js.js
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
     plans:[],
     pattern: 0,
     back:'',
    project:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    var that = this;
  //  console.log(wx.getStorageSync('incode'));
    // console.log(that);
    var newmember=wx.getStorageSync('newmember');
    var token = wx.getStorageSync('token');
    var code = options.project;
    var url = '/' + that.route + '?project=' + code
    var back = encodeURIComponent(url);
    that.setData({
      pattern: app.globalData.pattern,
      back: back,
      project: code

    })
    // code = 'MZJBQKj3NmPolKOv8qbj';
    // console.log(token);
    if (!token){
      util.checklogin(back);
    }else{
      // console.log(code); return;

      if (code) {
        var action = 'plan';
        var sign = utilMd5.hexMD5(action + code + app.globalData.pattern + randomstr + time);
        var data = { pattern: app.globalData.pattern, from: app.from, code: code, time: time, action: action, sign: sign };
        wx.request({
          url: app.host + action,
          method: 'get',
          data: data,
          header: { token: token },
          dataType: 'json',
          success(data) {
            console.log(data)
            if (data.data.code == 9201) {
              util.checklogin(encodeURIComponent('/' + that.route));
            }
            if (data.data.code == 1) {
              that.setData({
                plans: data.data.data
              })
            }
           
          }
        })
        var saction = 'shareinfo';
        var id = 'plan';
        var ssign = utilMd5.hexMD5(saction + randomstr + id + time);
        wx.request({
          url: app.host + saction,
          method: 'get',
          dataType: 'json',
          data: { from: app.from, time: time, action: saction, share: id, sign: ssign },
          success: function (res) {
            if (res.data.code == 1) {
              // console.log(res);
              that.setData({
                sharename: res.data.data.E_Name,
                shareimg: res.data.data.E_Img,
                shareurl: res.data.data.E_Url,
              })
            }
          }
        })
      } else {
        wx.switchTab({
          url: '../../index/index',
        })

      }

    }
  },
  /**
   * 进入算一算
   */
  toCalculate: function (e) {
    //  console.log(e);return;
    var code = e.currentTarget.dataset.code;
    getApp().globalData.p_m = e.currentTarget.dataset.money;
    getApp().globalData.p_y = e.currentTarget.dataset.year;
    getApp().globalData.p_r_m = e.currentTarget.dataset.rebatemoney;
    getApp().globalData.p_r_c = e.currentTarget.dataset.rebatecoupom;
    getApp().globalData.p_name = e.currentTarget.dataset.name;
    getApp().globalData.p_title = e.currentTarget.dataset.title;
    getApp().globalData.project = e.currentTarget.dataset.project;
    getApp().globalData.plan = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '/pages/project/calculate/calculate?p_m=' + this.data.E_Money + '&p_y=' + e.currentTarget.dataset.year + '&p_r_c=' + this.data.E_Coupon + '&p_r_m=' + this.data.E_Scale + '&p_name=' + this.data.E_Abbreviation + '&p_title=' + this.data.E_Title + '&plan=' + e.currentTarget.dataset.id + '&project=' + e.currentTarget.dataset.project,
    })
  }
  ,
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
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync('token')) {
      getCurrentPages()[getCurrentPages().length - 1].onLoad({project:this.data.project})
      var raction = 'record';
      var road = 'detail'
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
    return {
      title: this.data.sharename,
      path: this.data.shareurl + '&incode=' + wx.getStorageSync('myincode'),
      imageUrl: this.data.shareimg,

    };
  },
  /*
  *跳转下订单页面
   */
  setorder:function(e){
      var code=e.target.dataset.code
      wx.navigateTo({
        url: 'pay/pay?plan='+code,
      })
  },
  exitpattern: function () {
    util.exitpattern(this.data.back);
  }
})