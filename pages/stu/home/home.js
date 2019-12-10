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
    scrollHeight: 0,
    todayClass: [],
    noticeList: [],
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    totalPage: 0,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    
    startX: 0, //开始坐标
    startY: 0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      cpc: app.globalData.cpc
    });
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '学生中心'
    });


  },
  
  /**
       * 用户点击右上角分享
       */
  onShareAppMessage: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
     //获取菜单图片
    var stu_menu_01 = "../../../image/ion_03.png";
    var stu_menu_02 = "../../../image/ion_07.png";
    var stu_menu_03 = "../../../image/ion_05.png";
    var stu_menu_04 = "../../../image/ion_04.png";
    // 获取菜单图片
    wx.request({
      url: main.localUrl + 'mobileXcx/initialization', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        app.globalData.menuList = res.data.dataInfo.menuList;
      }
    })


    var menuList = app.globalData.menuList;
    for (var i = 0; i < menuList.length; i++) {
      if (menuList[i][0] == 'stu_menu_01') {
        stu_menu_01 = menuList[i][1];
      }
      if (menuList[i][0] == 'stu_menu_02') {
        stu_menu_02 = menuList[i][1];
      }
      if (menuList[i][0] == 'stu_menu_03') {
        stu_menu_03 = menuList[i][1];
      }
      if (menuList[i][0] == 'stu_menu_04') {
        stu_menu_04 = menuList[i][1];
      }
    }
    that.setData({
      stu_menu_01: stu_menu_01,
      stu_menu_02: stu_menu_02,
      stu_menu_03: stu_menu_03,
      stu_menu_04: stu_menu_04,

    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
   
    this.setData({
      cpc: app.globalData.cpc,
      noticeList: [],
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
      callbackcount: 15,      //返回数据的个数  
      totalPage: 0,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    });

    this.todayClass();//当日课程
    this.fetchSearchList();//通知

   
  },
  activity1: function (e) {
    // wx.navigateTo({
    //   // url: "../activity/activity",
    //   url: "../../tourist/parentCircleList/parentCircleList",
    // })
    app.globalData.thetype = "ysj";
    app.globalData.typeid = "0";
    app.globalData.codeid = app.globalData.cpc.id;
    wx.navigateTo({
      url: "../parentCircleListysj/parentCircleListysj",
      // success: function (e) {
      //   var page = getCurrentPages().pop();
      //   if (page == undefined || page == null) return;
      //   page.onLoad();
      // }
    })
  },

  my: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../mine/mine",
    })
  },
  layout: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../layout/layout",
    })
  },
  baoming: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../baoming/baoming",
    })
  },
  book: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../book/book",
    })
  },
  activity: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../activity/activity",
    })
  },
  parentCircleList: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../parentCircleList/parentCircleList",
    })
  },
  XzEmail: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../mailbox/mailbox",
    })
  },
  //今日课程
  todayClass: function () {
    var that = this;
    var today = util.formatTime(new Date());
    wx.request({
      url: main.localUrl + 'mobileXcx/todayClassStu', //仅为示例，并非真实的接口地址
      data: {
        ccm_id: app.globalData.csc.ccm_id,
        dayTime: today
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          todayClass: res.data.dataInfo.classList
        })
      }
    })
  },
  backLoad() {
    //查询排课记录
    this.todayClass();
  },
  contentView: function (e) {
    var that = this;
    var model = JSON.stringify(e.currentTarget.dataset.model);
    var index = parseInt(e.target.dataset.index);
    that.data.noticeList[index].is_look = 1;
    this.setData({
      noticeList: that.data.noticeList,
    })
    //添加查看记录
    wx.request({
      url: main.localUrl + 'mobileXcx/csnrAdd', //仅为示例，并非真实的接口地址
      data: {
        csn_id: e.currentTarget.dataset.id,
        account_id: app.globalData.cpc.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.navigateTo({
          url: "../../contentView/contentView?model=" + model,
        })
      }
    })

  },
  //分页搜索通知
  fetchSearchList: function () {
    let that = this;

    // searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
    // callbackcount = that.data.callbackcount; //返回数据的个数  
    //访问网络  
    getSearchMusic(that.data.searchPageNum, that.data.callbackcount, function (data) {

      //判断是否有数据，有则取数据  
      if (data.dataInfo.dataList != null && data.dataInfo.dataList.length != 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.dataInfo.dataList : searchList = that.data.noticeList.concat(data.dataInfo.dataList)
        that.setData({
          noticeList: searchList, //获取数据数组  
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
  // 以下左滑删除
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.noticeList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      noticeList: this.data.noticeList
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.noticeList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      noticeList: that.data.noticeList
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var that = this;

    var index= e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: main.localUrl + 'mobileXcx/csnDel', //仅为示例，并非真实的接口地址
      data: {
        csn_id: id,
        account_id: app.globalData.cpc.id,
      },
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        if (res.statusCode == 200) {
          that.data.noticeList.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            noticeList: that.data.noticeList
          })
        }
      }
    })
  },

})
//通知接口
function getSearchMusic(pageindex, callbackcount, callback) {
  wx.request({
    url: main.localUrl + 'mobileXcx/notificationList', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      account_id: app.globalData.cpc.id,
      type: 1,
      currentPage: pageindex,
      rowCountPerPage: callbackcount,
    },
    method: 'GET',
    header: { 'content-Type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}