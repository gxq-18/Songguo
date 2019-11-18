// pages/stu/myIndex/myIndex.js
var main = require('../../../utils/main.js');
const qiniuUploader = require("../../../utils/qiniuUploader");
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cpc:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      cpc: app.globalData.cpc
    });
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
    wx.setNavigationBarTitle({
      title: '个人信息'
    });
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
  myMobile: function (e) {
    var id = e.currentTarget.dataset.id;
    var mobile = e.currentTarget.dataset.mobile;
    wx.navigateTo({
      url: "../myMobile/myMobile?id=" + id + "&mobile=" + mobile,
    })
  },
  myPwd: function () {
    wx.navigateTo({
      url: "../myPwd/myPwd",
    })
  },
  myName: function (e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: "../myName/myName?id=" + id + "&name=" + name,
    })
  },
  myBirthday: function (e) {
    var id = e.currentTarget.dataset.id;
    var birthday = e.currentTarget.dataset.birthday;
    wx.navigateTo({
      url: "../myBirthday/myBirthday?id=" + id + "&birthday=" + birthday,
    })
  },
  // 上传头像  
  changeImage: function () {
    var that = this;
    main.initQiniu();//初始化七牛
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        console.log(filePath);
        if (null == filePath || filePath==""){
          wx.showToast({
            title: '上传失败',
            icon: 'loading',
            duration: 2000,
            mask: true
          })
        }else{
          
          // 交给七牛上传
          qiniuUploader.upload(filePath, (qiniu) => {
            console.log(qiniu);
            console.log(qiniu.imageURL);
            if (null != qiniu.imageURL && "" != qiniu.imageURL) {
              that.editCpc(qiniu.imageURL);
            }else{
              wx.showToast({
                title: '上传失败',
                icon: 'loading',
                duration: 2000,
                mask: true
              })
            }
          }, (error) => {
            console.error('error: ' + JSON.stringify(error));
          }
          );
        }

        
      }
    })
  },  
  editCpc: function (imageURL){
    var that = this;

    wx.request({
      url: main.localUrl + 'mobileXcx/editCpc', //仅为示例，并非真实的接口地址
      data: {
        cpcId: that.data.cpc.id,
        icon: imageURL,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.data.cpc.icon = imageURL;
        that.setData({
          cpc: that.data.cpc
        })
        app.globalData.cpc = that.data.cpc;
        var pages = getCurrentPages(); // 当前页面  
        var beforePage = pages[pages.length - 2]; // 前一个页面
        beforePage.setData({
          cpc: that.data.cpc
        })
       
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000,
          mask: true
        })
      }
    })
  }

})

// // 初始化七牛相关参数
// function initQiniu() {
//   var options = {
//     region: 'ECN', // 华东区
//     uptokenURL: 'https://up.qbox.me/api/uptoken',
//     uptoken: '52YN_KFYR8gyo7JC-mAG6vyLJBXMo5qy_iqfXMHK:0u4-VB26zBMOvo6e96hMFAXWKPc=:eyJzY29wZSI6ImFydGVyIiwiZGVhZGxpbmUiOjE1MjQ1MzkzODR9',
//     domain: 'http://p7mq9gjza.bkt.clouddn.com',
//     shouldUseQiniuFileName: false
//   };
//   qiniuUploader.init(options);
// }