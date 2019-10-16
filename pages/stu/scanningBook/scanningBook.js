// pages/stu/scanningBook/scanningBook.js
var main = require('../../../utils/main.js');

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
    loan_time:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var bookId = options.bookId;
    var huan = options.huan;
    this.setData({
      huan: huan,
      cpcId: app.globalData.cpc.id
    })
    
    bookView(bookId, (dataInfo) => {
      that.setData({
        book: dataInfo.book,
        loan_time: dataInfo.loan_time
      })
    })
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例  
    var viewWidth = 500,           //设置图片显示宽度，  
      viewHeight = 500 / ratio;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },
  saveBookLoaning:function(){
    wx.request({
      url: main.localUrl + 'mobileXcx/saveBookLoaning', //仅为示例，并非真实的接口地址
      data: {
        crm_code: main.crm_code,
        school_code: app.globalData.cpc.school_code,
        cpcId: app.globalData.cpc.id,
        bookId:this.data.book.id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        
        if (res.data.succeed == "000") {
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
            beforePage.backLoad();
            wx.navigateBack();  //返回上个页面

          }, 2000)
        }else{
          wx.showToast({
            title: res.data.sucInfo,
            icon: 'loading',
            duration: 2000,
            mask: true
          })
        }
      }
    })
  },
  returnBook: function () {
    wx.request({
      url: main.localUrl + 'mobileXcx/returnBook', //仅为示例，并非真实的接口地址
      data: {
        cpcId: app.globalData.cpc.id,
        bookId: this.data.book.id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
    
        if (res.data.succeed == "000") {
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
            beforePage.backLoad();
            wx.navigateBack();  //返回上个页面

          }, 2000)
        } 
      }
    })
  },

})

//查询图书详情
function bookView(id, data) {
  wx.request({
    url: main.localUrl + 'mobileXcx/bookView', //仅为示例，并非真实的接口地址
    data: {
      id: id,
      cpcId: app.globalData.cpc.id,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      data(res.data.dataInfo)
    }
  })
}
