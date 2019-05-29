// pages/yyy/yyy.js
var app = getApp();
//console.log(app)
var utilMd5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:"",
    width:"",
    mobile: '',
    code: '',
    back: '',
    time: '获取验证码',
    height: 0,
    login_disabled: true,
    question1: '您近一年有过几次度假？',
    question2: '您近一年度假费用支出多少？',
    question3: '您是否有加入过其它的度假俱乐部？',
    answer1: '2次以内',
    answer2: '10000以下',
    answer3: '无',
    disabled: true,
    wxcode: ''
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        var height = res.windowHeight;
        var width = res.windowWidth;
        that.setData({
          height:height,
          width:width
        })
      },
    })
  },
  /**
 * 跳转到填写信息页面
 */
  intoFrom: function (e) {
    console.log(e);
    var marketing=e.currentTarget.dataset.marketing;
    wx.navigateTo({
      url: '/pages/login/index?marketing=' + marketing,
    })
  },

  onLoad: function (options) {
    console.log(wx.getStorageSync('incode'));
    // console.log();
    var back = options.back;
    console.log(back)
    var that = this;
    that.setData({
      back: options.back
    })
    wx.login({
      success(lres) {
        console.log(lres);
        that.setData({
          wxcode: lres.code
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function () {
  //   var system = wx.getSystemInfoSync();
  //   console.log(system);
  //   var wxH = system.windowHeight;
  //   var wxW = system.windowWidth;
  //   this.setData({
  //     height: 750 / wxW * wxH
  //   })
  // },

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
  /**
   * 获取用户手机号码
   */
  getPhoneNumber(e) {
    var that = this;
    var back = that.data.back;
    console.log(e);
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      console.log(e.detail);

      var code = that.data.wxcode;
      // console.log(code)
      if (code) {
        var time = Date.parse(new Date()) / 1000;
        var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
        var code = encodeURIComponent(code);
        var encryptedData = encodeURIComponent(e.detail.encryptedData);
        var iv = encodeURIComponent(e.detail.iv);
        console.log(encryptedData);
        console.log(iv);
        var lsign = utilMd5.hexMD5('appletmobile' + code + encryptedData + iv + randomstr + time)
        wx.request({
          url: app.host + 'appletmobile',
          method: 'post',
          dataType: 'json',
          data: {
            from: app.from,
            action: 'appletmobile',
            time: time,
            code: code,
            encryptedData: encryptedData,
            iv: iv,
            sign: lsign
          },
          success(data) {
            console.log(data);
            if (data.data.code == 1) {
              if (data.data.new == -1) {
                wx.setStorageSync('token', data.data.token);
                if (back) {
                  wx.reLaunch({
                    url: decodeURIComponent(back),
                  })
                } else {
                  wx.switchTab({
                    url: '/pages/member/index',
                  })
                }
              } else if (data.data.new == 1) {
                wx.navigateTo({
                  url: 'data/data?mobile=' + data.data.mobile + '&mobilecode=' + data.data.mobliecode + '&back=' + that.data.back,
                })
              } else if (data.data.new == 2) {
                that.setData({
                  mobile: data.data.mobile
                })
              }
            }
          }
        })
      }

    }

  },
  getPhoneNum: function (e) {
    // 把输入手机号码框的值存储起来
    console.log(e);
    this.setData({
      mobile: e.detail.value
    });
  },
  /**
   * 获取验证码
   */
  getCode: function (e) {
    var that = this;
    var phone = that.data.mobile;
    var reg = /^1[3456789]\d{9}$/;
    var wait = 60;
    if (that.data.mobile == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入手机号',
      })
      return;
    }
    if (!reg.exec(phone)) {
      wx.showToast({
        icon: 'none',
        title: '手机格式不对',
      })
    } else {
      var time = Date.parse(new Date()) / 1000;
      var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
      var saction = 'sendcode';
      var type = 1;
      var ssign = utilMd5.hexMD5(saction + phone + randomstr + time + type)
      console.log(ssign);
      wx.request({
        url: app.host + saction,
        method: 'GET',
        dataType: 'json',
        data: { from: app.from, type: type, number: phone, time: time, action: saction, sign: ssign },
        success: function (res) {
          console.log(res);
          if (res.data.code == 1) {
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
          } 
          if (res.data.code == -3){
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
            })
            wx.redirectTo({
            url: '/pages/login/index'
          })
          }
        }
      })

    }
  },
  /**
   * 输入验证码
   */
  inputCode: function (e) {
    this.setData({
      code: e.detail.value
    });
    var phoneNum = this.data.mobile;
    var codeNum = e.detail.value;
    console.log(phoneNum);
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
  gotoregister: function (e) {
    console.log('正在登录...');
    var that = this;
    var daction = 'inspectcode';
    var code = that.data.code;
    var mobiles = that.data.mobile;
    var time = Date.parse(new Date()) / 1000;
    var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
    var dsign = utilMd5.hexMD5(daction + code + mobiles + randomstr + time);
    console.log(dsign);
    wx.request({
      url: app.host + daction,
      method: 'GET',
      dataType: 'json',
      data: {
        from: app.from,
        code: code,
        mobile: mobiles,
        time: time,
        action: daction,
        sign: dsign
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          that.bindGetUserInfo(e);
          // wx.navigateTo({
          //   url: '/pages/login/data/data?mobile=' + mobiles + '&code=' + code + '&back=' + that.data.back,
          // })
        } else {
          wx.showToast({
            icon: 'none',
            title: '短信验证码不正确'
          })
        }
      }
    })

  },
  /**
   * 用户提交信息
   */
  bindGetUserInfo:function(e) {
    var that = this;
    var question = that.data.question1 + ':' + that.data.answer1 + ',' + that.data.question2 + ':' + that.data.answer2 + ',' + that.data.question3 + ':' + that.data.answer1;
    var agree = 1;
    var type = 2;
    var code = that.data.code;
    var mobile = that.data.mobile;
    var atricle = 'register'
    var incode = wx.getStorageSync('incode')

    console.log(decodeURIComponent(that.data.back));
    var time = Date.parse(new Date()) / 1000;
    var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
    console.log(e);
    if (e.detail.errMsg == 'getUserInfo:ok') {
      console.log('getUserInfo:ok', that.data.wxcode+'1');
      var wxcode = that.data.wxcode
      if (wxcode) {
        console.log('wxcode:ok');
        // var code = encodeURIComponent(wxcode);
        var source ='applet|weixin|join_marketing';
        // var encryptedData = encodeURIComponent(e.detail.encryptedData);
        // var iv = encodeURIComponent(e.detail.iv);
        var action = 'information';
        var str = action + agree + atricle + code + mobile + question + randomstr + source + time + type;
        console.log(str);
        var lsign = utilMd5.hexMD5(str)
        var datas = {
          atricle: atricle,
          mobile: mobile,
          question: question,
          agree: agree,
          type: type,
          code: code,
          from: app.from,
          action: action,
          time: time,
          source: source,
          // encryptedData: encryptedData
          // iv: iv,
          // invite: incode,
          sign: lsign
        };
        // console.log(datas);return;
        wx.request({
          url: app.host + action,
          method: 'post',
          dataType: 'json',
          data: datas,
          success(result) {
            console.log(result);
            if (result.data.code == 1) {
              wx.setStorageSync('token', result.data.token);
              if (that.data.back != undefined) {
                wx.reLaunch({
                  url: that.data.back,
                })
              } else {
                wx.redirectTo({
                  url: '/pages/project/project?project=' + 'MZJBQKj3NmPolKOv8qbj',
                })
              }
            }
          }
        })
      }

    }
  },
  /**
   * 获取用户收货信息
   */
  getNews: function () {
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
                mobile: res.telNumber
              })
            }
          })
         
        } 
        else {
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
})