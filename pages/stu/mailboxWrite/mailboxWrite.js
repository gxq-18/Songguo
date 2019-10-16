// pages/stu/mailboxWrite/mailboxWrite.js
var main = require('../../../utils/main.js');
const qiniuUploader = require("../../../utils/qiniuUploader");
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    imgPath:[],
    title:'',
    content:'',
    isCheckF:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    main.initQiniu();//初始化七牛
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
  inputTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  inputContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  /**以下是上传图片 */
  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 9) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function () {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;

        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 9) {
            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        // console.log(imgs);
        that.setData({
          imgs: imgs
        });
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  //匿名
  claSelect: function (e) {
    this.setData({
      isCheckF: !this.data.isCheckF,
    })
  },
  saveMail: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    var that = this;
    if (this.data.title.length == 0 || this.data.content.length == 0) {
      if (this.data.title.length == 0) {
        this.setData({
          focus1: true
        })
      } else {
        if (this.data.content.length == 0) {
          this.setData({
            focus2: true
          })
        }
      }
    } else {
       
        var is_anonymous = 0;
        if (that.data.isCheckF)
          is_anonymous = 1;

        wx.showLoading({ mask: true});
        main.initQiniu();//初始化七牛
        //拼接路径
        var imgPathStr = "";
        for (var i = 0; i < that.data.imgs.length; i++) {
          // 交给七牛上传
          qiniuUploader.upload(that.data.imgs[i], (qiniu) => {
            if (null != qiniu.imageURL && "" != qiniu.imageURL) {
              if (imgPathStr == "") {
                imgPathStr = qiniu.imageURL;
              } else {
                imgPathStr += "," + qiniu.imageURL;
              }
            }
          }, (error) => {
            console.error('error: ' + JSON.stringify(error));
          });
        }
       
        setTimeout(function () {
          wx.request({
            url: main.localUrl + 'mobileXcx/saveMail', //仅为示例，并非真实的接口地址
            data: {
              crm_code: main.crm_code,
              school_code: app.globalData.cpc.school_code,
              cpc_id: app.globalData.cpc.id,
              title: that.data.title,
              content: that.data.content,
              is_anonymous: is_anonymous,
              img_path: imgPathStr,
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              if (res.data.succeed == "000") {
                wx.hideLoading();
                  //成功
                  var pages = getCurrentPages(); // 当前页面  
                  var beforePage = pages[pages.length - 2]; // 前一个页面
                  beforePage.backLoad();
                  wx.navigateBack();  //返回上个页面
              }
            }
          })
        }, 2500)
      }
    
  },
  
})