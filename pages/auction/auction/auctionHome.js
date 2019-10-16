// pages/auction/auction/auctionHome.js
var main = require('../../../utils/main.js');
//获取应用实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      navbar: ['正在拍卖', '拍卖预告','拍卖结束','我的拍卖'],
      currentTab: 0,
      screenWidth: 0,
      screenHeight: 0,
      imgwidth: 0,
      imgheight: 0,
      activityList: [],
      content: "",
      type:0,
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
      callbackcount: 15,      //返回数据的个数  
      totalPage: 0,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
      hideModal: false, //模态框的状态  true-隐藏  false-显示
      userName: '',
      mobile: '',
      address: "",
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      activityList: [],
      type: e.currentTarget.dataset.idx,
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
      callbackcount: 15,      //返回数据的个数  
      totalPage: 0,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    })
      this.fetchSearchList();
    
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
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight + 700
        });
      }
    });

    that.setData({
      openId: app.globalData.openId
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
  view: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../auctionView/auctionView?id=" + id ,
    })
  },
  //分页搜索活动
  fetchSearchList: function () {
    let that = this;
    // searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
    // callbackcount = that.data.callbackcount; //返回数据的个数  
    //访问网络  
    findList(that.data.searchPageNum, that.data.callbackcount, that.data.type, that.data.currentTab, (data) => {
     
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
    this.countDown();
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
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.activityList;
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = "";
      if (this.data.type==0){
        endTime = new Date(o.end_time.replace(/-/g, '/')).getTime();
      } else if (this.data.type == 1){
        endTime = new Date(o.star_time.replace(/-/g, '/')).getTime();
      } else if (this.data.type == 3){
        endTime = new Date(o.end_time.replace(/-/g, '/')).getTime();
      }
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          isTrue:true,
          day: this.timeFormat(day),
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else {//活动已结束，全部设置为'00'
        obj = {
          isTrue: false,
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
      }
      o.timeDay= obj;
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ activityList: endTimeList })
    setTimeout(this.countDown, 1000);
  },
  tourist: function (e) {
    var that = this;
    let index = parseInt(e.target.dataset.index);
    var userInfo = e.detail.userInfo;
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
               
                wx.hideLoading();
                // 判断openId是否获取成功
                if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                  // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
                  console.info("登录成功返回的openId：" + openIdRes.data.openid);
                  app.globalData.openId = openIdRes.data.openid;

                  let type = 0;
                  let annual_id = that.data.activityList[index].id;
                  if (that.data.activityList[index].is_notice){
                    type=1
                  }

                  //设置提醒、取消提醒
                  wx.request({
                    url: main.localUrl + 'mobileXcx/setReminder', //仅为示例，并非真实的接口地址
                    data: {
                      type: type,
                      openId: app.globalData.openId,
                      annual_id: annual_id,
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (aucPojo) {
          
                      if (aucPojo.data.succeed=="000"){
                        that.data.activityList[index].is_notice = !that.data.activityList[index].is_notice;
                        that.setData({
                          userInfo: userInfo
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
  },
  getUserInfo: function (e) {
    var that = this;
    let index = parseInt(e.target.dataset.index);
    var userInfo = e.detail.userInfo;
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

                wx.hideLoading();
                // 判断openId是否获取成功
                if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                  // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
                  console.info("登录成功返回的openId：" + openIdRes.data.openid);
                  app.globalData.openId = openIdRes.data.openid;
                  that.setData({
                    openId: openIdRes.data.openid
                  })
                  that.backLoad();

                }
              }
            })
          }
        }
      });
    }
  },
  touristBind: function(){
    console.log("阻止冒泡事件");
  },
  // 显示遮罩层
  showModal: function (e) {
    var that = this;
    that.setData({
      hideModal: !that.data.hideModal,
      payModel: e.currentTarget.dataset.model,
      payIndex: e.currentTarget.dataset.index
    })
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
  inputAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  //购买
  onPayCao: function (e) {
    var that = this;
    let index = parseInt(e.target.dataset.index);
    if (that.data.userName.length == 0 || that.data.mobile.length == 0 || that.data.address.length == 0) {
      if (that.data.userName.length == 0) {
        that.setData({
          focus3: true
        })
      } else {
        if (that.data.mobile.length == 0) {
          that.setData({
            focus1: true
          })
        }else{
          if (that.data.address.length == 0) {
            that.setData({
              focus2: true
            })
          }
        }
      }
    } else {
      console.log(that.data.openId);
      //调取支付,添加订单
      wx.request({
        url: main.localUrl + 'mobileXcx/wxPayauction',
        data: {
          openid: that.data.openId,
          auctionId: that.data.payModel.id,
          consigneeName: that.data.userName,
          consigneeMobile: that.data.mobile,
          consigneeAddress: that.data.address,
          wxName:that.data.userInfo.nickName,
          wxIcon:that.data.userInfo.avatarUrl
        },
        method: 'GET',
        success: function (res) {
          doWxPay(res, (payState) => {
            if (payState) {
              that.data.activityList[that.data.payIndex].is_pay = !that.data.activityList[that.data.payIndex].is_pay;
              that.setData({
                hideModal: !that.data.hideModal
              })

              //发送通知
              wx.request({
                url: main.localUrl + 'mobileXcx/chujiaTongzhi', //仅为示例，并非真实的接口地址
                data: {
                  formId: e.detail.formId,
                  openId: tzOpen,
                  title: that.data.model.title,
                  name: tzName,
                  price: that.data.money,
                  id: that.data.model.id
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (openIdRes) {

                }
              })
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
  },
 
  // 查询是否有快递信息
  query: function (e) {
    var　that = this;
    wx.request({
      url: main.localUrl + 'mobileXcx/findExpress', //仅为示例，并非真实的接口地址,
      data: {
        openid: that.data.openId,
        auctionId: e.currentTarget.dataset.id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        if (res.data.dataInfo.isExpress==0){
          wx.showToast({
            title: '暂无快递信息',
            icon: 'loading',
            duration: 2000
          });
        }else{

          var expressNumber = 'https://www.kuaidi100.com/chaxun?nu=' + res.data.dataInfo.expressNumber;
          wx.showModal({
            title: '提示',
            content: '请复制链接到浏览器查询订单信息',
            confirmText: '复制',
            success: function (res) {
              if (res.confirm) {
                wx.setClipboardData({
                  data: expressNumber ,
                  success: function (res) {
                  wx.getClipboardData({
                      success: function(res) {
                            wx.showToast({
                              title: '复制成功',
                              icon: 'SUCCESS',
                              duration: 2000
                            });
                            }
                          })
                        }
                      })
                
              } else {
                console.log('用户点击取消')
              }

            }
          })
        }

      }
    })
  },
  formSubmit:function(e){
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
  }

})


//查询活动
function findList(pageindex, callbackcount, type, currentTab, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/auctionProductList', //仅为示例，并非真实的接口地址
    data: {
      type: type,
      openId: app.globalData.openId,
      currentPage: pageindex,
      rowCountPerPage: callbackcount,
      currentTab: currentTab
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      dataList(res.data)
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