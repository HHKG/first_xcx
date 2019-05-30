// pages/project/changeNum/changeNum.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sum:'',
    p_m: '',
    p_y: '',
    p_r_c: '',
    p_r_m: '',
    p_name: '',
    p_title: '',
    project:'',
    plan:''
    // cases_content:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(options);
   var p_m= options.p_m,
     p_r_c=options.p_r_c,
     p_r_m= options.p_r_m,
     p_y=options.p_y,
     p_name= options.p_name,
     p_title=options.p_title,
     project=options.project,
     plan=options.plan,
     sum=options.sum;
    this.setData({
      p_m: p_m,
      p_y: p_y,
      p_r_c: p_r_c,
      p_r_m: p_r_m,
      p_name: p_name,
      p_title: p_title,
      sum:sum
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
  ,
  /**
   * 马上测算
   */
  tocalculate:function(){
    getApp().globalData.sum = this.data.sum;
    var pages = getCurrentPages();//当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      var currPage = pages[pages.length - 1]; // 当前页面，若不对当前页面进行操作，可省去
      beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步
        // id: res.data.data
      })
      beforePage.changeData();//触发父页面中的方法
    }
    wx.navigateBack({
      delta: 1
    })
  
    // wx.redirectTo({
    //   url: '/pages/project/calculate/calculate'
    // })
  }
  ,
  /**
   * 不更改份数
   */
  tocansel:function(){
    
    wx.navigateBack({
      url: '/pages/project/calculate/calculate'
    })
  }
  ,
  /**
   * 获取份数
  */
  getSum:function(e){
    var sum=e.detail.value;
    this.setData({
      sum:sum
    })
  }
})