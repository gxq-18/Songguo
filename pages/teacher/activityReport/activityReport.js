// pages/teacher/activityReport/activityReport.js
var main = require('../../../utils/main.js');
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
     var id = options.id;
     var report_content = options.report_content;
     this.setData({
       id:id,
       report_content: report_content
     })
    
  },
  inputContent: function (e) {
    this.setData({
      report_content: e.detail.value
    })
  },
  addReport: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    var that = this;
        // 发布活动
    wx.request({
      url: main.localUrl + 'mobileXcx/addReport', //仅为示例，并非真实的接口地址
      data: {
        id: that.data.id,
        report_content: that.data.report_content,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200) {
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
            beforePage.backLoad();
            wx.navigateBack();  //返回上个页面

          }, 2000)
        }
      }
    })
  }
})