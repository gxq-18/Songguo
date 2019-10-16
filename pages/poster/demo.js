// pages/main/index.js
var main = require('../../utils/main.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    imagePath: "",
    maskHidden: true,
    bgImg :"", //海报地址
    avatarUrl:"",//头像地址
    xcxImg:"",//小程序远程地址

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    //海报图片
    wx.downloadFile({
      url: 'http://p7mq9gjza.bkt.clouddn.com/1524472725265.jpg', //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          //  绘制图片模板的 底图
          that.setData({
            bgImg: res.tempFilePath,
          })
        }
      }
    })

  },
  onReady: function () {
    // 页面渲染完成


  },
  onShow: function () {

    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭

  },
  // 绘制头像
  setIcon: function (context) {

    // 绘制头像
    context.save();
    let r = 32;
    let d = r * 2;
    let cx = 62;
    let cy = 1172;
    context.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
    context.clip();
    context.drawImage(app.globalData.userInfo.avatarUrl, cx, cy, d, d);
    context.restore();
  },
//  绘制海报图片
  setImagePic: function (context) {
    context.clearRect(0, 0, 0, 0);
    const WIDTH = 750;
    const HEIGHT = 1134;

    //  绘制图片模板的 底图
    context.drawImage(this.data.bgImg, 0, 0, WIDTH, HEIGHT);
    // //  绘制图片模板的 banner图
    // context.drawImage("http://p7mq9gjza.bkt.clouddn.com/1524472725265.jpg", 40, 40, 750, 580);
  },
  setLeftText: function (context){
    //  绘制二维码右边说明
    context.setTextAlign('left')
    context.setFontSize(28);
    context.setFillStyle('rgba(34,34,34,.64)')
    context.fillText('分享的好礼', 170, 1174);
    context.fillText(app.globalData.userInfo.nickName + '邀你加入Aters', 170, 1230);
  
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {

    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    var path = "../../image/poster.png";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, 750, 1344);
    //context.draw(true);
    //context.draw();
    this.setIcon(context);//绘制头像
    this.setImagePic(context);//绘制图片
    this.setLeftText(context);//绘制二维码右侧文字

    // 小程序码
    const qrImgSize = 150
    context.drawImage("../../image/xcx.png", 550, 1150, qrImgSize, qrImgSize)

    //绘制图片
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
            imagePath: tempFilePath,
            canvasHidden:true
          });
           wx.previewImage({
             current: tempFilePath, // 当前显示图片的http链接
             urls: [tempFilePath] // 需要预览的图片http链接列表
          })
          
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 2000);
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  formSubmit: function (e) {
    var that = this;
    var userInfo = e.detail.userInfo;

    app.globalData.userInfo = e.detail.userInfo;
    wx.showToast({
      title: '装逼中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)

  }

})