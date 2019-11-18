// pages/stu/activityPay/activityPay.js
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    hidden: true,
    nocancel: false,
    pay_user:"",
    sendmsg: "classCurr_view_but",
    getmsg: "获取验证码",
    timer: 1,
    code: "",
    userName:'',
    mobile: '',
    sendCode: "",
    pay_money:0,
    inputFs:1,
    money:0,
    email:'',

    weixin:true,
    zhifubao:false,

    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    activityList: [],
    content: "",
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
    var id = options.id;
    console.log(options.id);
    findView(id, (data) => {
      var pay_user = "";
      var caType = data.ca_type;
      if (caType = 1)
        pay_user = "购买人姓名";
      if (caType = 2)
        pay_user = "报名人姓名";
      findView(id, (data) => {
        that.setData({
          model: data,
        })
        /**
       * html解析示例
       */
        WxParse.wxParse('article', 'html', data.content, that, 5);
      })
      
    })
    
    that.setData({
      userName: options.name,
      mobile: options.phone,
      id: options.id,
      email:options.email
    })
    this.fetchSearchList();
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
      title: '报名信息'
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
  
  cancel: function () {
    this.setData({
      hidden: false
    });
  },
  confirm: function () {
    this.setData({
      hidden: true
    });
    wx.navigateBack();  //返回上个页面
  },
  
  inputUser: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  inputMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  inputSendCode: function (e) {
    this.setData({
      sendCode: e.detail.value
    })
  },
  weixin:function(e){
    this.setData({
      weixin:true,
      zhifubao:false
    })
  },
  zhifubao: function (e) {
    this.setData({
      weixin: false,
      zhifubao: true
    })
  },
  button1:function(e){
    // console.log(eval(0.01+0.05));
    this.setData({
      inputFs: this.data.inputFs + 1,
      money: (this.data.pay_money * (this.data.inputFs + 1)).toFixed(2)
    })
    var n = 2;
    fomatFloat(this.data.money, n, (s) => {
      console.log(s+"···························");
      let that = this;
      that.setData({
        money:s
      })
    })
  },
  button2: function (e) {
    if(this.data.inputFs == 1){
      wx.showToast({
        title: '最少购买一份',
        duration: 1500,
        icon: 'none'
      });
    }else{
      this.setData({
        inputFs: this.data.inputFs - 1,
        money: (this.data.pay_money * (this.data.inputFs - 1)).toFixed(2)
      })
      var n = 2;
      fomatFloat(this.data.money, n,(s)=>{
        let that = this;
        that.setData({
          money: s
        })
      })
    }
  },

  /** 
 * 获取短信验证码 
 */
  sendmessg: function (e) {
    var that = this;
    if (this.data.mobile.length == 0) {
      this.setData({
        focus1: true
      })
    }else{
      if (that.data.timer == 1) {
        getSmsCode(that.data.mobile, (data) => {
          console.log(data.dataInfo.code);
          that.setData({
            code: data.dataInfo.code,
          })
        })
        that.data.timer == 0;
        var time = 60
        that.setData({
          sendmsg: "sendmsgafter",
        })
        var inter = setInterval(function () {
          that.setData({
            getmsg: time + "s后重发",
            timer: 0
          })
          time--
          if (time < 0) {
            that.data.timer = 1
            clearInterval(inter)
            that.setData({
              sendmsg: "classCurr_view_but",
              getmsg: "获取验证码",
              timer: 1
            })
          }
        }, 1000)
      }
    }
  },
  //购买
  onPayCao: function (e) {
    var that = this;

    if (this.data.userName.length == 0 || this.data.mobile.length == 0 ) {
      if (this.data.userName.length == 0) {
        this.setData({
          focus3: true
        })
      } else {
        if (this.data.mobile.length == 0) {
          this.setData({
            focus1: true
          })
        }
      }
    } else {
      // //判断验证码
      // if (that.data.sendCode != that.data.code) {
      //   wx.showToast({
      //     title: '验证码不正确',
      //     icon: 'none',
      //     duration: 2000,
      //     mask: true
      //   })
      // } else {

        //调取支付,添加订单

        wx.request({
          url: main.localUrl + 'mobileXcx/onPayCao', //仅为示例，并非真实的接口地址
          data: {
            crm_code: main.crm_code,
            school_code: app.globalData.cpc.school_code,
            openId: app.globalData.openId,
            // cpc_id: app.globalData.cpc.id,
            // csc_id: app.globalData.csc.id,
             ca_id: that.data.model.id,
            user_name: that.data.userName,
            user_mobile: that.data.mobile,
            money:that.data.money,
            email:that.data.email,
            copies:that.data.inputFs,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data.succeed=="000"){
              //调起支付
              wx.request({
                url: main.localUrl + 'mobileXcx/wxPay',
                data: {
                  openid: app.globalData.openId,
                  title: that.data.model.title,
                  catId: res.data.dataInfo.catId
                },
                method: 'GET',
                success: function (res) {
                  console.log(res);
                  doWxPay(res, (payState) => {
                    if (payState) {
                      that.sendMessage(e.detail.formId, app.globalData.openId, that.data.model.title)
                      that.cancel();
                    } else {
                      wx.showToast({
                        title: '支付失败',
                        icon: 'loading',
                        duration: 2000
                      });
                    }
                  })
                }
              });  
  
            }
          }
        })

      }
    // }
  },
  //报名
  onPayCas: function (e) {
    var that = this;

    if (this.data.userName.length == 0 || this.data.mobile.length == 0 ) {
      if (this.data.userName.length == 0) {
        this.setData({
          focus3: true
        })
      } else {
        if (this.data.mobile.length == 0) {
          this.setData({
            focus1: true
          })
        } 
      }
    } else {
     
        //调取支付,添加订单
        wx.request({
          url: main.localUrl + 'mobileXcx/onPayCas', //仅为示例，并非真实的接口地址
          data: {
            crm_code: main.crm_code,
            openId: app.globalData.openId,
            school_code: app.globalData.cpc.school_code,
            cpc_id: app.globalData.cpc.id,
            ca_id: that.data.model.id,
            user_name: that.data.userName,
            user_mobile: that.data.mobile,
            money: that.data.money
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data.succeed == "000") {
              //判断是否需要支付，
              if (that.data.model.is_pay == 1) {
                wx.request({
                  url: main.localUrl + 'mobileXcx/wxPay',
                  data: {
                    openid: app.globalData.openId,
                    title: that.data.model.title,
                    catId: res.data.dataInfo.catId
                  },
                  method: 'GET',
                  success: function (res) {
                    console.log(res);
                    doWxPay(res, (payState) => {
                      if (payState) {
                        that.cancel();
                      } else {
                        wx.showToast({
                          title: '支付失败',
                          icon: 'loading',
                          duration: 2000
                        });
                      }
                    })
                  }
                });  
              } else {
                that.cancel();
              }
              
              
            }
          }
        }) 
      }
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
  view: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../activityView/activityView?id=" + id + "&isPay=0",
    })
  },
  //分页搜索活动
  fetchSearchList: function () {
    let that = this;
    // searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
    // callbackcount = that.data.callbackcount; //返回数据的个数  
    //访问网络  
    
    findList( that.data.id,that.data.searchPageNum, that.data.callbackcount, (data) => {
      //判断是否有数据，有则取数据  
      if (data.dataInfo.dataList != null && data.dataInfo.dataList.length != 0) {

        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.dataInfo.dataList : searchList = that.data.activityList.concat(data.dataInfo.dataList)
        that.setData({
          pay_money: data.dataInfo.dataList[0].pay_money,
          money: data.dataInfo.dataList[0].pay_money,
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

function findView(id, data) {
  wx.request({
    url: main.localUrl + 'mobileXcx/stuActivityById', //仅为示例，并非真实的接口地址
    data: {
      id: id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      data(res.data.dataInfo.act);
    }
  })
}

function getSmsCode(mobile, data) {

  wx.request({
    url: main.localUrl + 'mobileXcx/getSmsCode', //仅为示例，并非真实的接口地址
    data: {
      mobile: mobile,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      data(res.data)
    }
  })

}

//发起支付
function doWxPay(param, payState) {
  //小程序发起微信支付  
  wx.requestPayment({
    timeStamp: param.data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错，我这边在java后端包装成了字符串类型了  
    nonceStr: param.data.nonceStr,
    package: param.data.package,
    signType: 'MD5',
    paySign: param.data.paySign,
    success: function (event) {
      // success     
      console.log(event);

      payState(true);
    },
    fail: function (error) {
      // fail     
      console.log("支付失败")
      console.log(error)
      payState(false);
    },
    complete: function () {
      // complete     
      console.log("pay complete")
    }
  });

}  



//查询活动
function findList(id,pageindex, callbackcount, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/stuActivityList', //仅为示例，并非真实的接口地址
    data: {
      id1:id,
      crm_code: main.crm_code,
      account_code: app.globalData.cpc.id,
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

//四舍五入并保留两位小数
function fomatFloat(money, n) {
  var f = parseFloat(money);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(money * Math.pow(10, n)) / Math.pow(10, n); // n 幂   
  var s = f.toString();
  var rs = s.indexOf('.');
  //判定如果是整数，增加小数点再补0
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + n) {
    s += '0';
  }
  console.log(s+"!!!!!!!!!!!!!!");
  return s;
}  