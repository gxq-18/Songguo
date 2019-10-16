// pages/student/login/login.js
var main = require('../../utils/main.js');
//获取应用实例
const app = getApp()

Page({

  data: {
    phone: '',
    password: '',
    focus1:false,
    focus2: false
  },

  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  binding: function () {
    var openId = app.globalData.openId;
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      if (this.data.phone.length == 0) {
        this.setData({
          focus1: true
        })
      } else {
        if (this.data.password.length == 0) {
          this.setData({
            focus2: true
          })
        }
      }
    } else {
      var that = this
      wx.request({
        url: main.localUrl + 'mobileXcx/bindingOpenId', //仅为示例，并非真实的接口地址
        data: {
          crm_code: main.crm_code,
          openId: openId,
          type: 0,
          account_code: that.data.phone,
          account_pwd: that.data.password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //为绑定，跳转绑定页面
          if (res.data.succeed != "000") {
            wx.showToast({
              title: res.data.sucInfo,
              icon: 'none',
              duration: 2000
            })

          } else {
            if (res.data.dataInfo.tea != null) {
              app.globalData.teacher = res.data.dataInfo.tea;
            }
            wx.reLaunch({
              url: '../teacher/home/home'
            })
          }
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.shouquan();
    this.setData({
      userInfo: app.globalData.userInfo
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
 
})