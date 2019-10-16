// pages/stu/activityView/activityView.js
var main = require('../../../utils/main.js');
var WxParse= require('../../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0, 
    model:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // var bean = JSON.parse(options.model);
    var id = options.id;

    findView(id, (data) => {
      console.log(data);
      that.setData({
        model: data
      })
      /**
     * html解析示例
     */
      WxParse.wxParse('article', 'html', data.content, that, 5);
    })
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例  
    var viewWidth = 750,           //设置图片显示宽度，  
      viewHeight = 750 / ratio;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },
  activityReport: function (e) {
    
    wx.navigateTo({
      url: "../activityReport/activityReport?id=" + this.data.model.id + "&report_content=" + this.data.model.report_content,
    })
  }, 
  backLoad:function(){
    var that = this;
    // var bean = JSON.parse(options.model);
    var id = that.data.model.id;

    findView(id, (data) => {
      that.setData({
        model: data
      })
      /**
     * html解析示例
     */
      WxParse.wxParse('article', 'html', data.content, that, 5);
    })
  }
})

function findView(id, data) {
  wx.request({
    url: main.localUrl + 'mobileXcx/stuActivityById', //仅为示例，并非真实的接口地址
    data: {
      id:id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      data(res.data.dataInfo.act);
    }
  })
}