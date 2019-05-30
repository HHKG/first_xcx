
// pages/project/cases/cases.js
var app = getApp();
var utilMd5 = require('../../../utils/md5.js');
var util = require('../../../utils/util.js');
var time = Date.parse(new Date()) / 1000;
var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
Page({
  /**
   * 页面的初始数据
   */
  // p_m:参与计划金额，p_y：参与计划返利多少年，p_r_m：每年返现的比例，p_r_c：每年返住房券比例
  data: {
    borderBlock: '',
    id: '',
    plans:[],
    p_m:'',
    p_y:'',
    p_r_m: '',
    p_r_c: '',
    p_name:'',
    p_title:'',
    code:'',
    project:'',
    plan:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var code = that.options.project;
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
          if (data.data.code == 9201) {
            util.checklogin(encodeURIComponent('/' + that.route));
          }
          if (data.data.code == 1) {
            console.log(data.data.data[0]);
            var mo_p_m = data.data.data[0].money,
              mo_p_y = data.data.data[0].E_Cycle,
              mo_p_r_m = data.data.data[0].E_Scale,
              mo_p_r_c = data.data.data[0].E_Coupon,
              mo_p_name = data.data.data[0].E_ProjectName,
              mo_p_title = data.data.data[0].E_Title,
              mo_id = data.data.data[0].E_Code,
              mo_project = data.data.data[0].E_ProjectCode;
            console.log(mo_p_m, mo_p_y);
            that.setData({
              plans: data.data.data,
              code:code,
              p_m: mo_p_m,
              p_y: mo_p_y,
              p_r_m: mo_p_r_m,
              p_r_c: mo_p_r_c,
              p_name: mo_p_name,
              p_title: mo_p_title,
              project: mo_project,
              id: mo_id,
              plan: mo_id
            })
            // console.log(that.data.p_r_c+'pkpkpkpk');
            getApp().globalData.p_m = data.data.data[0].money;
            getApp().globalData.p_y = data.data.data[0].E_Cycle;
            getApp().globalData.p_r_m = data.data.data[0].E_Scale;
            getApp().globalData.p_r_c = data.data.data[0].E_Coupon;
            getApp().globalData.p_name = data.data.data[0].E_ProjectName;
            getApp().globalData.p_title = data.data.data[0].E_Title;
            getApp().globalData.plan = data.data.data[0].E_Code;
            getApp().globalData.project = data.data.data[0].E_ProjectCode;
            console.log(getApp().globalData.plan + 'okokokk');
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
    }

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
    if (wx.getStorageSync('token')) {
      getCurrentPages()[getCurrentPages().length - 1].onLoad({ project: this.data.project })
      var raction = 'record';
      var road = 'detail'
      var rsign = utilMd5.hexMD5(raction + randomstr + road + time);
      // wx.request({
      //   url: app.host + raction,
      //   method: 'post',
      //   dataType: 'json',
      //   header: { token: wx.getStorageSync('token') },
      //   data: { from: app.from, time: time, road: road, action: raction, sign: rsign },
      //   success: function (res) {
      //   }
      // })
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

  },
  /**
   * 选择方案
   */
  select: function (e) {
    // console.log(e.currentTarget.dataset);return;
    var id = e.currentTarget.dataset.id;
    var p_m = e.currentTarget.dataset.money;
    var p_y = e.currentTarget.dataset.year;
    var p_r_m = e.currentTarget.dataset.rebatemoney;
    var p_r_c = e.currentTarget.dataset.rebatecoupom;
    var p_name=e.currentTarget.dataset.name;
    var p_title=e.currentTarget.dataset.title;
    var project = e.currentTarget.dataset.project;
    var plan = e.currentTarget.dataset.id;
    
    if (id) {
      this.setData({
        borderBlock: 'cases-active',
        id: id,
        p_m:p_m,
        p_y:p_y,
        p_r_c:p_r_c,
        p_r_m:p_r_m,
        p_name:p_name,
        p_title:p_title,
        project:project,
        plan: plan 
      })
      
      getApp().globalData.p_m = p_m;
      getApp().globalData.p_y = p_y;
      getApp().globalData.p_r_m = p_r_m;
      getApp().globalData.p_r_c = p_r_c;
      getApp().globalData.p_name = p_name;
      getApp().globalData.p_title = p_title;
      getApp().globalData.plan = plan;
      getApp().globalData.project = project;
      console.log(getApp().globalData.p_r_c  + 'okokokk');
    }
  },
  /**
   * 进入返利测算页面
   */
  tocalculate: function () {
     console.log(this.data);
    // console.log(getApp().globalData);
    // return;
    getApp().globalData.p_m = this.data.p_m;
    getApp().globalData.p_y = this.data.p_y;
    getApp().globalData.p_r_m = this.data.p_r_m;
    getApp().globalData.p_r_c = this.data.p_r_c;
    getApp().globalData.p_name = this.data.p_name;
    getApp().globalData.p_title = this.data.p_title;
    getApp().globalData.plan = this.data.plan;
    getApp().globalData.project = this.data.project;
    console.log(getApp().globalData.plan);
    wx.navigateTo({
      url: '/pages/project/calculate/calculate?p_m=' +this.data.p_m + '&p_y=' + this.data.p_y + '&p_r_c=' +this.data.p_r_c + '&p_r_m=' +this.data.p_r_m+'&p_name='+ this.data.p_name +'&p_title='+this.data.p_title+'&code='+this.data.code,
    })
  }
})