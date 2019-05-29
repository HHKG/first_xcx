// pages/login/index/index.js
var app = getApp();
var utilMd5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    mobilecode: '',
    back: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var mobile = options.mobile;
    var mobilecode = options.mobilecode;
    var back = options.back;
 
    if (mobile == undefined || mobilecode == undefined) {
      wx.showToast({
        icon:'none',
        title: '非法操作',
      })
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
    that.setData({
      mobile: mobile,
      mobilecode: mobilecode,
      back: decodeURIComponent(back)
    })

  },
  bindGetUserInfo(e) {
    var that = this;
    var mobilecode = that.data.mobilecode;
    var mobile = that.data.mobile;
    var action = 'dologin';
    var type = 4;
    var time = Date.parse(new Date()) / 1000;
    var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.login({
        success(lres) {
          if (lres.code) {
            var lsign = utilMd5.hexMD5(action + mobilecode + e.detail.encryptedData + e.detail.iv + mobile+ randomstr + time + type + lres.code )
          console.log(lsign);
            wx.request({
              url: app.host + action,
              method: 'post',
              dataType: 'json',
              data: {mobile:mobile, type: type, from: app.from, action: action, time: time, code: mobilecode, encryptedData: e.detail.encryptedData, iv: e.detail.iv, sign: lsign, wxcode: lres.code },
              success(result) {
                if (result.data.code == 1) {
                  wx.setStorageSync('token', result.data.token);
                  wx.setStorageSync('member', result.data.info);
                  if(that.data.back!=undefined){
                    console.log(that.data.back);
                    wx.reLaunch({
                      url: that.data.back,
                    })
                  }else{
                    wx.redirectTo({
                      url: '/pages/member/index',
                    })
                  }
                }
              }
            })
          }
        }
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
  getPhoneNum: function (e) {
    this.setData({
      phoneNum: e.detail.value
    });
  },
  /**
   * 获取验证码
   */
  getCode: function (e) {
    var phone = e.currentTarget.dataset.pnonenum;
    var reg = /^1[3456789]\d{9}$/;
    var wait = 60;
    var that = this;
    if (!reg.exec(phone)) {
      console.log('手机格式不对');
    } else {
      that.setData({
        get_disabled: !that.data.get_disabled
      })
      for (var i = 0; i < 60; i++) {
        (function (i) {
          setTimeout(function () {
            wait--;
            that.setData({
              time: "" + wait + "S"
            })
            if (wait == '0') {
              that.setData({
                get_disabled: !that.data.get_disabled,
                time: "重新发送"
              })
            }
          }, i * 1000);
        })(i);
      }
    }
  },
  /**
   * 输入验证码
   */
  inputCode: function (e) {
    this.setData({
      codeNum: e.detail.value
    });
    var phoneNum = e.currentTarget.dataset.phonevalue;
    var codeNum = e.detail.value;
    var that = this;
    if (phoneNum !== '' && codeNum !== '') {
      that.setData({
        login_disabled: false
      })
    } else {
      that.setData({
        login_disabled: true
      })
    }
  }
  ,
  /**
   * 登录
   */
  login: function () {
    console.log('正在登录...');
  },
  /**
   * 嵌套H5页面
   */
  jump: function () {
    wx.navigateTo({
      url: 'pages/outer/outer',
    })
  }
})