// pages/index/project/index.js
var app = getApp();
var utilMd5 = require('../../utils/md5.js');
var WxParse = require('../../wxParse/wxParse.js');
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
    index: 0,
    className: 'project-active',
    module: '',
    fixed: true,
    surveyH: 0,
    keyH: 0,
    rebateH: 0,
    projectDetailH: 0,
    scrollY: '',
    screenH: '',
    E_Abbreviation: '',
    E_Characteristic: '',
    E_Code: '',
    E_Coupon: '',
    E_Cycle: '',
    E_Digest: '',
    E_HeaderImg: '',
    E_Money: '',
    E_Region: '',
    E_Scale: '',
    E_Situation: '',
    E_Title: '',
    Purchased: '',
    Surplus: '',
    E_ScaleShow:'',
    plan:'',
    project:'',
    lastday: '',
    project_intro: '',
    project_name: '',
    proportion: '',
    page:'',
    back:'',
    tag:[],
    hidden:true,
    wx_number: 'QCS138138',
    phoneNumber:'400-990-8830'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    console.log(options);
    var that = this;
    var code=options.project;

    if (options.incode) {
      wx.setStorageSync('incode', options.incode)

    }
    //console.log(wx.getStorageSync('incode'));
    if(code){
      var url = '/' + that.route + '?project=' + code
      var back = encodeURIComponent(url);
      that.setData({
        pattern: app.globalData.pattern,
        back:back,
        projectcode: code,
        page: getCurrentPages().length
      })
    //  console.log(options);

  
      var action = 'getProjectInfo';
   
      var sign = utilMd5.hexMD5(action + code + randomstr + time);
      var data = {
        from: app.from,
        code: code,
        time: time,
        action: action,
        sign: sign
      };
      wx.request({
        url: app.host + action,
        method: 'get',
        data: data,
        dataType: 'json',
        success(data) {
         console.log(data)
          if (data.data.code == 1) {
            that.setData({
              project: data.data.project_info.E_Code,
              plan: data.data.project_info.E_PlanCode,
              E_Abbreviation: data.data.project_info.E_Abbreviation,
              E_Characteristic: data.data.project_info.E_Characteristic,
              E_Code: data.data.project_info.E_Code,
              E_Coupon: data.data.project_info.E_Coupon,
              E_Cycle: data.data.project_info.E_Cycle,
              E_Digest: data.data.project_info.E_Digest,
              E_HeaderImg: data.data.project_info.E_HeaderImg,
              E_Money: data.data.project_info.E_Money,
              E_Region: data.data.project_info.E_Region,
              E_Scale: data.data.project_info.E_Scale,
              E_Situation: data.data.project_info.E_Situation,
              E_Title: data.data.project_info.E_Title,
              Purchased: data.data.project_info.Purchased,
              Surplus: data.data.project_info.Surplus,
              lastday: data.data.project_info.lastday,
              plan_intro: data.data.project_info.plan_intro,
              E_ScaleShow: data.data.project_info.E_ScaleShow,
              E_Address: data.data.project_info.E_Address,
              project_intro: data.data.project_info.project_intro,
              project_name: data.data.project_info.project_name,
              proportion: data.data.project_info.proportion,
              tag: data.data.project_info.tags
            })
            var article = data.data.project_info.project_intro; // 这里是ajax请求数据
            //console.log(article);
            WxParse.wxParse('article', 'html', article, that, 5);
            setTimeout(function(){
              that.getcoordinate();
            },1000)
          }
        }
        })
      var saction = 'shareinfo';
      var id = 'jihua';
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
      wx.hideLoading();
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      })

    }
    return ;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenH: res.windowHeight,
        
        })
      
      },
    })
    // 创建节点查询器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#survey').boundingClientRect();
    query.select('#key').boundingClientRect();
    query.select('#rebate').boundingClientRect();
    query.select('#project-detail').boundingClientRect();
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
     // console.log(res);
      var surveyH = res[0].top;
      var keyH = res[1].top;
      var rebateH = res[2].top;
      var projectDetailH = res[3].top;
      var scrollH = res[4].scrollTop;
      that.setData({
        surveyH: surveyH,
        keyH: keyH,
        rebateH: rebateH,
        projectDetailH: projectDetailH
      })
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
     getCurrentPages()[getCurrentPages().length - 1].onLoad({project:this.data.projectcode})
    if (wx.getStorageSync('token')) {
      var raction = 'record';
      var road = 'project'
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
   // console.log(wx.getStorageSync('myincode'))
    return {
      title: this.data.sharename,
      path: this.data.shareurl + '&incode=' + wx.getStorageSync('myincode'),
      imageUrl: this.data.shareimg,

    };
  },
  /**
   * 点击切换
   */
  change: function(e) {
    var module = e.currentTarget.dataset.module; //id
    var index = e.currentTarget.dataset.id;
    var _H = e.currentTarget.dataset.h;
    wx.pageScrollTo({
      scrollTop: _H
    })
    this.setData({
      index: index,
      module: module,
      scrollY: _H
    })
  },
  onPageScroll: util.throttle(function (e) {
    // 创建节点查询器
    var that = this;
    var query = wx.createSelectorQuery();
    //选择id
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      // console.log(res);
      var scrollH = res[0].scrollTop;
      //    console.log(scrollH);
      var projectDetailH = that.data.projectDetailH;
      var surveyH = that.data.surveyH - 100;
      var keyH = that.data.keyH - 100;
      var rebateH = that.data.rebateH - 100;
      console.log(projectDetailH, surveyH, keyH, rebateH, scrollH);
      if (scrollH > projectDetailH) {
        // console.log('固定');
        that.setData({
          fixed: false
        })
      } else {
        // console.log('不固定');
        that.setData({
          fixed: true
        })
      }
      if (scrollH > surveyH && scrollH < keyH) {
        console.log('');
        that.setData({
          index: 0
        })
      }
      if (scrollH > keyH && scrollH < rebateH) {
        that.setData({
          index: 1
        })
      }
      if (scrollH > rebateH) {
        that.setData({
          index: 2
        })
      }
    })
  },0),
  /**
   * 锚点滚动
   */
  // onPageScroll: function(e) {
  //   // 创建节点查询器
  //   var that = this;
  //   var query = wx.createSelectorQuery();
  //   //选择id
  //   query.selectViewport().scrollOffset()
  //   query.exec(function(res) {
  //    // console.log(res);
  //     var scrollH = res[0].scrollTop;
  // //    console.log(scrollH);
  //     var projectDetailH = that.data.projectDetailH;
  //     var surveyH = that.data.surveyH - 300;
  //     var keyH = that.data.keyH - 300;
  //     var rebateH = that.data.rebateH - 300;
  //    // console.log(projectDetailH, surveyH, keyH, rebateH, scrollH);
  //     if (scrollH > projectDetailH) {
  //       // console.log('固定');
  //       that.setData({
  //         fixed: false
  //       })
  //     } else {
  //       // console.log('不固定');
  //       that.setData({
  //         fixed: true
  //       })
  //     }
  //     if (scrollH > surveyH && scrollH < keyH) {
  //       console.log('');
  //       that.setData({
  //        index: 0
  //       })
  //     }
  //      if (scrollH > keyH && scrollH < rebateH) {
  //       that.setData({
  //        index: 1
  //       })
  //     }
  //      if (scrollH > rebateH) {
  //       that.setData({
  //         index: 2
  //       })
  //     }
     
  //   })
  // },
  /**
   * 打电话
   */
  makeCall: function() {
    var that = this;
    //显示“呼叫”、“添加联系人”弹窗
    wx.showActionSheet({
      itemList: ['呼叫', '添加联系人'],
      success: function(res) {
        if (res.tapIndex == 0) { //直接呼叫
          wx.makePhoneCall({
            phoneNumber: that.data.phoneNumber,
          })
        } else if (res.tapIndex == 1) { //添加联系人
          wx.addPhoneContact({
            firstName: '虔心荟',
            mobilePhoneNumber: that.data.phoneNumber,
            success: function(res_addphone) {
             // console.log("电话添加联系人返回：", res_addphone)
            }
          })
        }
      }
    })
  },
  /**
   * 计划详情
   * 
   */
  toplan: function(e) {
    var code = e.target.dataset.code;
    // console.log(code);
    wx.navigateTo({
      url: 'detail/detail?project=' + code,
    })
  },
  /**
   *跳转算一算页面
   */
  toCalculate: function(e) {
    var code = e.target.dataset.code;
    getApp().globalData.p_m = this.data.E_Money;
    getApp().globalData.p_y = this.data.E_Cycle;
    getApp().globalData.p_r_m = this.data.E_Scale;
    getApp().globalData.p_r_c = this.data.E_Coupon;
    getApp().globalData.p_name = this.data.E_Abbreviation;
    getApp().globalData.p_title = this.data.E_Title;
    getApp().globalData.project = this.data.project;
    getApp().globalData.plan = this.data.plan;
    wx.navigateTo({
      url: '/pages/project/calculate/calculate?p_m=' + this.data.E_Money + '&p_y=' + this.data.E_Cycle + '&p_r_c=' + this.data.E_Coupon + '&p_r_m=' + this.data.E_Scale + '&p_name=' + this.data.E_Abbreviation + '&p_title=' + this.data.E_Title + '&project=' + this.data.project + '&plan=' + this.data.plan,
    })
  },
  /**
   * 邀请好友领住房券活动
   */
  toAward: function() {
    wx.navigateTo({
      url: '/pages/index/award/award',
    })

  },
  /**
   * 返回首页
   */
  totoindex:function(){
  wx.switchTab({
    url: '/pages/index/index',
  })
  }
  ,
  exitpattern: function () {
   
    util.exitpattern(this.data.back);
  },
  /**
   * 获取锚点坐标
   */
  getcoordinate: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenH: res.windowHeight
        })

      },
    })
    // 创建节点查询器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#survey').boundingClientRect();
    query.select('#key').boundingClientRect();
    query.select('#rebate').boundingClientRect();
    query.select('#project-detail').boundingClientRect();
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
   //   console.log(res);
      var surveyH = res[0].top;
      var keyH = res[1].top;
      var rebateH = res[2].top;
      var projectDetailH = res[3].top;
      var scrollH = res[4].scrollTop;
      that.setData({
        surveyH: surveyH,
        keyH: keyH,
        rebateH: rebateH,
        projectDetailH: projectDetailH
      })
    })

  }
  ,  /**
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
   * 去方案页面
   */
  toCases:function(e){
    var code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: 'cases/cases?project=' + code,
    })
  }
  ,
  /**
   * 进入模拟模式
   */
  toimitate:function(){
    wx.navigateTo({
      url: '/pages/member/imitate/imitate'
    }) 
  }
})