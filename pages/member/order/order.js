// pages/member/order/order.js
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
    hidden:true,
    hiddenNone:true,
    orders:[],
    price:0.00,
    token: '',
    back: '',
    checkpaytypes:[],
    sn:'',
    paytype:4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this;
    var token = wx.getStorageSync('token');
   
    that.setData({
      pattern: app.globalData.pattern,
      token: token,
    })
    if (token == undefined || token == '') {
      token = util.checklogin(back);
      that.setData({
        token: token,
      })
      return;
    }
    var action = 'myorders';
    var sign = utilMd5.hexMD5(action + app.globalData.pattern + randomstr + time);
    var data = { pattern: app.globalData.pattern, from: app.from, time: time, action: action, sign: sign };
    wx.request({
      url: app.host + action,
      method: 'POST',
      data: data,
      header: { token: token },
      dataType: 'json',
      success(data) {
        if (data.data.code == 9201) {
          //console.log(1);
           util.checklogin(encodeURIComponent('/' + that.route));
        }
        if (data.data.code == 1) {
          var paytype = [];
          var type = '4';
          if (that.data.pattern == 0) {
            paytype = [
              { name: '微信支付', img: 'http://api.iqianclub.com/upload/program/images/wechat_icon.png', value: '4', checked: 'true' },
              { name: "消费金(" + data.data.wallet.E_Consumption + ")", img: 'http://api.iqianclub.com/upload/program/images/xiaofeijin_icon.png', value: '1' },
              { name: "余额(" + data.data.wallet.E_Balance + ")", img: 'http://api.iqianclub.com/upload/program/images/yuer_icon.png', value: '2', },
            ]
          } else {
            type = '1';
            paytype = [
              { name: "消费金(" + data.data.wallet.E_Consumption + ")", img: 'http://api.iqianclub.com/upload/program/images/xiaofeijin_icon.png', value: '1', checked: 'true' },
              { name: "余额(" + data.data.wallet.E_Balance + ")", img: 'http://api.iqianclub.com/upload/program/images/yuer_icon.png', value: '2', },
            ]
          }
         // console.log(data.data.orders.length);
          if (data.data.orders.length==0){
            that.setData({
              hiddenNone: false
            })
          }else{
            console.log(data.data.orders);
            that.setData({
              orders: data.data.orders,
              checkpaytypes: paytype,
              paytype: type,
              E_Balance: data.data.wallet.E_Balance,
              E_Consumption: data.data.wallet.E_Consumption,
              hiddenNone: true
            })
          }
         
        }

      }
    })
  },

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
          });

        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //getCurrentPages()[getCurrentPages().length - 1].onLoad()
    if (wx.getStorageSync('token')) {
      var raction = 'record';
      var road = 'order'
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

  }
  ,
  /**
   * 关闭/打开弹窗
   */
  closePay:function(e){
    console.log(e);
    this.setData({
      hidden:!this.data.hidden,
      price: e.target.dataset.price,
      sn: e.target.dataset.sn
    })
  },
  checkboxChange: function (e) {
   
    var that = this;
    var paytypes = that.data.checkpaytypes;
    var type = e.detail.value;
    console.log(e);
    if (type == 2) {
      if (that.data.E_Balance == undefined || that.data.price > that.data.E_Balance) {
        wx.showToast({
          icon:'none',
          title: "余额不足"
        })
        that.setData({
          checkpaytypes: paytypes
        })
        return;
      }
    }
    if (type == 1) {

      if (that.data.E_Consumption == undefined || (that.data.price > that.data.E_Consumption)) {
        wx.showToast({
          icon: 'none',
          title: "消费金不足"
        })
        that.setData({
          checkpaytypes: paytypes
        })
        return;
      }
    }
    that.setData({
      paytype: type,
    
    })
  },
  payoder: function () {
    var that = this;
    var sn = that.data.sn;
    var prices = that.data.price;
    var paytype = that.data.paytype;
    console.log(sn)
    if (paytype != 4){
      wx.showModal({
      title: '提示',
        content: '确认支付',
          success(res){
        if (res.confirm) {
          var aaction = 'confirmpay';
          var asign = utilMd5.hexMD5(aaction + app.globalData.pattern + paytype + randomstr + sn + time);
          console.log(asign);
          wx.request({
            url: app.host + aaction,
            type: 'POST',
            dataType: 'json',
            header: { token: that.data.token },
            data: { pattern: app.globalData.pattern, from: app.from, time: time, action: aaction, paytype: paytype, sn: sn, sign: asign },
            success: function (data) {
              console.log(data);
              if (data.data.code == 1) {
                wx.showToast({
                  title: data.data.msg
                })
                wx.redirectTo({
                  url: '/pages/project/detail/pay/success/success?sn=' + sn
                })
              } else {
                wx.showToast({
                  icon:'none',
                  title: data.data.msg
                })
              }
            }
          })
        }
      }
    })
   }else{
      var gaction = 'getwxinfo';
      var again = '1';
      var wsign = utilMd5.hexMD5(gaction + again + randomstr + sn + time);
      wx.request({
        url: app.host + gaction,
        type: 'POST',
        dataType: 'json',
        header: { token: that.data.token },
        data: { from: app.from, time: time, again: again, sn: sn, action: gaction, sign: wsign },
        success: function (data) {
          console.log(data);
          if (data.data.code == 1) {
            var info = data.data.info;
            info.success = function (res) {
              //  console.log(res) 
              if (res.errMsg == 'requestPayment:ok') {
                var saction = 'getpaystate';
                var ssign = utilMd5.hexMD5(saction + randomstr + app.globalData.pattern + data.data.sn + time);
                var datas = { pattern: app.globalData.pattern, from: app.from, time: time, action: saction, sn: sn, sign: ssign };
                wx.request({
                  url: app.host + saction,
                  type: 'POST',
                  dataType: 'json',
                  header: { token: that.data.token },
                  data: datas,
                  success: function (datas) {
                    if (datas.code = 1) {
                      wx.showToast({
                        title: data.data.msg
                      })
                      wx.redirectTo({
                        url: '/pages/project/detail/pay/success/success?sn=' + sn
                      })
                    } else {
                      wx.showToast({
                        icon: 'none',
                        title: data.data.msg
                      })
                    }
                  }
                })
              }
            };
            info.fail = function (res) { console.log(res) };
            console.log(info);
            wx.requestPayment(info)
          } else {
            wx.showToast({
              icon:'none',
              title: data.data.msg
            })
          }
        }
      })
   }
  },
  exitpattern: function () {
    util.exitpattern();
  },
  gotoproject:function(){
    wx.redirectTo({
      url: '/pages/project/project?project=' + 'MZJBQKj3NmPolKOv8qbj',
    })
  }
  ,
  /**
   * 去计划详情页
   */
  gotoproject:function(){
    wx.navigateTo({
      url: '/pages/project/project?project=' +'MZJBQKj3NmPolKOv8qbj',
    })
  }
})