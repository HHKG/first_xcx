var app = getApp();
var utilMd5 = require('../../../utils/md5.js');
var WxParse = require('../../../wxParse/wxParse.js');
var util = require('../../../utils/util.js');
var time = Date.parse(new Date()) / 1000;
var randomstr = utilMd5.hexMD5(app.from + app.salt + time);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pattern: app.globalData.pattern,
    cal_title: '四闲山房别墅',
    hidden: 3,
    li: 2,
    rebate: '6%',
    fixedScale: '12%',
    planCash: '10',
    hide: true,
    cartoon: '',
    update_model: false,
    changeOther: true,
    sum:'1',
    p_m: '',
    p_y: '',
    p_r_c: '',
    p_r_m: '',
    p_name:'',
    p_title: '',
    num: 1,
    code:'',
    content: [],
    current_name:'',
    update_name:'',
    current_img:'',
    update_img:'',
    update:'',
    sum_money:'',
    project:'',
    plan:''


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this;
    // console.log(options);
    // var project = options.project;
    // var plan=options.plan;
  //  console.log(getApp().globalData);return;
    var project = getApp().globalData.project;
    var plan =  getApp().globalData.plan ;
    
    wx.hideShareMenu()
    
    this.setData({
      pattern: app.globalData.pattern,
      sum: app.globalData.sum,
      p_m: app.globalData.p_m,
      p_y: app.globalData.p_y,
      p_r_c: app.globalData.p_r_c,
      p_r_m: app.globalData.p_r_m,
      p_name: app.globalData.p_name,
      p_title: app.globalData.p_title,
      code: that.options.code,
      project: project,
      plan: plan
    })
    var token = wx.getStorageSync('token') ? wx.getStorageSync('token'):'';
    // var token = wx.getStorageSync('token');
    console.log(token);
    // var plan = 'oAtaaOecOjnZEJTYo1lS';
    // var project = 'yawsY8GbgtaH3c304qT2';
    // console.log(plan,project);
    var action = 'calculation';
    var num = this.data.sum;
    var sign = utilMd5.hexMD5(action + num + plan + project + randomstr + time);
    var data = {
      from: app.from,
      action: action,
      time: time,
      num: num,
      plan: plan,
      project: project,
      sign: sign
    };
    wx.request({
      url: app.host + action,
      method: 'get',
      data: data,
      dataType: 'json',
      // header: {
      //   token: token
      // },
      success(data) {
        if (data.data.code == 1) {
          console.log(data);
          that.setData({
           content:data.data.data.content,
            update_name: data.data.data.newgrade.name,
            current_name: data.data.data.mygrade.name,
            current_img:data.data.data.mygrade.img,
            update_img:data.data.data.newgrade.img,
            update:data.data.data.update,
            sum_money: data.data.data.plan.E_Money
          })
          that.calculate();
        }
      }
    })
    // if (token == "" || token == undefined) {
    //   token = util.checklogin();
    // } else {
    //   // this.calculate();
    // }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.getNetworkType({
      success: function(res) {
        console.log(res);
        if (res.networkType == 'none') {
          wx.showToast({
            icon: 'none',
            title: "当前网络不可用",
            success: function(res) {
              setTimeout(function() {
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
  onShow: function() {
    this.onLoad()
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
   * 展示列表
   */
  showList: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    if (id == 3) {
      return;
    }
    this.setData({
      hidden: id - 1
    })
  },
  /**
   * 选择列表
   */
  // select: function(e) {
  //   var id = e.currentTarget.dataset.id;
  //   var val = e.currentTarget.dataset.val;
  //   var index = e.currentTarget.dataset.index;
  //   this.data.pop[index].num = val;
  //   if (val == '1万') {
  //     this.data.pop[2].num = '10%';
  //   }
  //   if (val == '5万') {
  //     this.data.pop[2].num = '11%';
  //   }
  //   if (val == '10万') {
  //     this.data.pop[2].num = '12%';
  //   }
  //   if (val == '20万') {
  //     this.data.pop[2].num = '13%';
  //   }
  //   var fixedScale = this.data.pop[2].num;
  //   var rebate = this.data.pop[1].num;
  //   // 拿到计划金额进行运算
  //   var planCash = parseInt(this.data.pop[0].num);
  //   var yearRebate = planCash *10000 * parseInt(rebate) / 100;
  //   var yearCoupom = planCash *10000 * parseInt(fixedScale) / 100;
  //   var yearSum = yearRebate + yearCoupom;
  //   // 定义三个数组来获取计算结果
  //   var aarr = [];
  //   var barr = [];
  //   var darr = [];
  //   // 计算每个数组对应的值
  //   for (var i = 0; i < this.data.year.length; i++) {
  //     var a = this.data.year[i].cash,
  //       b = this.data.year[i].coupom,
  //       c = this.data.year[i].year,
  //       d = this.data.year[i].sum;
  //     a = yearRebate * c;
  //     b = yearCoupom * c;
  //     d = Number(a) + Number(b);
  //     aarr.push(a);
  //     barr.push(b);
  //     darr.push(d);
  //   }
  //   // 修改数组里的数据
  //   for (var j = 0; j < this.data.year.length; j++) {
  //     this.data.year[j].cash = aarr[j];
  //     this.data.year[j].coupom = barr[j];
  //     this.data.year[j].sum = darr[j];
  //   }
  //   this.setData({
  //     li: id,
  //     pop: this.data.pop,
  //     year: this.data.year,
  //     hidden: 3,
  //     rebate: rebate,
  //     fixedScale: fixedScale,
  //     planCash: planCash*10000
  //   })
  // },
  /**
   * 开始计算/开始动画
   */
  calculate: function() {
    var that = this;
    that.grade();
    var systemInfo = wx.getSystemInfoSync();
    console.log(that.data.content.length+'ok');
    for (var i = 0; i <= that.data.content.length; i++) {
      (function(i) {
        setTimeout(function() {
          that.animation.translate(-750 / 750 * systemInfo.windowWidth, 0).step();
          if (i == that.data.content.length) {
            that.pageScrollToBottom();
            that.setData({
              changeOther: false
            })
          } else {
            that.setData({
              changeOther: true
            })
          }
          that.setData({
            animation: that.animation.export(),
            cartoon: i
          })
        }, i * 1000)
      })(i)
    }
    this.setData({
      hide: true
    })
  },
  /**
   * 弹出弹窗
   */
  showPop: function() {
    var that = this;
    var systemInfo = wx.getSystemInfoSync();
    for (var i = 0; i <= that.data.content.length; i++) {
      (function(i) {
        setTimeout(function() {
          that.animation.translate(750 / 750 * systemInfo.windowWidth, 0).step(0);
          if (i == that.data.content.length) {
            that.pageScrollToTop();
          }
          that.setData({
            animation: that.animation.export(),
            cartoon: i
          })
        }, i * 0)
      })(i)
    }
    // this.setData({
    //   hide: false,
    //   hidden: 3,
    // })
  },
  mytoast: function() {
    wx.showToast({
      icon: 'none',
      title: '本次计算没结束，请稍等',
    })
  },
  /**
   * 页面滚动到底部
   */
  pageScrollToBottom: function() {
    wx.createSelectorQuery().select('.cal-page').boundingClientRect(function(rect) {
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },
  /**
   * 页面回到顶部
   */
  pageScrollToTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  exitpattern: function() {
    util.exitpattern();
  },
  /**
   * 请求数据判断等级
   */
  grade: function() {
    var that = this;
    that.animation = wx.createAnimation();
    if (that.data.update == -1) {
          that.setData({
            update_model: false
          })
        } else {
          that.setData({
            update_model: true
          })
        }
  },
  /**
   * 更改分数
   */
  changeNum: function() {
    
    this.showPop();
    // getApp().globalData.pproject = this.data.project;
    // getApp().globalData.plan = this.data.plan;
    // getApp().globalData.p_r_m = this.data.p_r_m;
    // getApp().globalData.p_r_c = this.data.p_r_c;
    // getApp().globalData.p_name = this.data.p_name;
    // getApp().globalData.p_title = this.data.p_title;
    // console.log(this.data); return;
    wx.navigateTo({
      url: '/pages/project/changeNum/changeNum?p_m=' + this.data.p_m + '&p_y=' + this.data.p_y + '&p_r_c=' + this.data.p_r_c + '&p_r_m=' + this.data.p_r_m + '&p_name=' + this.data.p_name + '&p_title=' + this.data.p_title + '&plan=' + this.data.plan +'&project=' + this.data.project +'&sum='+this.data.sum,
    })
  }
  ,
  /**
   * 返回当前页并刷新
   */
  changeData: function () {
    var options = {}
    this.onShow(options);//最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
  },
})