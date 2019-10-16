// pages/stu/switchAccountAdd/switchAccountAdd.js
var main = require('../../../utils/main.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCode:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  inputCardCode: function (e) {
    this.setData({
      cardCode: e.detail.value
    })
  },
  binding: function () {
    var openId = app.globalData.openId;
    var that = this
    if (this.data.cardCode.length == 0) {
      this.setData({
        focus1: true
      })
    }else{
      wx.request({
        url: main.localUrl + 'mobileXcx/bindingOpenId', //仅为示例，并非真实的接口地址
        data: {
          crm_code: main.crm_code,
          openId: openId,
          type: 1,
          card_code: that.data.cardCode,
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
            if (res.data.dataInfo.cpc != null) {
              app.globalData.cpc = res.data.dataInfo.cpc;
              app.globalData.csc = res.data.dataInfo.csc;
              
            }
            var pages = getCurrentPages(); // 当前页面  
            var beforePage = pages[pages.length - 3]; // 前一个页面
            beforePage.onLoad();

            wx.navigateTo({
              url: '../home/home',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              } 
            })
          }
        }
      })
    }

  },

})