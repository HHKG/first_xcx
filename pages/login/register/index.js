// pages/login/index/index.js
var app = getApp();
//console.log(app)
var utilMd5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    mobilecode: '',
    back: '',
    time:'获取验证码',
    height:0,
    login_disabled:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      // console.log();
    var back=options.back;
    console.log(back)
      var that=this;
      that.setData({
        back:options.back
      })
 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var system=wx.getSystemInfoSync();
    console.log(system);
    var wxH = system.windowHeight;
    var wxW=system.windowWidth;
    this.setData({
      height:750/wxW*wxH
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  getPhoneNum: function(e) {
    // 把输入手机号码框的值存储起来
    this.setData({
      mobile: e.detail.value
    });
  },
  /**
   * 获取验证码
   */
  getCode: function(e) {
    var that = this;
    var phone = that.data.mobile;
    var reg = /^1[3456789]\d{9}$/;
    var wait = 60;
    if (that.data.mobile==''){
      wx.showToast({
        icon: 'none',
        title: '请输入手机号',
      })
      return;
    }
    if (!reg.exec(phone)) {
      wx.showToast({
        icon:'none',
        title: '手机格式不对',
      })
    } else {
      var time = Date.parse(new Date()) / 1000;
      var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
      var saction ='sendcode';
      var type=1;
      var ssign = utilMd5.hexMD5(saction + phone + randomstr + time+type)
      console.log(ssign);
      wx.request({
        url: app.host+saction,
        method:'GET',
        dataType:'json',
        data: { from: app.from, type: type, number: phone, time: time, action: saction, sign: ssign },
        success:function(res){
          console.log(res);
          if(res.data.code==1){
            wx.showToast({
              title: res.data.msg,
            })
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
          }else{
            wx.showToast({
              icon:'none',
              title: res.data.msg,
            })
          }
        }
      })
    
    }
  },
  /**
   * 输入验证码
   */
  inputCode:function(e){
    this.setData({
      mobilecode: e.detail.value
    });
    var phoneNum =this.data.mobile;
    var codeNum = e.detail.value; 
    console.log(phoneNum);
    var that=this;
    if (phoneNum!=='' && codeNum!==''){
       that.setData({
         login_disabled: false
       })
    }else{
      that.setData({
        login_disabled: true
      })
    }
  }
  ,
  /**
   * 登录
   */
  gotoregister: function() {
     console.log('正在登录...');
    var that=this;
    var daction = 'inspectcode';
    var code = that.data.mobilecode;
    var mobiles = that.data.mobile;
    var time = Date.parse(new Date()) / 1000;
    var source = 'applet|weixin|join_marketing';
    var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
    var dsign = utilMd5.hexMD5(daction + code + mobiles + randomstr + source + time );
    console.log(dsign);
    wx.request({
      url: app.host+daction,
      method:'GET',
      dataType:'json',
      data: {
        from: app.from,
        code: code,
        mobile: mobiles,
        time: time,
        action: daction,
        source: source,
        sign: dsign},
      success:function(res){
        console.log(res)
          if(res.data.code==1){
            wx.navigateTo({
              url: '../data/data?mobile=' + mobiles + '&mobilecode=' + code + '&back=' + that.data.back + '&source=' + source,
            })
          }else{
            wx.showToast({
              icon:'none',
              title: '短信验证码不正确'
            })
          }
      }
    })
  
  },

})