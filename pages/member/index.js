// pages/member/index.js
var app = getApp();
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
    E_HeadImg: '',
    name: '',
    E_Mobile: '',
    Amout: '',
    E_CardNo: '',
    Balance: '',
    Consumption: '',
    NowBillPrice: '',
    nextbill: '',
    NoBillPrice: '',
    HasSettlementPrice: '',
    grade: '',
    E_IsInvestor: 1,
    bank: 0,
    myproject: [],
    coupons: [],
    index: 8,
    hidden: true,
    token: '',
    back: '',
    rebate_detail: 1,
    myincode: '',
    id: '',
    moni_guide: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var moni_guide = this.data.moni_guide;
    if (moni_guide == 2) {
      this.setData({
        id: 1,
        hidden: false,
        moni_guide:1
      })
      wx.pageScrollTo({
        scrollTop: 170,
      })

    }
    wx.showLoading()
    var that = this;
    var token = wx.getStorageSync('token');
    var back = encodeURIComponent('/' + that.route);

    if (!token) {
      util.checklogin(back);
    } else {
      that.setData({
        token: token,
        back: back,
        pattern: app.globalData.pattern,

      })
      var action = 'member';
      var sign = utilMd5.hexMD5(action + app.globalData.pattern + randomstr + time);
      var data = {
        pattern: app.globalData.pattern,
        from: app.from,
        time: time,
        action: action,
        sign: sign
      };
      wx.request({
        url: app.host + action,
        method: 'POST',
        data: data,
        header: {
          token: token
        },
        dataType: 'json',
        success(data) {
          //console.log(data.data.msg);
          if (data.data.code == 9201) {
            token = util.checklogin(that.data.back);
          }
          if (data.data.code == 1) {
            wx.setStorage({
              key: 'member',
              data: data.data.info,
              myincode: data.data.incode
            })
            wx.setStorageSync('myincode', data.data.incode);
            //console.log(data);
            var grade = app.Grade[data.data.info.E_Grade];
            var name = data.data.info.E_TrueName ? data.data.info.E_TrueName : data.data.info.E_Name;
            var cardNum = data.data.info.E_CardNo;
            var e_cardno = cardNum.toString().replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
            //console.log(data.data);
            var coupons = data.data.coupons.length > 0 ? data.data.coupons[0] : [];
            //   console.log(coupons);
            that.setData({
              E_HeadImg: data.data.info.E_HeadImg,
              name: name,

              grade: grade,
              E_IsInvestor: data.data.info.E_IsInvestor,
              E_Mobile: data.data.info.E_Mobile,
              Amout: data.data.info.Amout,
              E_CardNo: e_cardno,
              Balance: data.data.info.Balance,
              Consumption: data.data.info.Consumption,
              NowBillPrice: data.data.info.NowBillPrice,
              nextbill: data.data.info.nextbill,
              NoBillPrice: data.data.info.NoBillPrice,
              HasSettlementPrice: data.data.info.HasSettlementPrice,
              coupons: coupons,
              bank: data.data.info.bank,
              rebate_detail: 0
            })
          } else {
            that.setData({
              rebate_detail: 1
            })
          }
        }
      })
      //  console.log(that.data.myproject);
      var maction = 'myproject';
      var msign = utilMd5.hexMD5(maction + 1 + app.globalData.pattern + randomstr + time);
      wx.request({
        method: 'POST',
        url: app.host + maction,
        dataType: 'json',
        header: {
          token: token
        },
        data: {
          pattern: app.globalData.pattern,
          limit: 1,
          from: app.from,
          time: time,
          action: maction,
          sign: msign
        },
        success: function(data) {
          if (data.data.code == '1') {
            that.setData({
              myproject: data.data.data
            })
            // console.log(that.data.myproject);
          }
        }
      })
      // console.log(that.data.myproject);
      var saction = 'shareinfo';
      var id = 'huiyaun';
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
            //     console.log(res);
            that.setData({
              sharename: res.data.data.E_Name,
              shareimg: res.data.data.E_Img,
              shareurl: res.data.data.E_Url,
            })
          }
        }
      })
      wx.hideLoading()
    }
  },
  /**
   * 下一步
   */
  clickNext: function(e) {
    var id = e.currentTarget.dataset.id;
    if (id == 2) {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }
    if (id == 3) {
      wx.pageScrollTo({
        scrollTop: 400,
      })
    }
    if (id == 6) {
      this.setData({
        hidden: true
      })
      wx.navigateTo({
        url: '/pages/project/project?project=MZJBQKj3NmPolKOv8qbj',
      })
    }
    this.setData({
      id: id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var cardNum = this.data.E_CardNo;
    //console.log(cardNum);
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenH: res.windowHeight
        })

      },
    })
    var query = wx.createSelectorQuery();
    query.select('#quanyi').boundingClientRect();
    query.exec(function(res) {
      //   console.log(res);
      var quanyi = res[0].top;
      that.setData({
        quanyi: quanyi
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (wx.getStorageSync('token')) {
      // console.log(321)

      var raction = 'record';
      var road = 'member'
      var rsign = utilMd5.hexMD5(raction + randomstr + road + time);
      wx.request({
        url: app.host + raction,
        method: 'post',
        dataType: 'json',
        header: {
          token: this.data.token
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
    getCurrentPages()[getCurrentPages().length - 1].onLoad()
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
  gotocertificate: function() {

    if (this.data.E_IsInvestor != 2) {
      wx.showModal({
        title: '提示',
        content: '请实名认证',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/member/cash/authentication/authentication',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: 'certificate/certificate',
      })
    }
  },
  gotorecharge: function() {
    wx.navigateTo({
      url: '/pages/member/update/update',
    })
  },
  gotomyorder: function() {

    wx.navigateTo({
      url: '/pages/member/order/order',
    })
  },
  gotocash: function() {
    if (this.data.E_IsInvestor != 2) {
      wx.showModal({
        title: '提示',
        content: '请实名认证',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/member/cash/authentication/authentication',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: 'cash/cash?money=' + this.data.Balance + '&bank' + this.data.bank,
      })
    }

  },
  gotomyplans: function() {
    wx.navigateTo({
      url: 'myPlan/myPlan',
    })
  },
  gotoproject: function() {
    // console.log('ok');
    wx.navigateTo({
      url: '/pages/project/project?project=MZJBQKj3NmPolKOv8qbj',
    })
  },
  /**
   * 弹出弹窗
   */
  jumpPop: function(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      index: id,
      hidden: false
    })
  },
  /**
   * 关闭弹窗
   */
  hidePop: function() {
    this.setData({
      hidden: true,
      index: 10
    })
  },
  /**
   * 跳转住房券列表
   */
  toCoupom: function() {
    wx.navigateTo({
      url: 'coupomList/coupomList',
    })
  },
  /**
   * 进入我的邀请页面
   */
  gotomyinvite: function() {
    wx.navigateTo({
      url: '/pages/member/myInvite/myInvite',
    })
  },
  /**
   * 进入消费金
   */
  gotoconsumption: function() {
    wx.navigateTo({
      url: 'consumerList/consumerList',
    })
  },
  gotopattern: function() {

  },
  /**
   * 进入返现页面
   */
  torebate: function() {
    wx.navigateTo({
      url: 'rebate/rebate',
    })
  },
  /**
   * 跳转到模拟模式
   */
  gotoimitate: function() {
    wx.navigateTo({
      url: '/pages/member/imitate/imitate',
    })
  },
  exitpattern: function() {
    util.exitpattern();
  },
  /**
   * 去参加分享计划
   */
  gotoproject: function() {
    wx.navigateTo({
      url: '/pages/project/project?project=' + 'MZJBQKj3NmPolKOv8qbj',
    })
  },
  /**
   * 去我已参与的计划
   */
  gotomyplan: function() {
    wx.navigateTo({
      url: '/pages/member/myPlan/myPlan',
    })
  },
  /**
   * 滚动到底部
   */
  pageScrollToBottom: function() {
    wx.createSelectorQuery().select('.mem-page').boundingClientRect(function(rect) {
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
  exitpattern: function() {
    util.exitpattern();
  },
  /**
   * 点击会员权益
   */
  legal: function(e) {
    this.pageScrollToBottom();
  },
  canselpop: function() {
    util.canselpop();
  },
  // 退出登录
  loginout: function() {
    var laction = 'memberloginout';
    var lsign = utilMd5.hexMD5(laction + randomstr + time);
    wx.request({
      url: app.host + laction,
      method: 'post',
      dataType: 'json',
      header: {
        token: this.data.token
      },
      data: {
        from: app.from,
        time: time,
        action: laction,
        sign: lsign
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.showModal({
            title: '提示',
            content: '您要退出登录吗？',
            cancelText: '取消',
            cancelColor: '#333',
            confirmText: '确定',
            confirmColor: '#F5854F',
            success: function(res) {
              console.log(res.confirm);
              if (res.confirm == true) {
                wx.removeStorageSync('token');
                wx.removeStorageSync('member');
                wx.reLaunch({
                  url: '/pages/index/index',
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })

        }
      }
    })
  },
  /**
   * 判断是否出现过模拟模式引导
   */
  moniGuide: function(val) {
    console.log(val);
    this.setData({
      moni_guide: val
    })
  }
})