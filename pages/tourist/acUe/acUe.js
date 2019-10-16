// pages/tourist/acUe/acUe.js
var main = require('../../../utils/main.js');
var WxParse = require('../../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //初始化接口
    wx.request({
      url: main.localUrl + 'mobileXcx/initialization', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        app.globalData.menuList = res.data.dataInfo.menuList;
        app.globalData.posterList = res.data.dataInfo.posterList;
        app.globalData.qrcode = res.data.dataInfo.qrcode;
        app.globalData.mobile = res.data.dataInfo.phone;
        app.globalData.acList = res.data.dataInfo.acList;
      }
    })

    var acList = app.globalData.acList;
    var alias = options.alias;
    for (var i = 0; i < acList.length; i++) {
      if (acList[i][0] == alias) {
        if (acList[i][1]!=null){
          WxParse.wxParse('aboutus', 'html', acList[i][1], that, 5);
        }
      }
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
  
  }
})