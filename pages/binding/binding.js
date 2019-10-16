// pages/teacher/shouquan/souquan.js
var main = require('../../utils/main.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendmsg: "classCurr_view_but",
    getmsg: "获取验证码",
    timer: 1,
    code: "",
    mobile: '',
    sendCode: "",
    cpc_card:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  inputCard: function (e) {
    this.setData({
      cpc_card: e.detail.value
    })
  },

  binding:function(){
    var openId = app.globalData.openId;
    var that = this

    // if (this.data.mobile.length == 0 || this.data.sendCode.length == 0 || this.data.cpc_card.length == 0) {
    //   if (this.data.mobile.length == 0) {
    //     this.setData({
    //       focus1: true
    //     })
    //   } else {
    //     if (this.data.sendCode.length == 0) {
    //       this.setData({
    //         focus2: true
    //       })
    //     }else{
    //       if (this.data.cpc_card.length == 0) {
    //         this.setData({
    //           focus3: true
    //         })

    //       }
    //     }
    //   }
    // } else {
    if (this.data.cpc_card.length == 0) {
        this.setData({
          focus1: true
        })

    } else {
      
      wx.request({
        url: main.localUrl + 'mobileXcx/bindingOpenId', //仅为示例，并非真实的接口地址
        data: {
          crm_code: main.crm_code,
          openId: openId,
          type:1,
          mobile: that.data.mobile,
          sms_code: that.data.sendCode,
          card_code: that.data.cpc_card,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          //为绑定，跳转绑定页面
          if (res.data.succeed != "000") {
            wx.showToast({
              title: res.data.sucInfo,
              icon: 'none',
              duration: 2000
            })

          } else {
            if (res.data.dataInfo.cpc != null) {
              app.globalData.cpc = res.data.dataInfo.cpc;
            }
            wx.navigateTo({
              url: '../stu/home/home'
            })
          }
        }
      })
    }

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
    } else {
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
   
  
})

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