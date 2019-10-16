// pages/stu/activityPay/activityPay.js
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    nocancel: false,
   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //将字符串转换成对象
    var bean = JSON.parse(options.model);
    this.setData({
      model: bean
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

  },
  cancel: function () {
    this.setData({
      hidden: false
    });
  },
  confirm: function () {
    this.setData({
      hidden: true
    });
    var pages = getCurrentPages(); // 当前页面  
    var beforePage = pages[pages.length - 2]; // 前一个页面
    beforePage.backLoad();
    wx.navigateBack();  //返回上个页面
  },
  
  
  //统一支付
  onPay: function (e) {
    var that = this;

    //调取支付,添加订单
    wx.request({
      url: main.localUrl + 'mobileXcx/orderPay', //仅为示例，并非真实的接口地址
      data: {
        catId:that.data.model.id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.succeed == "000") {
          //吊起支付
          wx.request({
            url: main.localUrl + 'mobileXcx/wxPay',
            data: {
              openid: app.globalData.openId,
              title: that.data.model.ca.title,
              catId: that.data.model.id
            },
            method: 'GET',
            success: function (res) {
              console.log(res);
              doWxPay(res, (payState) => {
                if (payState) {
                  that.sendMessage(e.detail.formId, app.globalData.openId, that.data.model.ca.title)
                  that.cancel();
                } else {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'loading',
                    duration: 2000
                  });
                }
              })
            }
          });  
        }
      }
    })
  },
  sendMessage: function (formId, openId, title) {

    //获取accessToken
    wx.request({
      url: main.localUrl + 'mobileXcx/accessToken', //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var accessToken = res.data.dataInfo.accessToken;
        console.log(accessToken);
        //发送消息
        var l = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + accessToken;
        var d = {
          touser: openId,
          template_id: 'Fs6nTh5OLSjL_F_iznhmRA5fGcYot3liXH39xeeEWNE',//这个是1、申请的模板消息id，  
          page: '/pages/stu/myActivity/myActivity',
          form_id: formId,
          data: {
            "keyword1": {
              "value": title,
              "color": "#172177"
            },
            "keyword2": {
              "value": util.formatTime(new Date()),
              "color": "#9b9b9b"
            },
            "keyword3": {
              "value": "活动购买成功,如有疑问请联系我们。",
              "color": "#9b9b9b"
            }
          }
          //, emphasis_keyword: 'keyword1.DATA' //模板需要放大的关键词

        }
        wx.request({
          url: l,
          data: d,
          method: 'POST',
          success: function (res) {
            console.log("push msg");
            console.log(res);
          },
          fail: function (err) {
            // fail  
            console.log("push err")
            console.log(err);
          }
        });
      }
    })
  },
  // 以下是微信支付


})


//发起支付
function doWxPay(param, payState) {
  //小程序发起微信支付  
  wx.requestPayment({
    timeStamp: param.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了  
    nonceStr: param.data.nonceStr,
    package: param.data.package,
    signType: 'MD5',
    paySign: param.data.paySign,
    success: function (event) {
      // success     
      console.log(event);

      payState(true);
    },
    fail: function (error) {
      // fail     
      console.log("支付失败")
      console.log(error)
      payState(false);
    },
    complete: function () {
      // complete     
      console.log("pay complete")
    }
  });
}  