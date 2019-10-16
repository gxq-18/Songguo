// pages/tourist/activityHome/activityHome.js
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList: [],
    movies: [
      { url: 'http://p7mq9gjza.bkt.clouddn.com/tmp/wx22a96a8600887d94.o6zAJs06o19VUQ965086eUdcvhAk.KlhJUjf2yGkVa71797eedd9b38ad06e2efe8d5a0ffbd.png' },
      { url: 'http://img04.tooopen.com/images/20130617/tooopen_21241404.jpg' },
      { url: 'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg' },
      { url: 'http://img02.tooopen.com/images/20141231/sy_78327074576.jpg' }
    ], 
    activityList2: [],
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 4,      //返回数据的个数  
    mobile: '0531—86991095',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //初始化接口
    wx.request({
      url: main.localUrl + 'mobileXcx/initialization', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        app.globalData.menuList = res.data.dataInfo.menuList;
        app.globalData.posterList = res.data.dataInfo.posterList;
        app.globalData.qrcode = res.data.dataInfo.qrcode;
        app.globalData.mobile = res.data.dataInfo.phone;
        app.globalData.acList = res.data.dataInfo.acList;
        console.log(app.globalData.acList)
      }
    })

    this.setData({
      userInfo: app.globalData.userInfo,
      mobile: app.globalData.mobile
    })

    //获取菜单图片
    var ac_menu_01 = "http://p7mq9gjza.bkt.clouddn.com/ca01.png";
    var ac_menu_02 = "http://p7mq9gjza.bkt.clouddn.com/ca02.png";
    var ac_menu_03 = "http://p7mq9gjza.bkt.clouddn.com/ca03.png";
    var ac_menu_04 = "http://p7mq9gjza.bkt.clouddn.com/ca04.png";
    var ac_menu_05 = "http://p7mq9gjza.bkt.clouddn.com/ca05.png";
    var ac_menu_06 = "http://p7mq9gjza.bkt.clouddn.com/ca06.png";
    var ac_menu_07 = "http://p7mq9gjza.bkt.clouddn.com/ca07.png";
    var ac_menu_08 = "http://p7mq9gjza.bkt.clouddn.com/ca08.png";

    var menuList = app.globalData.menuList;
    for (var i = 0; i < menuList.length; i++) {
      if (menuList[i][0] == 'ac_menu_01') {
        ac_menu_01 = menuList[i][1];
      }
      if (menuList[i][0] == 'ac_menu_02') {
        ac_menu_02 = menuList[i][1];
      }
      if (menuList[i][0] == 'ac_menu_03') {
        ac_menu_03 = menuList[i][1];
      }
      if (menuList[i][0] == 'ac_menu_04') {
        ac_menu_04 = menuList[i][1];
      }
      if (menuList[i][0] == 'ac_menu_05') {
        ac_menu_05 = menuList[i][1];
      }
      if (menuList[i][0] == 'ac_menu_06') {
        ac_menu_06 = menuList[i][1];
      }
      if (menuList[i][0] == 'ac_menu_07') {
        ac_menu_07 = menuList[i][1];
      }
      if (menuList[i][0] == 'ac_menu_08') {
        ac_menu_08 = menuList[i][1];
      }
    }
    that.setData({
      ac_menu_01: ac_menu_01,
      ac_menu_02: ac_menu_02,
      ac_menu_03: ac_menu_03,
      ac_menu_04: ac_menu_04,
      ac_menu_05: ac_menu_05,
      ac_menu_06: ac_menu_06,
      ac_menu_07: ac_menu_07,
      ac_menu_08: ac_menu_08,

    })

    //查询付费活动
    findList(that.data.searchPageNum, that.data.callbackcount,1, (data) => {
      console.log(data.dataInfo.dataList.length);
      var ac1 = [];
      var ac2 = [];
      var ac3 = [];
      if (data.dataInfo.dataList.length>0){
        ac1 = data.dataInfo.dataList[0]
      }
      if (data.dataInfo.dataList.length > 1){
        ac2 = data.dataInfo.dataList[1]
      }
      if (data.dataInfo.dataList.length > 2){
        ac3 = data.dataInfo.dataList[2] 
      }

      that.setData({
        activityList:data.dataInfo.dataList,
        ac1: ac1,
        ac2: ac2,
        ac3: ac3,
      })

    })
    //查询体验课活动
    findList(that.data.searchPageNum, that.data.callbackcount, 0, (data) => {
      console.log(data.dataInfo.dataList.length);
      var ac4 = [];
      var ac5 = [];
      var ac6 = [];
      if (data.dataInfo.dataList.length > 0)
        ac4 = data.dataInfo.dataList[0]
      if (data.dataInfo.dataList.length > 1)
        ac5 = data.dataInfo.dataList[1]
      if (data.dataInfo.dataList.length > 2)
        ac6 = data.dataInfo.dataList[2]
      that.setData({
        activityList2: data.dataInfo.dataList,
        ac4: ac4,
        ac5: ac5,
        ac6: ac6
      })
    })
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
  tourist: function (e) {
    // main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800);//收集formId
    // if (null!=app.globalData.userInfo){
    var userInfo = e.detail.userInfo;
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: app.globalData.userInfo
    })

    //获取openid
    wx.login({
      success: function (res) {
        if (res.code) {
          //获取openId
          wx.showLoading({ mask: true });
          wx.request({
            url: main.localUrl + 'mobileXcx/getOpenId', //仅为示例，并非真实的接口地址
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (openIdRes) {
              console.log(openIdRes);
              wx.hideLoading();
              // 判断openId是否获取成功
              if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
                console.info("登录成功返回的openId：" + openIdRes.data.openid);
                app.globalData.openId = openIdRes.data.openid;

                wx.navigateTo({
                  url: "../mine/mine",
                })

              }
            }
          })
        }
      }
    });
  },
  gengduo: function (e) {
    var is_pay = e.currentTarget.dataset.is_pay;
    wx.navigateTo({
      url: "../home/home?is_pay=" + is_pay,
    })
  },
  view: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId); //收集formId
    var id = e.detail.target.dataset.id;
    wx.navigateTo({
      url: "../activityView/activityView?id=" + id + "&isPay=0",
    })
  },
  topImgView:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../activityView/activityView?id=" + id + "&isPay=0",
    })
  },
  acList:function(e){
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    var is_pay = e.detail.target.dataset.is_pay;
    wx.navigateTo({
      url: "../home/home?is_pay=" + is_pay,
    })
  },
  acUe: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    var alias = e.detail.target.dataset.alias;
    wx.navigateTo({
      url: "../acUe/acUe?alias=" + alias,
    })
  },
  album: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../album/album",
    })
  },
  
})

//查询活动
function findList(pageindex, callbackcount, is_pay, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/stuActivityList', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      tourist: "tourist",
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