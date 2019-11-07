// pages/classhome/classhome.js
var main = require('../../utils/main.js');

//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    home_01: "../../image/login_student@2x.png",
    home_01_old: "../../image/login_student@2x.png",
    home_01_btn: "../../image/stuloginCheck.png",
    home_02: "../../image/login_teather@2x.png",
    posterList: [],
    teachericon:'',
    
    stuloginCheck: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      userInfo: app.globalData.userInfo
    })
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

      }
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
    wx.setNavigationBarTitle({
      title: '十艺登录'
    })
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
  mytouchstart: function (e) {
    this.setData({
      home_01: this.data.home_01_btn,
    })
  },
  stuNavigate: function (e) {
    // main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800);//收集formId
    var that = this;
    var userInfo = e.detail.userInfo;
    
    app.globalData.userInfo = e.detail.userInfo;
    // if (null != app.globalData.userInfo) {
    if (userInfo != null) {
     
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


                  wx.request({
                    url: main.localUrl + 'mobileXcx/getUserByOpenId', //仅为示例，并非真实的接口地址
                    data: {
                      crm_code: main.crm_code,
                      type: 1,
                      openId: openIdRes.data.openid
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      that.setData({
                        home_01: that.data.home_01_old,
                      })

                      console.log(res.data)
                      //为绑定，跳转绑定页面
                      if (res.data.succeed != "000") {
                        wx.navigateTo({
                          url: '../binding/binding'
                        })
                      } else {
                        if (res.data.dataInfo.cpc != null) {
                          app.globalData.cpc = res.data.dataInfo.cpc;
                        }
                        if (res.data.dataInfo.csc != null) {
                          app.globalData.csc = res.data.dataInfo.csc;
                        }

                        wx.navigateTo({
                          url: '../stu/home/home'
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        }
      });
    }



    // }


  },
  teaLogin: function (e) {//快速登录，未绑定，先绑定
    // main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800);//收集formId
    // if (null == app.globalData.userInfo) {
    //   this.shouquan();
    // }  else{
    var userInfo = e.detail.userInfo;
    console.log("userInfo↓↓↓↓↓↓↓↓");
    console.log(userInfo);
    app.globalData.userInfo = e.detail.userInfo;
    if (userInfo != null) {
      //获取openid
      wx.login({
        success: function (res) {
          if (res.code) {
            //获取openId
            wx.showLoading({ mask: true });
            console.log(res.code);
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
 
                  wx.request({ 
                    url: main.localUrl + 'mobileXcx/getUserByOpenId', //仅为示例，并非真实的接口地址
                    data: {
                      crm_code: main.crm_code,
                      type: 0,
                      openId: openIdRes.data.openid
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      //为绑定，跳转绑定页面
                      if (res.data.succeed != "000") {
                        wx.navigateTo({
                          url: '../login/login'
                        })
                      } else {
                        if (res.data.dataInfo.tea != null) {
                          app.globalData.teacher = res.data.dataInfo.tea;
                          console.log("laoshiid=" + app.globalData.teacher.id);
                        }
                        wx.navigateTo({
                          url: '../teacher/home/home'
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        }
      });
    }



    // }
  },
  tourist: function (e) {
    // main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800);//收集formId
    // if (null!=app.globalData.userInfo){
    var userInfo = e.detail.userInfo;
    console.log(userInfo);
    app.globalData.userInfo = e.detail.userInfo;
    if (userInfo != null) {
      this.setData({
        userInfo: userInfo
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
                    url: "../tourist/mine/mine",
                  })

                }
              }
            })
          }
        }
      });
    }

    //  }else{
    //     this.shouquan();

    //  }    
  },
  poster: function (e) {

    var userInfo = e.detail.userInfo;
    app.globalData.userInfo = e.detail.userInfo;
    if (userInfo != null) {
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
                    url: '../poster/posterList/posterList'
                  })

                }
              }
            })
          }
        }
      });
    }

  },
  formSubmit: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
  }
})