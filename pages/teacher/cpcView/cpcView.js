// pages/teacher/cpcView/cpcView.js
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cpc:[],
    csccbList:{},
    cpctrList:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // var bean = JSON.parse(options.model);
    var cpc_id = options.cpc_id;
    findView(cpc_id, (data) => {
      that.setData({
        cpc: data.pojo,
        csccbList: data.csccbList,
        cpctrList: data.cpctrList,
      })
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
  
  }
})
function findView(cpc_id, data) {
  wx.request({
    url: main.localUrl + 'mobileXcx/cpcView', //仅为示例，并非真实的接口地址
    data: {
      cpc_id: cpc_id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      data(res.data.dataInfo);
    }
  })
}