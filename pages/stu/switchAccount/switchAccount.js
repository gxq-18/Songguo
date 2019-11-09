// pages/stu/switchAccount/switchAccount.js
var main = require('../../../utils/main.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.appointmentByOpenId();
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
  switchAccountAdd: function () {
    wx.navigateTo({
      url: "../switchAccountAdd/switchAccountAdd",
    })
  },
  appointmentByOpenId:function(){
    var that = this;
    wx.request({
      url: main.localUrl + 'mobileXcx/appointmentByOpenId', //仅为示例，并非真实的接口地址
      data: {
        openId: app.globalData.openId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.dataInfo.dataList);
        that.setData({
          dataList:res.data.dataInfo.dataList
        })
      }
    })
  },
  editAppointment:function(e){
    var that = this;
    var id = e.target.dataset.id;
    var index = e.target.dataset.index  ;
    var that = this;
    wx.showLoading({})
    wx.request({
      url: main.localUrl + 'mobileXcx/editAppointment', //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.succeed != "000") {
          wx.showToast({
            title: res.data.sucInfo,
            icon: 'none',
            duration: 2000
          })

        } else {
          
          app.globalData.cpc = that.data.dataList[index].cpc;
          app.globalData.csc = res.data.dataInfo.csc;

          var pages = getCurrentPages(); // 当前页面  
          var beforePage = pages[pages.length - 2]; // 前一个页面
          beforePage.onLoad();
          
          wx.hideLoading();

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

  },
  delAppointment: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    var index = e.target.dataset.index;
    var that = this;
    wx.showLoading({})
    wx.request({
      url: main.localUrl + 'mobileXcx/delAppointment', //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.succeed != "000") {
          wx.showToast({
            title: res.data.sucInfo,
            icon: 'none',
            duration: 2000
          })

        } else {
          that.data.dataList.splice(index, 1);
          that.setData({
            dataList: that.data.dataList
          })
          wx.hideLoading();
        }
      }
    })

  }
})