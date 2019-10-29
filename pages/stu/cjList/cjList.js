// pages/stu/home/home.js
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');
//获取应用实例
const app = getApp()
Page({
  /**
   * 初始化数据
   */
  data: {
    inputName: '',
    IdCard: '',
    leaver_Calligraphy:'',
    leaver_painting:'',
    leaver_music:'',
    address:'',
    time:''
  },

  onLoad: function (options) {
    this.setData({
      inputName : options.name,
      IdCard: options.IdCard,
      leaver_Calligraphy: options.leaver_Calligraphy,
      leaver_painting: options.leaver_painting,
      leaver_music: options.leaver_music,
      address: options.address,
      time:options.time
    })

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
