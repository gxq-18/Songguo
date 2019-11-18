// pages/stu/myMobile/myMobile.js
var main = require('../../../utils/main.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendmsg: "classCurr_view_but",
    getmsg: "获取验证码", 
    timer : 1,
    code: "",
    mobile:'',
    sendCode:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var mobile = options.mobile;
    this.setData({
      id:id,
      mobile:mobile
    })

  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '手机号'
    });
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
            timer:0
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
  editMobile:function(){
    var that = this;

    if (this.data.mobile.length == 0) {
      if (this.data.mobile.length == 0) {
      this.setData({
        focus1: true
      })
    } 
  }else{
    //   //判断验证码
    //   if (that.data.sendCode != that.data.code){
    //     wx.showToast({
    //       title: '验证码不正确',
    //       icon: 'none',
    //       duration: 2000,
    //       mask: true
    //     })
    //  }else{
        wx.request({
          url: main.localUrl + 'mobileXcx/editTeacher', //仅为示例，并非真实的接口地址
          data: {
            tId: that.data.id,
            mobile: that.data.mobile,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
              mask: true
            })
            setTimeout(function () {
              //成功
              var pages = getCurrentPages(); // 当前页面  
              var beforePage = pages[pages.length - 2]; // 前一个页面
              beforePage.data.teacher.mobile=that.data.mobile;
              app.globalData.teacher = beforePage.data.teacher;
              beforePage.onLoad();
              wx.navigateBack();  //返回上个页面
            }, 2000)
          
          }
        })
     }
  // }
 },

})

function getSmsCode(mobile,data){

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