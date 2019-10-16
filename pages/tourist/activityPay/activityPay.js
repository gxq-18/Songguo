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
    pay_user:"",
    sendmsg: "classCurr_view_but",
    getmsg: "获取验证码",
    timer: 1,
    code: "",
    userName:'',
    mobile: '',
    sendCode: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;

    findView(id, (data) => {
      var pay_user = "";
      var caType = data.ca_type;
      if (caType = 1)
        pay_user = "购买人姓名";
      if (caType = 2)
        pay_user = "报名人姓名";


      that.setData({
        model: data,
        pay_user: pay_user,
      })
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
    wx.navigateBack();  //返回上个页面
  },
  inputUser: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  inputMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  inputSendCode: function (e) {
    this.setData({
      sendCode: e.detail.value
    })
  },

  /** 
 * 获取短信验证码 
 */
  sendmessg: function (e) {
    var that = this;
    if (this.data.mobile.length == 0) {
      this.setData({
        focus1: true
      })
    }else{
      if (that.data.timer == 1) {
        getSmsCode(that.data.mobile, (data) => {
          console.log(data.dataInfo.code);
          that.setData({
            code: data.dataInfo.code,
          })
        })
        that.data.timer == 0;
        var time = 60
        that.setData({
          sendmsg: "sendmsgafter",
        })
        var inter = setInterval(function () {
          that.setData({
            getmsg: time + "s后重发",
            timer: 0
          })
          time--
          if (time < 0) {
            that.data.timer = 1
            clearInterval(inter)
            that.setData({
              sendmsg: "classCurr_view_but",
              getmsg: "获取验证码",
              timer: 1
            })
          }
        }, 1000)
      }
    }
  },
  
  //报名
  onPayCas: function (e) {
    var that = this;

    if (this.data.userName.length == 0 || this.data.mobile.length == 0 ) {
      if (this.data.userName.length == 0) {
        this.setData({
          focus3: true
        })
      } else {
        if (this.data.mobile.length == 0) {
          this.setData({
            focus1: true
          })
        } 
        // else {
        //   if (this.data.sendCode.length == 0) {
        //     this.setData({
        //       focus2: true
        //     })
        //   }
        // }
      }
    } else {
      // //判断验证码
      // if (that.data.sendCode != that.data.code) {
      //   wx.showToast({
      //     title: '验证码不正确',
      //     icon: 'none',
      //     duration: 2000,
      //     mask: true
      //   })
      // } else {

        // 调取支付,添加订单
        wx.request({
          url: main.localUrl + 'mobileXcx/onPayCas', //仅为示例，并非真实的接口地址
          data: {
            crm_code: main.crm_code,
            school_code: main.crm_code,
            openId: app.globalData.openId,
            ca_id: that.data.model.id,
            user_name: that.data.userName,
            user_mobile: that.data.mobile,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data.succeed == "000") {
              //判断是否需要支付，
              if (that.data.model.is_pay == 1) {
                wx.request({
                  url: main.localUrl + 'mobileXcx/wxPay',
                  data: { 
                    openid: app.globalData.openId,
                    title: that.data.model.title,
                    catId: res.data.dataInfo.catId
                  },
                  method: 'GET',
                  success: function (res) {
                    console.log(res);
                    doWxPay(res, (payState) => {
                      if (payState){

                        that.sendMessage(e.detail.formId, app.globalData.openId, that.data.model.title)
                        that.cancel();
                      }else{
                        wx.showToast({
                          title: '支付失败',
                          icon: 'loading',
                          duration: 2000
                        });
                      }
                    })
                  }
                });  
              } else {
                that.cancel();
              }
            }
          }
        })
      }
    // }
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
          page: '/pages/tourist/myActivity/myActivity',
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

function getSmsCode(mobile, data) {

  wx.request({
    url: main.localUrl + 'mobileXcx/getSmsCode', //仅为示例，并非真实的接口地址
    data: {
      mobile: mobile,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      data(res.data)
    }
  })
}

  //发起支付
  function doWxPay(param,payState) {
    
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
        console.log("支付成功")
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