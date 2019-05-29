//app.js
const mtjwxsdk = require("./utils/mtj-wx-sdk.js");
var utilMd5 = require('/utils/md5.js');
App({
  from: 'applet',
  lesswithdraw:50.00,
  salt: 'obqgbzagsj',
  // 测试接口
  //  host: 'https://wt.wanmey.com/',
  // 正式版本接口
   host: 'https://api.iqianclub.com/',
  // ImgDomain: 'https://qxh.com/upload/',
  Grade: {
    '1': 'http://api.iqianclub.com/upload/program//images/baiyin_member.png',
    '2': 'http://api.iqianclub.com/upload/program//images/gold_member.png',
    '3': 'http://api.iqianclub.com/upload/program//images/zhuanshi_icon.png',
    '4': 'http://api.iqianclub.com/upload/program//images/heijin_icon.png',
    '5': 'http://api.iqianclub.com/upload/program//images/heizhuan_icon.png',
    },
  globalData: {
    pattern:0,
    version:'1.1.3',
    content:'',
    sum:'1',
    p_m:'',
    p_y:'',
    p_r_c:'',
    p_r_m:'',
    p_name:'',
    p_title:'',
    project:'',
    plan:''
  },
  onLaunch: function () {
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    // var host = 'https://wt.wanmey.com/';
    // var from ='applet';
    // var salt ='obqgbzagsj';
    // this.globalData.pattern=0
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // var token=wx.getStorageSync('token');
    // var newmember = wx.getStorageSync('newmember');
    // var pattern = wx.getStorageSync('pattern');
    // if(pattern!=0 || pattern!=1){
    //   wx.setStorageSync('pattern', 0);
    // }
    //  wx.removeStorageSync('token')
    // if(token=='' && newmember!=1){
    //   wx.login({
    //     success(res) {
    //       if (res.code) {
    //         var time = Date.parse(new Date()) / 1000;
    //         var randomstr = utilMd5.hexMD5(from + salt + time);
    //         var usign = utilMd5.hexMD5('getcode2Session' + res.code + randomstr + time);
    //         wx.request({
    //           url: host + 'getcode2Session',
    //           method: 'get',
    //           dataType: 'json',
    //           data: { from: from, action: 'getcode2Session', sign: usign, code: res.code, time: time },
    //           success(result) {
    //             if (result.data.code == 1) {
    //               if (result.data.new == -1) {
    //                 wx.setStorageSync('member', result.data.user);
    //                 wx.setStorageSync('token', result.data.token);
    //               }else{
    //                 wx.setStorageSync('newmember', 1);
    //               }
    //             }
    //           }
    //         })
    //       }
    //     }
    //   })
    // }

    // 登录
   
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
 
  cheklogin:function(back){
    wx.login({
      success(res) {
        if (res.code) {
          var time = Date.parse(new Date()) / 1000;
          var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
          var usign = utilMd5.hexMD5('getcode2Session' + res.code + randomstr + time);
          wx.request({
            url: app.host + 'getcode2Session',
            method: 'get',
            dataType: 'json',
            data: { from: app.from, action: 'getcode2Session', sign: usign, code: res.code, time: time },
            success(result) {
              var back = decodeURIComponent(that.data.back)
              console.log(1);
              console.log(back);
              console.log(2);
              if (result.data.code == 1) {
                if (result.data.new == -1) {
                  wx.setStorageSync('member', result.data.info);
                  wx.setStorageSync('token', result.data.token);
                  that.onload()

                }
              }
            }
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(444);
    var saction = 'updateactivity';
    var ssign = utilMd5.hexMD5(saction + 1 + randomstr + time);

    wx.request({
      method: 'POST',
      url: app.host + saction,
      dataType: 'json',
      header: {
        token: wx.getStorageSync('token')
      },
      data: {
        from: app.from,
        activity: 1,
        time: time,
        action: saction,
        sign: ssign
      },
      success: function (data) {
        // if (data.data.code == 9201) {
        //   util.checklogin(that.data.back);

        //   //that.onLoad();
        // }
        if (data.data.code == '1') {
          // wx.showToast({
          //   title: '转发成功',
          // })
          // getCurrentPages()[getCurrentPages().length - 1].onLoad()
        }
      }
    })
    return {
      title: this.data.title,
      path: '/pages/index/index?incode=' + this.data.incode,
      imageUrl: this.data.E_Img,
      // success: function (res) {

      //   // 转发成功
      //   if (res.errMsg =='shareAppMessage:ok'){
      //   }
      // },
      // fail: function (res) {
      //   // 转发失败
      // },

    };

  }
})