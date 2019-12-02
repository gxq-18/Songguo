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
    id: '',
    cpc: '',
    inputName: '',
    inputFphone: '',
    email:'',
    select: false,
    disabled: false,
    xmzj:1,//0 为验证通过
    sjzj: 1, // 同上
  },

  onLoad: function (options) {
    this.setData({
      cpc: app.globalData.cpc,
      id: options.id
    });
  },

  onShow: function () {
    wx.setNavigationBarTitle({
      title: '活动报名'
    });


  },
  //填写邮箱
  email: function (e) {
    if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(e.detail.value))) {
      wx.showToast({
        title: '邮箱有误',
        duration: 1500,
        icon: 'none'
      });
    } else {
      this.setData({
        email: e.detail.value,
        disabled: false
      })
    }
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
        inputName: "",
        xmzj: 1,
        disabled: true,
      })
    } else {
      this.setData({
        inputName: e.detail.value,
        xmzj: 0,
        disabled: false
      })
    }
  },

  //填写父亲手机号
  inputFPhone: function (e) {
    if (!(/^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/.test(e.detail.value)) || e.detail.value == '') {
      wx.showToast({
        title: '手机号有误',
        duration: 1500,
        icon: 'none'
      });
      this.setData({
        sjzj: 1,
        disabled: true
      })
    } else {
      this.setData({
        inputFphone: e.detail.value,
        sjzj: 0,
        disabled: false
      })
    }
  },


  //按钮
  editName: function (e) {
    //验证姓名和手机号
    if (this.data.xmzj != 0) {
      wx.showToast({
        title: '姓名有误',
        duration: 1500,
        icon: 'none'
      });
      this.setData({
        disabled: true
      })
      return false;
    }else 
    if (this.data.sjzj != 0) {
      wx.showToast({
        title: '手机号有误',
        duration: 1500,
        icon: 'none'
      });
      this.setData({
        disabled: true
      })
      return false;
    }else{
      let that = this;
      wx.request({
        url: main.localUrl + 'mobileXcx/selectHdbm', //仅为示例，并非真实的接口地址 
        data: {
          orderphone: that.data.inputFphone,
          inputName: that.data.inputName
        },
        header: {
          'content-type': 'application/json' // 默认值 
        },
        success: function (res) {
          if (res.data.ok == '') {
            wx.navigateTo({
              url: "../activityPay/activityPay?id=" + that.data.id + "&name=" + that.data.inputName + "&phone=" + that.data.inputFphone + "&email=" + that.data.email,
            })
          } else {
            wx.showToast({
              title: '此人已报名，请检查',
              icon: 'none',
              duration: 2000
            })
          }
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
