// pages/holiday/roomList/hotalDetail/hotalDetail.js
var app = getApp();
var utilMd5 = require('../../../../utils/md5.js');
var util = require('../../../../utils/util.js');
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
    id: 0,
    tabH: 0,
    hotalSizeH: 0,
    summaryH: 0,
    assessH: 0,
    fixed: '',
    module: '',
    scrollY: '',
    screenH: '',
    _H: '',
    hidden: true,
    phoneNum: '400-990-8830',
    wx_number: 'QCS138138'


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var saction = 'shareinfo';
    var id = 'jiudian';
    var ssign = utilMd5.hexMD5(saction + randomstr + id + time);
    wx.request({
      url: app.host + saction,
      method: 'get',
      dataType: 'json',
      data: { from: app.from, time: time, action: saction, share: id, sign: ssign },
      success: function (res) {
        if (res.data.code == 1) {
          console.log(res);
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
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenH: res.windowHeight
        })

      },
    })
    var query = wx.createSelectorQuery();
    query.select('.hotal-cnt').boundingClientRect();
    query.select('#hotalSize').boundingClientRect();
    query.select('#summary').boundingClientRect();
    query.select('#assess').boundingClientRect();
    query.exec(function (res) {
      console.log(res);
      var tabH = res[0].top;
      var hotalSizeH = res[1].top;
      var summaryH = res[2].top;
      var assessH = res[3].top;
      that.setData({
        tabH: tabH,
        hotalSizeH: hotalSizeH,
        summaryH: summaryH,
        assessH: assessH
      })
    })
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
    return {
      title: this.data.sharename,
      path: this.data.shareurl + '?incode=' + wx.getStorageSync('myincode'),
      imageUrl: this.data.shareimg,

    };
  },
  /**
   * 切换Tab
   */
  changeTab: function (e) {
    var id = e.currentTarget.dataset.id;
    var module = e.currentTarget.dataset.module;
    var _H = e.currentTarget.dataset.h;
    wx.pageScrollTo({
      scrollTop: _H
    })
    this.setData({
      id: id,
      module: module
    })
  },
  /**
   * 页面滚动
   */
  onPageScroll: function (e) {
    var that = this;

    var scrollH = e.scrollTop;
    if (scrollH >= this.data.tabH) {
      that.setData({
        fixed: 'fixed'
      })
    } else {
      that.setData({
        fixed: ''
      })
    }
    if (scrollH >= this.data.hotalSizeH - 300 && scrollH < this.data.summaryH - 300) {
      that.setData({
        id: 0
      })
    }
    if (scrollH >= this.data.summaryH - 300 && scrollH < this.data.assessH - 300) {
      that.setData({
        id: 1
      })
    }
    if (scrollH >= this.data.assessH - 300) {
      that.setData({
        id: 2
      })
    }
  },
  /**
   * 打开/关闭弹窗
   */
  Pop: function () {
    this.setData({
      hidden: !this.data.hidden
    })
  }
  ,
  /**
   * 打电话
   */
  makeCall: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['呼叫', '添加电话联系人'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: '400-990-8830',
          })
        }
        if (res.tapIndex == 1) {
          wx.addPhoneContact({
            firstName: '虔心荟',
            phoneNumber: that.data.phoneNumber,
            success: function (res_addphone) {
              console.log("电话添加联系人返回：", res_addphone)
            }
          })
        }
      }
    })
  }
  ,
  /**
 * 跳转到免费攻略页面
 */
  gotofree: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/holiday/free/free?id=' + id,
    })
  },
  /**
 * 返回首页
 */
  gontoindex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
  ,
  /**
   * 复制微信号
   */
  getwxnum: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.wx_number,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    })
  }
})