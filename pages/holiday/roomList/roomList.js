// pages/holiday/roomList/roomList.js
// pages/holiday/roomList/hotalDetail/hotalDetail.js
var app = getApp();
var utilMd5 = require('../../../utils/md5.js');
var util = require('../../../utils/util.js');
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
    phoneNumber: "400-990-8830",
    id:'',
    version: app.globalData.version
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    var that = this;
    that.setData({
      id:options.id
    })
    console.log(12341654136);
  
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
   * 拨打客服电话
   */
  callQian:function(){
    var that = this;
    // 呼叫联系人
    wx.showActionSheet({
      itemList: ['呼叫','添加联系人'],
      success:function(res){
       if(res.tapIndex==0){
         wx.makePhoneCall({
           phoneNumber: '400-990-8830',
         })
       }
      //  添加联系人
        if (res.tapIndex == 1){
          wx.addPhoneContact({
            firstName: '虔心荟',
            phoneNumber:that.data.phoneNumber,
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
  gotoFree: function (e) {
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/holiday/free/free?id='+id,
    })
  }
  ,
  /**
   * 跳转到酒店详情
   */
  gotoDetail:function(e){
   var id=e.currentTarget.dataset.id;
   if(id==0){
     wx.navigateTo({
       url: '/pages/holiday/roomList/hotalDetail/hotalDetail',
     })
   }
   if(id==1){
     wx.navigateTo({
       url: '/pages/holiday/roomList/detailFour/detailFour',
       
     })
   }
    if (id == 2) {
      wx.navigateTo({
        url: '/pages/holiday/roomList/detailThree/detailThree',
      })
    }
    if (id == 3) {
      wx.navigateTo({
        url: '/pages/holiday/roomList/detailTwo/detailTwo',
      })
    }
    if (id == 4) {
      wx.navigateTo({
        url: '/pages/holiday/roomList/detailOne/detailOne',
      })
    }
    if (id == 5) {
      wx.navigateTo({
        url: '/pages/holiday/roomList/detailFive/detailFive',
      })
    }

  }
})