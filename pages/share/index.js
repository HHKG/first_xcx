// pages/index/index.js
var app = getApp();
//console.log(app)
var utilMd5 = require('../../utils/md5.js');
Page({
  data: {
    sharebg: '/images/service_banner.png', // 分享底部背景图
    shareTitle: '哈哈哈男孩从小就没有地位，看来一万个心酸哈哈哈男孩从小就没有地位，看来一万个心酸', // 分享标题
    shareCoverImg: '/images/place7.png', // 分享封面图
    shareQrImg: '/images/service_banner.png', // 分享小程序二维码
    userInfo: {
      headImg: '/images/small_check_icon.png', //用户头像
      nickName: '打豆豆', // 昵称
    },
    seeDate: '2018-12-04', //看视频日期
  },
  onLoad: function (options) {
    
  },
  downloadImg:function(){
    let that = this;
    // 创建画布
    const ctx = wx.createCanvasContext('shareCanvas')
    // 白色背景
    console.log(ctx);
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, 300, 380)
    ctx.draw()
    // 下载底部背景图
    wx.getImageInfo({
      src: that.data.sharebg,
      success: (res1) => {
        ctx.drawImage(res1.path, 0, 250, 300, 130)
        // 下载视频封面图
        wx.getImageInfo({
          src: that.data.shareCoverImg,
          success: (res2) => {
            ctx.drawImage(res2.path, 0, 0, 300, 168)
            // 分享标题
            // ctx.setTextAlign('center')    // 文字居中
            ctx.setFillStyle('#000')  // 文字颜色：黑色
            ctx.setFontSize(20)         // 文字字号：20px
            if (that.data.shareTitle.length <= 14) {
              // 不用换行
              ctx.fillText(that.data.shareTitle, 10, 200, 280)
            } else if (that.data.shareTitle.length <= 28) {
              // 两行
              let firstLine = that.data.shareTitle.substring(0, 14);
              let secondLine = that.data.shareTitle.substring(14, 27);
              ctx.fillText(firstLine, 10, 200, 280)
              ctx.fillText(secondLine, 10, 224, 280)
            } else {
              // 超过两行
              let firstLine = that.data.shareTitle.substring(0, 14);
              let secondLine = that.data.shareTitle.substring(14, 27) + '...';
              ctx.fillText(firstLine, 10, 200, 280)
              ctx.fillText(secondLine, 10, 224, 280)
            }
 
            // 下载二维码
            wx.getImageInfo({
              src: that.data.shareQrImg,
              success: (res3) => {
                let qrImgSize = 70
                ctx.drawImage(res3.path, 212, 256, qrImgSize, qrImgSize)
                ctx.stroke()
                ctx.draw(true)
 
                // 用户昵称
                ctx.setFillStyle('#000')  // 文字颜色：黑色
                ctx.setFontSize(14) // 文字字号：16px
                ctx.fillText(that.data.userInfo.nickName, 38, 284)
                // 观看日期
                ctx.setFillStyle('#999')  // 文字颜色：黑色
                ctx.setFontSize(10)       // 文字字号：16px
                ctx.fillText('在' + that.data.seeDate + '观看这个视频', 38, 298)
 
                // 下载用户头像
                wx.getImageInfo({
                  src: that.data.userInfo.headImg,
                  success: (res4) => {
                    // 先画圆形，制作圆形头像(圆心x，圆心y，半径r)
                    ctx.arc(22, 284, 12, 0, Math.PI * 2, false)
                    ctx.clip()
                    // 绘制头像图片
                    let headImgSize = 24
                    ctx.drawImage(res4.path, 10, 272, headImgSize, headImgSize)
                    // ctx.stroke() // 圆形边框
                    ctx.draw(true)
 
                    // 保存到相册
                    wx.canvasToTempFilePath({
                      canvasId: 'shareCanvas',
                      success: function (res) {
                        wx.saveImageToPhotosAlbum({
                          filePath: res.tempFilePath,
                          success: function (res) {
                            wx.showToast({
                              title: '分享图片已保存到相册'
                            })
                          }
                        })
                      }
                    }, this)
                  }
                })
              }
            })
          }
        })
      }
    })
  }
})
