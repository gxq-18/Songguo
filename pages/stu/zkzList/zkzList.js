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
    admission_ticket : ''
    // inputName: '',
    // inputIdCard: '',
    // leaver:'',
    // school:'',
    // brithday:''
  },

  onLoad: function (options) {
    console.log(options.admission_ticket);
    // if (options.admission_ticket == null){
    //   this.setData({
    //   admission_ticket: '0'
    //   })
    // }
    this.setData({
      admission_ticket: options.admission_ticket
      // inputName : options.name,
      // inputIdCard:options.IDCard,
      // leaver :options.leaver,
      // school:options.school,
      // brithday:options.brithday
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
