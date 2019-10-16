// pages/stu/myMobile/myMobile.js
var main = require('../../../utils/main.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthday: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var birthday = options.birthday;
    this.setData({
      id: id,
      birthday: birthday
    })

  },
  inputBirthday: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  editBirthday: function () {
    var that = this;

    if (this.data.birthday.length == 0) {
        this.setData({
          focus1: true
        })
      }else{ 
    
        wx.request({
          url: main.localUrl + 'mobileXcx/editCpc', //仅为示例，并非真实的接口地址
          data: {
            cpcId: that.data.id,
            birthday: that.data.birthday,
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
              beforePage.data.cpc.birthday = that.data.birthday;
              app.globalData.cpc = beforePage.data.cpc;
              beforePage.onLoad();
              wx.navigateBack();  //返回上个页面
            }, 2000)

          }
        })
      }
  },

})