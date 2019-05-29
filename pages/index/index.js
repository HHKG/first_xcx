// pages/index/index.js
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
    sharename: '',
    shareimg: '',
    shareurl: '',
    pattern: app.globalData.pattern,
    projects: [],
    others: [],
    bannerimg: [

    ],
    mshowimg: [],
    className0: "dotActive",
    className1: "",
    className2: "",
    className3: "",
    phonenum: '400-990-8830',
    version: app.globalData.version
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.showShareMenu({
      withShareTicket: true
    })
    if (options) {
      wx.setStorageSync('incode', options.incode)
    }
    var that = this;
    that.setData({
      pattern: app.globalData.pattern,
    })
    var limit = 1;
    var order = "E_Create_time";
    var action = 'project'
    var sign = utilMd5.hexMD5(action + limit + order + randomstr + time);
    var datas = {
      from: app.from,
      time: time,
      action: action,
      limit: limit,
      order: order,
      sign: sign
    };
    wx.request({
      url: app.host + action,
      method: 'get',
      dataType: 'json',
      data: datas,
      success(datas) {
        // console.log(datas.data.otherprojects);
        if (datas.data.code == 1) {
          //  console.log(datas.data.projects);
          that.setData({
            projects: datas.data.projects,
            others: datas.data.otherprojects,
          })
        }

      }
    })
    var bsign = utilMd5.hexMD5('getSlideItems' + randomstr + time + '1');
    wx.request({
      url: app.host + 'getSlideItems',
      method: 'GET',
      dataType: 'json',
      data: {
        from: app.from,
        type: 1,
        time: time,
        action: 'getSlideItems',
        sign: bsign
      },
      success: function(res) {
        // console.log(res);
        that.setData({
          bannerimg: res.data.slides
        })
      }
    })
    var msign = utilMd5.hexMD5('getSlideItems' + randomstr + time + '2');
    wx.request({
      url: app.host + 'getSlideItems',
      method: 'GET',
      dataType: 'json',
      data: {
        from: app.from,
        type: 2,
        time: time,
        action: 'getSlideItems',
        sign: msign
      },
      success: function(res) {
        //  console.log(res);
        that.setData({
          mshowimg: res.data.slides
        })
      }
    })
    var saction = 'shareinfo';
    var id = 'shouye';
    var ssign = utilMd5.hexMD5(saction + randomstr + id + time);
    wx.request({
      url: app.host + saction,
      method: 'get',
      dataType: 'json',
      data: {
        from: app.from,
        time: time,
        action: saction,
        share: id,
        sign: ssign
      },
      success: function(res) {
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
    getCurrentPages()[getCurrentPages().length - 1].onLoad()
    //  console.log(wx.getStorageSync('token'))
    if (wx.getStorageSync('token')) {
      var raction = 'record';
      var road = 'index'
      var rsign = utilMd5.hexMD5(raction + randomstr + road + time);
      wx.request({
        url: app.host + raction,
        method: 'post',
        dataType: 'json',
        header: {
          token: wx.getStorageSync('token')
        },
        data: {
          from: app.from,
          time: time,
          road: road,
          action: raction,
          sign: rsign
        },
        success: function(res) {}
      })
    }
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
    return {
      title: this.data.sharename,
      path: this.data.shareurl + '&incode=' + wx.getStorageSync('myincode'),
      imageUrl: this.data.shareimg,

    };
  },
  /**
   * 轮播图滑动触发的事件
   */
  changeDot: function(event) {
    var dotActive = event.currentTarget.dataset.dotactive;
    var current = event.detail.current;
    if (current == 0) {
      this.setData({
        className0: dotActive,
        className1: "",
        className2: "",
        className3: ""
      })
    }
    if (current == 1) {
      this.setData({
        className0: "",
        className1: dotActive,
        className2: "",
        className3: ""
      })
    }
    if (current == 2) {
      this.setData({
        className0: "",
        className1: "",
        className2: dotActive,
        className3: ""
      })
    }
    if (current == 3) {
      this.setData({
        className0: "",
        className1: "",
        className2: "",
        className3: dotActive
      })
    }
  },
  /**
   * 跳转到计划详情
   */
  toProject: function(e) {
    var code = e.currentTarget.dataset.code;
    console.log(code);
    wx.navigateTo({
      url: '/pages/project/project?project=' + code,
    })
    return;
  },
  /**
   * 打电话
   */
  callQian: function() {
    var that = this;
    //显示“呼叫”、“添加联系人”弹窗
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function(res) {
        if (res.tapIndex == 0) { //直接呼叫
          wx.makePhoneCall({
            phoneNumber: that.data.phonenum,
          })
        } else if (res.tapIndex == 1) { //添加联系人
          wx.addPhoneContact({
            firstName: '虔心荟',
            mobilePhoneNumber: that.data.phonenum,
            success: function(res_addphone) {
              console.log("电话添加联系人返回：", res_addphone)
            }
          })
        }
      }
    })
  },
  /**
   * 去领住房券优惠活动
   */
  toAward: function() {
    wx.navigateTo({
      url: '/pages/index/award/award',
    })
  },
  exitpattern: function() {
    util.exitpattern();
  }
})