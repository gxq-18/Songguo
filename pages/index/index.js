//index.js
var main = require('../../utils/main.js');
var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()

Page({
  
  data: {
    openid: "666666",
    isbangding: false,
    home_01:"../../image/login_student@2x.png",
    home_01_old: "../../image/login_student@2x.png",
    home_01_btn: "../../image/stuloginCheck.png",
    home_02:"../../image/login_teather@2x.png",
    phone:'',
    posterList:[],
    stuloginCheck:false,

  },
  onLoad: function () {
    var that = this;
   
    //获取菜单图片
    wx.request({
      url: main.localUrl + 'mobileXcx/initialization', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var menuList = res.data.dataInfo.menuList;
        var home_01 = "";
        var home_01_old = "";
        var home_02 = "";
        var home_01_btn="";
        for(var i=0;i<menuList.length;i++){
          if (menuList[i][0] =='home_01'){
            home_01 = menuList[i][1];
            home_01_old = menuList[i][1];
          }
          if (menuList[i][0] == 'home_02') {
            home_02 = menuList[i][1];
          }
          if (menuList[i][0] == 'home_01_btn') {
            home_01_btn = menuList[i][1];
          }
          
        }
        that.setData({
          home_01: home_01,
          home_01_old: home_01_old,
          home_01_btn: home_01_btn,
          home_02: home_02,
          phone: res.data.dataInfo.phone,
          posterList: res.data.dataInfo.posterList,

        })
        app.globalData.menuList = res.data.dataInfo.menuList;
        app.globalData.posterList = res.data.dataInfo.posterList;
        app.globalData.qrcode = res.data.dataInfo.qrcode;
        app.globalData.mobile = res.data.dataInfo.phone;
        WxParse.wxParse('aboutus', 'html', res.data.dataInfo.aboutus, that, 5);
        
      }
    })

    //this.shouquan();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取菜单图片
    wx.request({
      url: main.localUrl + 'mobileXcx/initialization', //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var menuList = res.data.dataInfo.menuList;
        var home_01 = "";
        var home_01_old = "";
        var home_02 = "";
        var home_01_btn = "";
        for (var i = 0; i < menuList.length; i++) {
          if (menuList[i][0] == 'home_01') {
            home_01 = menuList[i][1];
            home_01_old = menuList[i][1];
          }
          if (menuList[i][0] == 'home_02') {
            home_02 = menuList[i][1];
          }
          if (menuList[i][0] == 'home_01_btn') {
            home_01_btn = menuList[i][1];
          }

        }
        that.setData({
          home_01: home_01,
          home_01_old: home_01_old,
          home_01_btn: home_01_btn,
          home_02: home_02,
          phone: res.data.dataInfo.phone,
          posterList: res.data.dataInfo.posterList,

        })
        app.globalData.menuList = res.data.dataInfo.menuList;
        app.globalData.posterList = res.data.dataInfo.posterList;
        app.globalData.qrcode = res.data.dataInfo.qrcode;
        app.globalData.mobile = res.data.dataInfo.phone;
        WxParse.wxParse('aboutus', 'html', res.data.dataInfo.aboutus, that, 5);

      }
    })
  },
  mytouchstart: function (e) {
    this.setData({
      home_01: this.data.home_01_btn,
    })
  },
  telPhone:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone //仅为示例，并非真实的电话号码
    })
  },
  onGotUserInfo: function (e) {
      var userInfo = e.detail.userInfo;

        app.globalData.userInfo = e.detail.userInfo;
          // //获取openid
          // wx.login({
          //   success: function (res) {
          //     console.log("code:" + res.code);
          //     if (res.code) {
          //       //获取openId
          //       wx.showLoading({ mask: true });
          //       wx.request({
          //         url: main.localUrl + 'mobileXcx/getOpenId', //仅为示例，并非真实的接口地址
          //         data: {
          //           code: res.code
          //         },
          //         header: {
          //           'content-type': 'application/json' // 默认值
          //         },
          //         success: function (openIdRes) {
          //           console.log(openIdRes);
          //           // 判断openId是否获取成功
          //           if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
          //             // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
          //             console.info("登录成功返回的openId：" + openIdRes.data.openid);
          //             app.globalData.openId = openIdRes.data.openid;

          //           } else {
          //             console.info("获取用户openId失败else");
          //             app.globalData.openId = "oE-cD5gyPE0JfdEV6NuqjMnHqxpw";
          //           }
          //         },
          //         fail: function (error) {
          //           console.info("获取用户openId失败");
          //           console.info(error);

          //         },
          //         complete:function(){
          //           wx.hideLoading()
          //         }
          //       })
          //     }
          //   }
          // });
        
      

  },

  shouquan: function (e) {
  
    // wx.getUserInfo({
    //   success: function (res) {
    //     var userInfo = res.userInfo;
    //     console.log(userInfo);
    //     app.globalData.userInfo = res.userInfo;

    //     //获取openid
    //     wx.login({
    //       success: function (res) {
    //         console.log("code:" + res.code);
    //         if (res.code) {
    //           //获取openId
    //           wx.showLoading({ mask: true });
    //           wx.request({
    //             url: main.localUrl + 'mobileXcx/getOpenId', //仅为示例，并非真实的接口地址
    //             data: {
    //               code: res.code
    //             },
    //             header: {
    //               'content-type': 'application/json' // 默认值
    //             },
    //             success: function (openIdRes) {
    //               console.log(openIdRes);
    //               // 判断openId是否获取成功
    //               if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
    //                 // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
    //                 console.info("登录成功返回的openId：" + openIdRes.data.openid);
    //                 app.globalData.openId = openIdRes.data.openid;

    //               } else {
    //                 console.info("获取用户openId失败else");
    //                 app.globalData.openId = "oE-cD5gyPE0JfdEV6NuqjMnHqxpw";
    //               }
    //             },
    //             fail: function (error) {
    //               console.info("获取用户openId失败");
    //               console.info(error);

    //             },
    //             complete:function(){
    //               wx.hideLoading()
    //             }
    //           })
    //         }
    //       }
    //     });
    //   }, fail: function () {
    //     wx.showModal({
    //       title: '警告',
    //       content: '您点击了拒绝授权,将无法正常显示个人信息,快捷登录等,点击确定重新获取授权。',
    //       success: function (res) {
    //         if (res.confirm) {
    //           wx.openSetting({
    //             success: (res) => {
    //               if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
    //                 wx.getUserInfo({
    //                   success: function (res) {
    //                     var userInfo = res.userInfo;
    //                     app.globalData.userInfo = res.userInfo;
    //                     wx.showLoading({ mask: true });
    //                     //获取openid
    //                     wx.login({
    //                       success: function (res) {
    //                         if (res.code) {
    //                           //获取openId
    //                           wx.request({
    //                             url: main.localUrl + 'mobileXcx/getOpenId', //仅为示例，并非真实的接口地址
    //                             data: {
    //                               code: res.code
    //                             },
    //                             header: {
    //                               'content-type': 'application/json' // 默认值
    //                             },
    //                             success: function (openIdRes) {
    //                               console.log(openIdRes);
    //                               // 判断openId是否获取成功
    //                               if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
    //                                 // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
    //                                 console.info("登录成功返回的openId：" + openIdRes.data.openid);
    //                                 app.globalData.openId = openIdRes.data.openid;
    //                               } else {
    //                                 console.info("获取用户openId失败");
    //                               }
    //                             },
    //                             fail: function (error) {
    //                               console.info("获取用户openId失败");
    //                               console.info(error);

    //                             },
    //                             complete: function () {
    //                               wx.hideLoading()
    //                             }
    //                           })
    //                         }
    //                       }
    //                     });
    //                   }
    //                 })
    //               }

    //             }, fail: function (res) {

    //             }, complete: function () {
                  
    //             }
    //           })

    //         } else {
    //           console.log("取消")
              
    //         }
    //       }
    //     })
    //   }, complete: function (res) {

    //   }
    // })
  },
  
  
})
