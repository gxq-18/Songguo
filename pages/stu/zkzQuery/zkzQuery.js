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
  inputName: function (e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '信息查询'
    });


  },

  //填写证件号
  inputIdCard: function (e) {
    //var idCard = ;
    //身份证验证： 
    if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(e.detail.value)) || e.detail.value == '') {
      wx.showToast({
        title: '身份证号码有误',
        duration: 1500,
        icon: 'none'
      });
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        inputIdCard: e.detail.value,
        disabled: false
      })
    }
  },
  editName: function (e) {
    if (this.data.inputName == '' || this.data.inputIdCard == '') {
      wx.showToast({
        title: '没有填完整',
        duration: 1500,
        icon: 'none'
      })
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        disabled: false
      })
    }
    wx.request({
      url: main.localUrl + 'mobileXcx/selectKj', //仅为示例，并非真实的接口地址
      data: {
        name: this.data.inputName,
        IDcard: this.data.inputIdCard
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.ok == ''){
          wx.showToast({
            title: '未查到',
            icon: 'none',
            duration: 2000
          })
        }else{
          if (res.data.ok[0].admission_ticket == null){
            wx.navigateTo({
              // url: "../zkzList/zkzList?leaver=" + res.data.ok[0].leaver + "&name=" + res.data.ok[0].name + "&school=" + res.data.ok[0].school+"&brithday=" + res.data.ok[0].brithday + "&IDCard=" + res.data.ok[0].IDCard,
              url: "../zkzList/zkzList?admission_ticket=" + 0,
            })
          }
          wx.navigateTo({
            // url: "../zkzList/zkzList?leaver=" + res.data.ok[0].leaver + "&name=" + res.data.ok[0].name + "&school=" + res.data.ok[0].school+"&brithday=" + res.data.ok[0].brithday + "&IDCard=" + res.data.ok[0].IDCard,
            url: "../zkzList/zkzList?admission_ticket=" + res.data.ok[0].admission_ticket,
          })
        }

      }
    })

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
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  // onShow: function () {
  //   // 页面显示
  // },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
