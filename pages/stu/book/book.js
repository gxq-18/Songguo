// pages/stu/scanningBook/scanningBook.js
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
    bookLoaningList: [],
    content: "",
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 5,      //返回数据的个数  
    totalPage: 0,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    startX: 0, //开始坐标
    startY: 0

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
    this.fetchSearchList();
  },
  //分页搜索家长圈
  fetchSearchList: function () {
    let that = this;
    // searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
    // callbackcount = that.data.callbackcount; //返回数据的个数  
    //访问网络  
    findList(that.data.searchPageNum, that.data.callbackcount, (data) => {

      //判断是否有数据，有则取数据  
      if (data.dataInfo.dataList != null && data.dataInfo.dataList.length != 0) {

        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.dataInfo.dataList : searchList = that.data.bookLoaningList.concat(data.dataInfo.dataList)
        that.setData({
          bookLoaningList: searchList, //获取数据数组  
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
      bookLoaningList: [],
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
      callbackcount: 15,      //返回数据的个数  
      totalPage: 0,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
    })
    this.fetchSearchList();
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例  
    var viewWidth = 180,           //设置图片显示宽度，  
      viewHeight = 180 / ratio;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },
  scanning: function () {
    var that = this;
    //判断是否需要缴纳借书定金
    wx.request({
      url: main.localUrl + 'mobileXcx/bookLoan', //仅为示例，并非真实的接口地址
      data: {
        crm_code: main.crm_code
      },
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        if (res.data.dataInfo.css.book_loan_switch==1){//需要交费
          var book_loan_money = res.data.dataInfo.css.book_loan_money;
          // 判断是否已交过费
          if (app.globalData.cpc.book_deposit_money<=0){
            wx.showModal({
              title: '图书借阅',
              content: '需先缴纳图书押金 ￥' + book_loan_money+' 后借阅，请点击确认进行缴纳。',
              success: function (res) {
                if (res.confirm) {
                  //调起支付
                  wx.request({
                    url: main.localUrl + 'mobileXcx/wxPayBook',
                    data: {
                      openid: app.globalData.openId,
                      crm_code: main.crm_code,
                      cpc_id: app.globalData.cpc.id
                    },
                    method: 'GET',
                    success: function (res) {
                      console.log(res);
                      doWxPay(res, (payState) => {
                        console.log(payState);
                        if (payState) {
                            // 支付成功
                          app.globalData.cpc.book_deposit_money = book_loan_money;
                          

                            wx.scanCode({
                              success: (res) => {
                                wx.navigateTo({
                                  url: "../scanningBook/scanningBook?bookId=" + res.result + "&huan=0",
                                })
                            },
                            fail: (res) => {
                              wx.showToast({
                                title: '扫码失败',
                                icon: 'success',
                                duration: 2000
                              })
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
              }
            })
          }else{
            wx.scanCode({
              success: (res) => {
                // this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
                wx.navigateTo({
                  url: "../scanningBook/scanningBook?bookId=" + res.result + "&huan=0",
                })
              },
              fail: (res) => {
                wx.showToast({
                  title: '扫码失败',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          }
        }else{
          wx.scanCode({
            success: (res) => {
              // this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
              wx.navigateTo({
                url: "../scanningBook/scanningBook?bookId=" + res.result + "&huan=0",
              })
            },
            fail: (res) => {
              wx.showToast({
                title: '扫码失败',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },
  returnBook: function () {
    var that = this;

    wx.scanCode({
      success: (res) => {
        // this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
        wx.navigateTo({
          url: "../scanningBook/scanningBook?bookId=" + res.result + "&huan=1",
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '扫码失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  // 以下左滑删除
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.bookLoaningList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      bookLoaningList: this.data.bookLoaningList
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
    that.data.bookLoaningList.forEach(function (v, i) {
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
      bookLoaningList: that.data.bookLoaningList
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

    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var state = e.currentTarget.dataset.state;
    if (state==0){
      wx.showToast({
        title: '图书未还，不可删除！',
        icon: 'loading',
        duration: 2000,
        mask: true
      })
    }else{
      wx.request({
        url: main.localUrl + 'mobileXcx/bookLoaningDel', //仅为示例，并非真实的接口地址
        data: {
          id: id
        },
        method: 'GET',
        header: { 'content-Type': 'application/json' },
        success: function (res) {
          if (res.statusCode == 200) {
            that.data.bookLoaningList.splice(e.currentTarget.dataset.index, 1)
            that.setData({
              bookLoaningList: that.data.bookLoaningList
            })
          }
        }
      })
    }
  },
  
})


//查询借阅记录集合
function findList(pageindex, callbackcount, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/bookLoaning', //仅为示例，并非真实的接口地址
    data: {
      cpc_id: app.globalData.cpc.id,
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