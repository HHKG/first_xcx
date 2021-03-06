// pages/lachine/index.js
var app = getApp();
//console.log(app)
var utilMd5 = require('../../utils/md5.js');
var util = require('../../utils/util.js');
var time = Date.parse(new Date()) / 1000;
var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phonenum: '400-990-8830',
    version: app.globalData.version
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  ,
   /**
   * 打电话
   */
  callQian: function () {
    var that = this;
    //显示“呼叫”、“添加联系人”弹窗
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function (res) {
        if (res.tapIndex == 0) { //直接呼叫
          wx.makePhoneCall({
            phoneNumber: that.data.phonenum,
          })
        } else if (res.tapIndex == 1) { //添加联系人
          wx.addPhoneContact({
            firstName: '虔心荟',
            mobilePhoneNumber: that.data.phonenum,
            success: function (res_addphone) {
              console.log("电话添加联系人返回：", res_addphone)
            }
          })
        }
      }
    })
  },
  /**
   * 立即注册
   */
  gotoRegister:function(){
    wx.navigateTo({
      url: '/pages/login/register/index'
    })
  }
})