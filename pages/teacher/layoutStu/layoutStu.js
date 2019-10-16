// pages/teacher/layoutStu/layoutStu.js
var main = require('../../../utils/main.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    isAllSelect: false,
    carts: [], // 班级学员集合
    noIds:"",
    keyword:"",
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    totalPage: 0,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var noIds = options.noIds;
    this.setData({
      noIds: noIds
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight + 400
        });
      }
    });

    //查询其它班学生
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
  // 获取输
  wxSearchInput: function (e) {
    var that = this;
    this.setData({
      keyword: e.detail.value,
      isFromSearch:false,
      carts:[],
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
      callbackcount: 15,      //返回数据的个数  
      totalPage: 0,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏
    })
    setTimeout(function () {
      that.fetchSearchList(); 
    }, 1000);
  },
  //勾选事件处理函数  
  switchSelect: function (e) {
    // 获取item项的id，和数组的下标值  
    var i = 0;
    let id = e.target.dataset.id,

      index = parseInt(e.target.dataset.index);
    this.data.carts[index].isSelect = !this.data.carts[index].isSelect;

    //是否全选判断
    var isAll = true;
    for (i = 0; i < this.data.carts.length; i++) {
      if (!this.data.carts[i].isSelect) {
        isAll = false;
      }
    }

    this.setData({
      carts: this.data.carts,
      isAllSelect: isAll,
    })
  },
  //全选
  allSelect: function (e) {
    //处理全选逻辑
    let i = 0;
    if (!this.data.isAllSelect) {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = true;
      }
    }
    else {
      for (i = 0; i < this.data.carts.length; i++) {
        this.data.carts[i].isSelect = false;
      }
    }
    this.setData({
      carts: this.data.carts,
      isAllSelect: !this.data.isAllSelect,
    })
  },
  //分页搜索学员
  fetchSearchList: function () {
    let that = this;
    // searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
    // callbackcount = that.data.callbackcount; //返回数据的个数  
    //访问网络  
    findClassCpc(that.data.keyword, that.data.noIds, that.data.searchPageNum, that.data.callbackcount, (data) => {

      //判断是否有数据，有则取数据  
      if (data.dataInfo.dataList !=null && data.dataInfo.dataList.length != 0) {
        for (var i = 0; i < data.dataInfo.dataList.length; i++) {
          data.dataInfo.dataList[i].cpcType = 1;
        }
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.dataInfo.dataList : searchList = that.data.carts.concat(data.dataInfo.dataList)
        that.setData({
          carts: searchList, //获取数据数组  
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
  // 确定
  showModal:function(){
    var pages = getCurrentPages(); // 当前页面  
    var beforePage = pages[pages.length - 2]; // 前一个页面
    for (var i = 0; i < this.data.carts.length; i++) {
      if(this.data.carts[i].isSelect){
          beforePage.data.carts.push(this.data.carts[i]);
      }
    }
    beforePage.setData({
      carts: beforePage.data.carts
    })
    wx.navigateBack();  //返回上个页面
  }

})  


//查询班级学员
function findClassCpc( keyword, noIds, pageindex, callbackcount, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/cpclList', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      keyword: keyword,
      noIds: noIds,
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