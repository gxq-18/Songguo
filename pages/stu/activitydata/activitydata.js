// pages/stu/home/home.js
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    cpc:'',
    inputName:'',
    inputFphone:'',
    select: false,
    disabled:false
  },

  onLoad: function (options) {
    this.setData({
      cpc: app.globalData.cpc,
      id:options.id
    });
  },

  //填写姓名
  inputName: function (e) {
    var regNum = new RegExp('[0-9]', 'g');//判断用户输入的是否为数字
    var rsNum = regNum.exec(e.detail.value);
    if (rsNum || e.detail.value == '') {
      wx.showToast({
        title: '姓名有误',
        duration: 1500,
        icon: 'none'
      });
      this.setData({
        disabled: true
      })
    } else{
      this.setData({
        inputName: e.detail.value,
        disabled: false
      })
    }
  },
  
  //填写父亲手机号
  inputFPhone:function(e){
    if (!(/^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/.test(e.detail.value)) || e.detail.value == ''){
      wx.showToast({
        title: '手机号有误',
        duration: 1500,
        icon: 'none'
      });
      this.setData({
        disabled: true
      })
    }else{
      this.setData({
        inputFphone:e.detail.value,
        disabled: false
      })
    }
  },


  //按钮
  editName: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../activityPay/activityPay?id=" + this.data.id+"&name="+this.data.inputName+"&phone="+this.data.inputFphone,
    })
     
  },
  
  /**
  *  点击下拉框
  */
  datePickerBindchange: function (e) {
    this.setData({
      dateValue: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      grade_name: this.data.bjnamelist[e.detail.value]
    })
  },
  bindGenderChange: function (e) {
    this.setData({
      gender: this.data.kjnamelist[e.detail.value]
    })
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },

  mySelect(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name
    this.setData({
      grade_name: name,
      select: false
    })
  },

  })
