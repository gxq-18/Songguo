//app.js
var main = require('utils/main.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log("用户信息");
              console.log(this.globalData.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }, 
  globalData: {
    // appid: 'wxa9fe7f574b10e481',//appid需自己提供，此处的appid我随机编写
    // secret: '124b69cfc739ba1b8e8b47d86cea5926',//secret需自己提供，此处的secret我随机编写
    appid: 'wx9b1d48f2eb0fece9',//appid需自己提供，此处的appid我随机编写  
    secret: 'e54607978e69830f5e2b3c07761f53f1',//secret需自己提供，此处的secret我随机编写  
    menuList:[],
    userInfo: null,
    teacher: {},
    cpc: {},
    csc:{},
    openId: "",
    posterList:[],
    acList:[],
    qrcode:"",   
    mobile:"86991095",
    typeid:'',
    codeid:'', 
    //班级圈分享 学生&老师
    typebj:'',
    codebj:'',
    isIphoneX: false,
    userInfo: null,
    loginType:'',
   
  },
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        if (modelmes.search('iPhone 11') != -1 || modelmes.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }
      }
    })
  },
})