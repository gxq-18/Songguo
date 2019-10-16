// pages/tourist/shiting/shiting.js
var main = require('../../../utils/main.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheckF:true,
    name:"",
    phone:"",
    birthdy:"",
    array: ['1年', '3年', '5年',"10年"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  claSelect2: function(){
    this.setData({
    isCheckF: true
    })
  },
  claSelect3: function () {
    this.setData({
      isCheckF : false
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      birthdy: e.detail.value
    })
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  shiting: function () {
    var openId = app.globalData.openId;
    if (this.data.name.length == 0 || this.data.phone.length == 0) {
      if (this.data.name.length == 0) {
        this.setData({
          focus1: true
        })
      } else {
        if (this.data.phone.length == 0) {
          this.setData({
            focus2: true
          })
        }
      }
    } else {
      var that = this
      var sex = "男";
      if (!that.data.isCheckF){
        sex = "女";
      }
      wx.request({
        url: main.localUrl + 'mobileXcx/shiting', //仅为示例，并非真实的接口地址
        data: {
          name: that.data.name,
          phone:that.data.phone,
          sex:sex,
          birthdy: that.data.birthdy,
          curr_name: that.data.array[that.data.index],
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          //为绑定，跳转绑定页面
          if (res.data.succeed == "000") {
            wx.showToast({
              title: '提交预约成功',
              icon: 'success',
              duration: 2000,
              mask: true
            })
            setTimeout(function () {
              //成功
              var pages = getCurrentPages(); // 当前页面  
              var beforePage = pages[pages.length - 2]; // 前一个页面
              beforePage.backLoad();
              wx.navigateBack();  //返回上个页面

            }, 2000)
          }
        }
      })
    }

  },
  
})