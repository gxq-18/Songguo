// pages/stu/activityView/activityView.js
var main = require('../../../utils/main.js');
var WxParse = require('../../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0, 
    ishb:true,
    isPay:true,
    actionSheetHidden2: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var isPay = options.isPay;
    if (options.scene) {
      // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
      var scene = decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      id = scene;
      this.setData({
        ishb: false,
        isPay:0
      })
    }else{
      this.setData({
        isPay: isPay
      })
    }
  
    if (id != null && id != ""){
      findView(id, (data) => {
        if (null != data.poster_url && "" != data.poster_url){
          console.log(data.poster_url);
          //获取海报宽高
          wx.getImageInfo({
            src: data.poster_url,
            success: function (res) {
              var ht = res.height;
              // if(ht>1600){
              //   ht=1600;
              // }
              // console.log(ht);
              that.setData({
                bgWidth: res.width,
                bgHeight: ht,
                bgImg: data.poster_url,
              })
            }
          })
        
        }
        that.setData({
          model: data,
        })
        /**
       * html解析示例
       */
        WxParse.wxParse('article', 'html', data.content, that, 5);
      })
   }else{
      that.home();
   }
   
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
      title: this.data.model.title,
    }
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例  
    var viewWidth = 750,           //设置图片显示宽度，  
      viewHeight = 750 / ratio;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },
  pay: function (e) {
    var that = this;
    var userInfo = e.detail.userInfo;
    app.globalData.userInfo = e.detail.userInfo;
    if (userInfo!=null){
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
                wx.hideLoading();
                // 判断openId是否获取成功
                if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                  // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
                  console.info("登录成功返回的openId：" + openIdRes.data.openid);
                  app.globalData.openId = openIdRes.data.openid;

                  wx.navigateTo({
                    url: "../activityPay/activityPay?id=" + that.data.model.id,
                  })

                }
              }
            })
          }
        }
      });
    }
    
  },
  telPhone: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.mobile //仅为示例，并非真实的电话号码
    })
  },
  // 分享
  onGotUserInfo: function (e) {
    var that = this;
    var userInfo = e.detail.userInfo;
    app.globalData.userInfo = e.detail.userInfo;
    if (e.detail.userInfo != null) {
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
    }else{
      that.actionSheetChange2();
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
    let r = 75;
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
    context.fillText("我已加入", 180, 70);
    context.fillText('邀请你一起学习', 180, 120);

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
    const qrImgSize = 170
    context.drawImage(that.data.xcxUrl, 50, that.data.bgHeight-194, qrImgSize, qrImgSize)

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
    var that = this;
    wx.showLoading({ title: '海报生成中', mask: true });

    wx.request({
      url: main.localUrl + 'mobileXcx/getminiqrQr', //仅为示例，并非真实的接口地址
      data: { scene: that.data.model.id},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.imgurl);
        //下载小程序码
        wx.downloadFile({
          url: res.data.imgurl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              //  绘制图片模板的 底图
              that.setData({
                xcxUrl: res.tempFilePath,
              })
            }
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
          }
        })
      
      }
    })

    // var that = this;

    
  },
  home:function(){
    wx.switchTab({
      url: '../../index/index'
    })
  }
})


function findView(id, data) {
  wx.request({
    url: main.localUrl + 'mobileXcx/stuActivityById', //仅为示例，并非真实的接口地址
    data: {
      id: id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      data(res.data.dataInfo.act);
    }
  })
}