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
  teacher:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      teacher: app.globalData.teacher
    });

  },
  myMobile: function (e) {
    var id = e.currentTarget.dataset.id;
    var mobile = e.currentTarget.dataset.mobile;
    wx.navigateTo({
      url: "../myMobile/myMobile?id="+id+"&mobile="+mobile,
    })
  },
  myPwd: function (e) {
    var id = e.currentTarget.dataset.id;
    var pwd = e.currentTarget.dataset.pwd;
    wx.navigateTo({
      url: "../myPwd/myPwd?id="+id+"&pwd="+pwd,
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
        
        if (null == filePath || filePath == "") {
          wx.showToast({
            title: '上传失败',
            icon: 'loading',
            duration: 2000,
            mask: true
          })
        } else {
          // 交给七牛上传
          qiniuUploader.upload(filePath, (qiniu) => {
            if (null != qiniu.imageURL && "" != qiniu.imageURL) {
              that.editTeacher(qiniu.imageURL);
            } else {
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
  editTeacher: function (filePath){
    var that = this;
    wx.request({
      url: main.localUrl + 'mobileXcx/editTeacher', //仅为示例，并非真实的接口地址
      data: {
        tId: that.data.teacher.id,
        icon: filePath,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.data.teacher.icon = filePath;
        that.setData({
          teacher: that.data.teacher
        })
        app.globalData.teacher = that.data.teacher;
        var pages = getCurrentPages(); // 当前页面  
        var beforePage = pages[pages.length - 2]; // 前一个页面

        beforePage.setData({
          teacher: that.data.teacher
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