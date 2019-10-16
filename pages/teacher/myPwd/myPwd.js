// pages/stu/myPwd/myPwd.js
var main = require('../../../utils/main.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  id:"",
  pwd:"",
  pwdOld:"",
  pwdNew:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var pwd = options.pwd;
    this.setData({
      id: id,
      pwd: pwd
    })
  },
  inputOld: function (e) {
    this.setData({
      pwdOld: e.detail.value
    })
  },
  inputNew: function (e) {
    this.setData({
      pwdNew: e.detail.value
    })
  },
  editPwd: function () {
    var that = this;

    if (this.data.pwdOld.length == 0 || this.data.pwdNew.length == 0) {
      if (this.data.pwdOld.length == 0) {
        this.setData({
          focus1: true
        })
      } else {
        if (this.data.pwdNew.length == 0) {
          this.setData({
            focus2: true
          })
        }
      }
    } else {
      //判断验证码
      if (that.data.pwd != that.data.pwdOld) {
        wx.showToast({
          title: '原密码不正确',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      } else {
        wx.request({
          url: main.localUrl + 'mobileXcx/editTeacher', //仅为示例，并非真实的接口地址
          data: {
            tId: that.data.id,
            pwd: that.data.pwdNew,
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
              beforePage.data.teacher.login_pwd = that.data.pwdNew;
              app.globalData.teacher = beforePage.data.teacher;
              beforePage.onLoad();
              wx.navigateBack();  //返回上个页面
            }, 2000)

          }
        })
      }
    }
  },
})