// pages/stu/home/home.js
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');
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
    scrollHeight: 0,
    activityList: [],
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    totalPage: 0,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight+500
        });
      }
    });

   var is_pay = options.is_pay;
   this.setData({
     userInfo: app.globalData.userInfo,
     is_pay: is_pay
   })
   this.fetchSearchList();
   
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例  
    var viewWidth = 230,           //设置图片显示宽度，  
      viewHeight = 230 / ratio;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },
  myMine: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../mine/mine",
    })
  },
  view: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../activityView/activityView?id=" + id + "&isPay=0",
    })
  },
  shiting: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../shiting/shiting",
    })
  },
  //分页搜索活动
  fetchSearchList: function () {
    let that = this;
    // searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
    // callbackcount = that.data.callbackcount; //返回数据的个数  
    var is_pay = that.data.is_pay;
    //访问网络  
    findList(that.data.searchPageNum, that.data.callbackcount, is_pay, (data) => {
      console.log(data.dataInfo.dataList);
      //判断是否有数据，有则取数据  
      if (data.dataInfo.dataList != null && data.dataInfo.dataList.length != 0) {

        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.dataInfo.dataList : searchList = that.data.activityList.concat(data.dataInfo.dataList)
        that.setData({
          activityList: searchList, //获取数据数组  
          searchLoading: true   //把"上拉加载"的变量设为false，显示  
        });
        //判断页码是否是最后一页
        if (data.dataInfo.totalPage <= that.data.searchPageNum) {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          });
        }
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    })
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {

    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
      });
      that.fetchSearchList();
    }
  },
  backLoad() {
    this.setData({
      activityList: [],
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
      callbackcount: 15,      //返回数据的个数  
      totalPage: 0,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
    })
    this.fetchSearchList();
  },
  activityView: function (e) {
    // var model = JSON.stringify(e.currentTarget.dataset.model);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../activityView/activityView?id=" + id,
    })
  }, 
  
  
})

//查询活动
function findList(pageindex, callbackcount, is_pay,dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/stuActivityList', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      tourist:"tourist",
      is_pay: is_pay,
      currentPage: pageindex,
      rowCountPerPage: callbackcount,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      dataList(res.data)
    }
  })
}