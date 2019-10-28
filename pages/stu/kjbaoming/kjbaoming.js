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
    cpc:'',
    inputName:'',
    dateValue: '请选择出生日期',
    grade_name: '请选择证件类型',
    inputIdCard:'',
    inputLevel: '',
    gender: '请选择性别',
    inputTea:'',
    inputSchool:'',
    inputAdress:'',
    inputFphone:'',
    inputMphone:'',
    inputTrain:'',
    select: false,
    bjlistindex: 0,
    bjnamelist: [
      '居民身份证',
      '护照',
    ],
    kjlistindex:0,
    kjnamelist: [
      '男',
      '女',
    ],
    disabled:false
  },

  onLoad: function (options) {
    console.log(app.globalData.cpc)
    var that = this;
    this.setData({
      cpc: app.globalData.cpc
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
  //填写证件号
  inputIdCard:function(e){
    //var idCard = ;
    //身份证验证： 
    if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(e.detail.value)) || e.detail.value=='') {
      wx.showToast({
         title: '身份证号码有误',
         duration: 1500,
         icon: 'none'
       });
      this.setData({
        disabled: true
      })
     }else{
      this.setData({
        inputIdCard: e.detail.value,
        disabled: false
      })
     }
  },
  //填写报考级别
  inputLevel:function(e){
    this.setData({
      inputLevel:e.detail.value,
    })
  },
  //输入指导老师
  inputTea: function (e) {
    this.setData({
      inputTea: e.detail.value,
    })
  },
  //输入所在学校
  inputSchool:function(e){
    this.setData({
      inputSchool:e.detail.value
    })
  },
  //填写通讯地址
  inputAdress:function(e){
    this.setData({
      inputAdress: e.detail.value
    })
  },
  //填写父亲手机号
  inputFphone:function(e){
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
  //填写父亲手机号
  inputMphone: function (e) {
    if (!(/^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/.test(e.detail.value)) || e.detail.value == '') {
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
        inputMphone: e.detail.value,
        disabled:false
      })
    }
  },

  //培训学校
  inputTrain: function (e) {
    this.setData({
      inputTrain: e.detail.value
    })
  },

  //按钮
  editName: function (e) {
    if (this.data.inputName == '' || this.data.dateValue == '请选择出生日期' || this.data.grade_name == '请选择证件类型' || this.data.inputLevel == '' || this.data.gender == '请选择性别' || this.data.inputTea == '' || this.data.inputSchool == '' || this.data.inputAdress == '' || this.data.inputTrain == ''){
      wx.showToast({
        title: '没有填完整',
        duration: 1500,
        icon: 'none'
      })
      this.setData({
        disabled: !this.data.disabled
      })
    } else {
      this.setData({
        disabled: false
      })
    wx.request({
      url: main.localUrl + 'mobileXcx/saveKaoji', //仅为示例，并非真实的接口地址
      data: {
        name: this.data.inputName,
        leaver: this.data.inputLevel,
        brithday: this.data.dateValue,
        cardtype: this.data.grade_name,
        IDcard: this.data.inputIdCard,
        school: this.data.inputSchool,
        teacher: this.data.inputTea,
        address: this.data.inputAdress,
        phoneDad: this.data.inputFphone,
        phoneMom: this.data.inputMphone,
        peischool: this.data.inputTrain
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
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
          beforePage.onLoad();
          wx.navigateBack();  //返回上个页面
        }, 2000)

      }
    })
    }

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
