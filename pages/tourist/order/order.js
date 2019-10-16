// pages/stu/order/order.js
var main = require('../../../utils/main.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,  
    pay_state:"",
    dataList: [],
    dataListNoPay: [],
    dataListPay: [],
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

    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          scrollHeight: res.windowHeight + 500
        });
      }
    });

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
    /** 
     * 滑动切换tab 
     */  
  bindChange: function( e ) {  
  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
    this.backLoad(); 
  },  
  /** 
   * 点击tab切换 
   */  
  swichNav: function( e ) {  
  
    var that = this;  
  
    if( this.data.currentTab === e.target.dataset.current ) { 
      return false;  
    } else {  
      that.setData( {  
        currentTab: e.target.dataset.current  
      })

    }  
  } ,
  pay: function (e) {
    var model = JSON.stringify(e.currentTarget.dataset.model);
    wx.navigateTo({
      url: "../orderPay/orderPay?model=" + model,
    })
  },
  //分页搜索活动
  fetchSearchList: function () {
    let that = this;
    // searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
    // callbackcount = that.data.callbackcount; //返回数据的个数  
    //访问网络  
   

    findList(that.data.currentTab,that.data.searchPageNum, that.data.callbackcount, (data) => {
      console.log(data.dataInfo.dataList);
      //判断是否有数据，有则取数据  
      if (data.dataInfo.dataList != null && data.dataInfo.dataList.length != 0) {

        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.dataInfo.dataList : searchList = that.data.dataList.concat(data.dataInfo.dataList)
        if (that.data.currentTab=="0"){
          that.setData({
            dataList: searchList, //获取数据数组  
            searchLoading: true   //把"上拉加载"的变量设为false，显示  
          });
        } else if (that.data.currentTab == "1") {
          that.setData({
            dataListNoPay: searchList, //获取数据数组  
            searchLoading: true   //把"上拉加载"的变量设为false，显示  
          });
        } else if (that.data.currentTab == "2") {
          that.setData({
            dataListPay: searchList, //获取数据数组  
            searchLoading: true   //把"上拉加载"的变量设为false，显示  
          });
        }
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
        dataList: [],
        dataListNoPay: [],
        dataListPay: [],
        searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
        callbackcount: 15,      //返回数据的个数  
        totalPage: 0,
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
      })
      this.fetchSearchList();
  },
  delOrder:function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '请确认删除订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: main.localUrl + 'mobileXcx/orderPayDel', //仅为示例，并非真实的接口地址
            data: {
              id: id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              var currentTab = that.data.currentTab;
              if (currentTab == 0) {
                that.data.dataList.splice(index, 1)
                that.setData({
                  dataList: that.data.dataList
                })
              } else if (currentTab == 1) {
                that.data.dataListNoPay.splice(index, 1)
                that.setData({
                  dataListNoPay: that.data.dataListNoPay
                })
              } else if (currentTab == 2) {
                that.data.dataListPay.splice(index, 1)
                that.setData({
                  dataListPay: that.data.dataListPay
                })
              }
            }
          })
        }
      }
    })
  },
  
})


//查询活动
function findList(currentTab,pageindex, callbackcount, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/myOrderList', //仅为示例，并非真实的接口地址
    data: {
      currentTab: currentTab,
      openId: app.globalData.openId,
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