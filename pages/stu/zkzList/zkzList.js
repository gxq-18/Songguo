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
    inputIdCard: '',
    disabled:false
  },

  /**
   * 监听手机号输入
   */
  listenerPhoneInput: function (e) {
    this.data.phone = e.detail.value;

  },

  /**
   * 监听密码输入
   */
  listenerPasswordInput: function (e) {
    this.data.password = e.detail.value;
  },

  /**
   * 监听登录按钮
   */
  listenerLogin: function () {
    //打印收入账号和密码
    console.log('手机号为: ', this.data.phone);
    console.log('密码为: ', this.data.password);
  },

  onLoad: function (options) {
    var leaver = options.leaver;
    conlose.log(leaver+"!!!!!!!!!!");
    // 页面初始化 options为页面跳转所带来的参数
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
