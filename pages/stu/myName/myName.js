// pages/stu/myMobile/myMobile.js
var main = require('../../../utils/main.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var name = options.name;
    this.setData({
      id: id,
      name: name
    })

  },
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  editName: function () {
    var that = this;
    if (this.data.name.length == 0) {
        this.setData({
          focus1: true
        })
       
    } else {
        wx.request({
          url: main.localUrl + 'mobileXcx/editCpc', //仅为示例，并非真实的接口地址
          data: {
            cpcId: that.data.id,
            name: that.data.name,
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
              beforePage.data.cpc.name = that.data.name;
              app.globalData.cpc = beforePage.data.cpc;
              beforePage.onLoad();
              wx.navigateBack();  //返回上个页面
            }, 2000)

          }
        })
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