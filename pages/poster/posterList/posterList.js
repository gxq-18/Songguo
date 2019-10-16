//index.js
var main = require('../../../utils/main.js');
//获取应用实例
var app = getApp();
Page({
  data: {
    animationData: {},
    cardInfoList: [],
    actionSheetHidden2: true,
    maskHidden: true,
    bgWidth: 750,
    bgHeight: 1600,
    bgImg: "", //海报地址
    avatarUrl: "",//头像地址
    xcxImg: "",//小程序远程地址
  },
  //事件处理函数
  slidethis: function (e) {
    var that = this;

    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'cubic-bezier(.8,.2,.1,0.8)',
    });
    var self = this;
    this.animation = animation;
    this.animation.translateY(-420).rotate(-5).translateX(0).step();
    this.animation.translateY(62).translateX(25).rotate(0).step();
    this.setData({
      animationData: this.animation.export()
    });
    setTimeout(function () {
      var cardInfoList = self.data.cardInfoList;
      var slidethis = self.data.cardInfoList.shift();
      self.data.cardInfoList.push(slidethis);
      //获取海报宽高
      wx.getImageInfo({
        src: self.data.cardInfoList[0],
        success: function (res) {
          var ht = res.height;
          // if(ht>1600){
          //   ht=1600;
          // }
          // console.log(ht);
          that.setData({
            bgWidth: res.width,
            bgHeight: ht,
            bgImg: self.data.cardInfoList[0],
          })
        }
      })
     
      self.setData({
        cardInfoList: self.data.cardInfoList,
        animationData: {},
      });
    }, 350);
  },

  onLoad: function () {
    console.log('onLoad');
    var that = this;
    //获取菜单图片
    wx.request({
      url: main.localUrl + 'mobileXcx/initialization', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) { 
        app.globalData.posterList = res.data.dataInfo.posterList;
        that.setData({
          cardInfoList: app.globalData.posterList,
          bgImg: app.globalData.posterList[0],
        })
        //获取海报宽高
        wx.getImageInfo({
          src: app.globalData.posterList[0],
          success: function (res) {
            var ht = res.height;
            // if (ht > 1600) {
            //   ht = 1600;
            // }
            that.setData({
              bgWidth: res.width,
              bgHeight: ht,
            })
          }
        })
      }
    })
   
    // //下载小程序二维码
    // wx.downloadFile({
    //   url: app.globalData.qrcode, //仅为示例，并非真实的资源
    //   success: function (res) {
    //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    //     if (res.statusCode === 200) {
    //       //  绘制图片模板的 底图
    //       that.setData({
    //         xcxImg: res.tempFilePath,
    //       })
    //     }
    //   }
    // })

  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    this.slidethis();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '分享得好礼',
      path: '/pages/poster/posterList/posterList',
      imageUrl: that.data.cardInfoList[0],
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }  
    }
  },
  // 分享
  onGotUserInfo: function (e) {
    var that = this;
    var userInfo = e.detail.userInfo;
    app.globalData.userInfo = e.detail.userInfo;
    if (e.detail.userInfo!=null){
      //下载用户头像
      wx.downloadFile({
        url: app.globalData.userInfo.avatarUrl, //仅为示例，并非真实的资源
        success: function (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            //  绘制图片模板的 底图
            that.setData({
              avatarUrl: res.tempFilePath,
            })
          }
        }
      })


      //获取openid
      wx.login({
        success: function (res) {
          if (res.code) {
            //获取openId
            wx.showLoading({ mask: true });
            wx.request({
              url: main.localUrl + 'mobileXcx/getOpenId', //仅为示例，并非真实的接口地址
              data: {
                code: res.code
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (openIdRes) {
                console.log(openIdRes);
                // 判断openId是否获取成功
                if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                  // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
                  console.info("登录成功返回的openId：" + openIdRes.data.openid);
                  app.globalData.openId = openIdRes.data.openid;

                  that.actionSheetChange2();

                }
                wx.hideLoading();
              }
            })
          }
        }
      });
    }

  },
  actionSheetChange2: function (e) {
    this.setData({
      actionSheetHidden2: !this.data.actionSheetHidden2
    })
  },
  // 以下是绘制图片
  // 绘制头像
  setIcon: function (context) {
    var that = this;
    // 绘制头像
    context.save();
    let r = 45;
    let d = r * 2;
    let cx = 30;
    // let cy = that.data.bgHeight-172;
    let cy = 25;
     context.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
     context.clip();
     context.drawImage(this.data.avatarUrl, cx, cy, d, d);
     context.restore();
  },
  //  绘制海报图片
  setImagePic: function (context) {
    var that = this;
    context.clearRect(0, 0, 0, 0);
    const WIDTH = that.data.bgWidth;
    // const HEIGHT = that.data.bgHeight-210;
    const HEIGHT = that.data.bgHeight;
    //  绘制图片模板的 底图
    context.drawImage(this.data.bgImg, 0, 0, WIDTH, HEIGHT);
    // //  绘制图片模板的 banner图
    // context.drawImage("http://p7mq9gjza.bkt.clouddn.com/1524472725265.jpg", 40, 40, 750, 580);
  },
  setLeftText: function (context) {
    var that = this;
    //  绘制二维码右边说明
    context.setTextAlign('left');
    context.setFontSize(30);
    context.setFillStyle('rgba(42,69,119,1)');
    // context.fillText("我已加入", 150, that.data.bgHeight-150); 
    // context.fillText('邀请你一起学习', 150, that.data.bgHeight-115);
    context.fillText("我已加入", 150, 50);
    context.fillText('邀请你一起学习', 150,100);

  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {

    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    var path = "../../../image/poster.png";

    
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0, that.data.bgWidth, that.data.bgHeight);
    //context.draw(true);
    //context.draw();
    this.setImagePic(context);//绘制图片
    this.setLeftText(context);//绘制二维码右侧文字
    this.setIcon(context);//绘制头像

    // 小程序码
    // const qrImgSize = 140
    // context.drawImage("../../../image/xcx.jpg", that.data.bgWidth-150, that.data.bgHeight-194, qrImgSize, qrImgSize)
 
    //绘制图片
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
  
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
          wx.hideLoading();
          wx.previewImage({
            current: tempFilePath, // 当前显示图片的http链接
            urls: [tempFilePath] // 需要预览的图片http链接列表
          })
          that.actionSheetChange2();
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 1000);
  },
  // //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.cardInfoList[0]
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  formSubmit: function (e) {
    console.log(e);
    wx.showLoading({ title: '图片生成中...',mask: true });

    var that = this;
   
      //海报图片
      wx.downloadFile({
        url: that.data.bgImg, //仅为示例，并非真实的资源
        success: function (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            //  绘制图片模板的 底图
            that.setData({
              bgImg: res.tempFilePath
            })
            that.createNewImg();
            
          }
        }
      })
  

  },

})
