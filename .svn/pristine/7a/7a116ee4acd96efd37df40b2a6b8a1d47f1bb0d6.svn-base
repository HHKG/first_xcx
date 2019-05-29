// pages/form/form.js
var app = getApp();
// var util = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    phone: "",
    hidden: "true",
    toast_hidden: "true",
    toast1_hidden: "true"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  /**
   * 关闭弹窗
   */
  closePop: function() {
    this.setData({
      hidden: true
    })
  },
  /**
   * 获取用户收货信息
   */
  getNews: function() {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log("vres.authSetting['scope.address']：", res.authSetting['scope.address'])
        if (res.authSetting['scope.address']) {
          console.log("111")
          wx.chooseAddress({
            success(res) {
              that.setData({
                name: res.userName,
                phone: res.telNumber
              })
            }
          })
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
        } else {
          if (res.authSetting['scope.address'] == false) {
            console.log("222")
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
              }
            })
          } else {
            console.log("eee")
            wx.chooseAddress({
              success(res) {
                that.setData({
                  name: res.userName,
                  phone: res.telNumber
                })
              }
            })
          }
        }
      }
    })
  },
  /**
   * 提交数据
   */
  postData: function() {

  },
  /**
   * 提交页面数据
   */
  submit: function(event) {
    // console.log(this.data);
    // 判断姓名和手机号是否为空
    if (this.data.name && this.data.phone) {
      // 用正则表达式判断手机号
      var reg = /^1[3456789]\d{9}$/;
      if (!reg.exec(this.data.phone)) {
        var that = this;
        this.setData({
          toast1_hidden: false
        })
        setTimeout(function() {
          that.setData({
            toast1_hidden: true
          })
        }, 2000)
        return;
      } else {
        wx.request({
          //项目的真正接口，通过字符串拼接方式实现
          url: "https://wt.wanmey.com/record",
          header: {
            "content-type": "application/json;charset=UTF-8"
          },
          data: {
            "name": this.data.name,
            "mobile": this.data.phone
          },
          method: 'POST',
          success: function(res) {
            //参数值为res.data,直接将返回的数据传入
            console.log(res.data);
          },
          fail: function() {
            console.log("请求有误");
          },
        })
        this.setData({
          hidden: false
        })
      }
    } else {
      var that = this;
      this.setData({
        toast_hidden: false
      })
      setTimeout(function() {
        that.setData({
          toast_hidden: true
        })
      }, 2000)
    }
  },

  /**
   * 获取输入姓名
   */
  inputName: function(event) {
    this.setData({
      name: event.detail.value
    })
  },
  /**
   * 获取输入手机号
   */
  inputTelnumber: function(event) {
    this.setData({
      phone: event.detail.value
    })
  }
})