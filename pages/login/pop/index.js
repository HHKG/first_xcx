// pages/login/pop/index.js
var app = getApp();
//console.log(app)
var utilMd5 = require('../../../utils/md5.js');
var WxParse = require('../../../wxParse/wxParse.js');
var time = Date.parse(new Date()) / 1000;
var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:'',
    title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var article ='register';
    var action ='getarticle';
    var dsign = utilMd5.hexMD5(action + article  + randomstr + time);
    //console.log(dsign);
    wx.request({
      url: app.host + action,
      method: 'GET',
      dataType: 'json',
      data: {
        from: app.from,
        article: article,
        time: time,
        action: action,
        sign: dsign
      },
      success: function (res) {
        console.log(res.data)
        console.log(res.data.msg)
        console.log(res.data.article)
        console.log(res.data.article.post_content)
       if(res.data.code==1){
         var info = res.data.article.post_content
         WxParse.wxParse('info', 'html', info, that, 5);
         that.setData({
           title: res.data.article.post_title
         })
       }
      }
    })
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

  }
})