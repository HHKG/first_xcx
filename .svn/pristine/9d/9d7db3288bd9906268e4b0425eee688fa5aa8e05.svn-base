var utilMd5 = require('md5.js');
var app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function checklogin(back){
  //console.log(back);
  wx.login({
    success(res) {
       console.log(app.from);
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
           console.log(result);
            if (result.data.code == 1) {
              if (result.data.new == -1) {
                wx.setStorageSync('member', result.data.info);
                if (result.data.info.E_InviteCode){
                  console.log('ok');
                  wx.setStorageSync('myincode', result.data.info.E_InviteCode)
                }
                wx.setStorageSync('token', result.data.token);
              //  getCurrentPages()[getCurrentPages().length - 1].onLoad()
                wx.redirectTo({
                  url:decodeURIComponent(back),
                  fail:function(res){
                    //console.log(res);
                    getCurrentPages()[getCurrentPages().length - 1].onLoad()
                  
                  }
                })
                return result.data.token;

              }else{
                wx.setStorageSync('token', '');
                wx.reLaunch({
                  url: '/pages/login/index?back=' + back,
                })
                return;
              }
            }
          }
        })
      }
    }
  })
}
function exitpattern(back){
  var back = decodeURIComponent(back)
  wx.showModal({
    title: '提示',
    content: '即将退出模拟模式',
    success:function(res){
      if(res.confirm){
        var action = 'pattern';
      
      //  console.log(back)
        var pattern = 0;
        var time = Date.parse(new Date()) / 1000;
        var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
        var sign = utilMd5.hexMD5(action + pattern + randomstr + time);
        wx.request({
          url: app.host + action,
          data: { pattern: pattern, from: app.from, time: time, action: action, sign: sign },
          method: 'POST',
          header: { token: wx.getStorageSync('token') },
          dataType: 'json',
          success: function (res) {
            if (res.data.code == 1) {
              // console.log(res)
              app.globalData.pattern = 0;
              wx.setStorageSync('token', res.data.token);
              wx.showToast({
                title: '退出成功',
              })
              if (back != 'undefined') {
                if (back == 'tuichu') {
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                } else {
                    //consoel.log(back);
                  wx.redirectTo({
                    url: back,
                    fail: function (res) {
                      //  console.log(res)
                      // console.log('跳转失败')
                    }
                  })
                }
              } else {
                getCurrentPages()[getCurrentPages().length - 1].onLoad()
              }
            }
          }
        })
      }
      if(res.cancel){
      // app.globalData.pattern = 1;
      }
    }
  })
 
}
/**
  *节流解决滚动异步阻塞
  */
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1000   //设置了300毫秒
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和传递给原函数
      _lastTime = _nowTime
    }
  }
}
module.exports = {
  formatTime: formatTime,
  checklogin: checklogin,
  exitpattern: exitpattern,
  throttle: throttle
}
