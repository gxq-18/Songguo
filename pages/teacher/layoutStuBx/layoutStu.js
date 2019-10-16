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
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    theme_name: "",
    curriculum_form: "",
    content: "",
    imgs: [],
    roomname: "",
    latitude: "",
    longitude: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var noIds = options.noIds;
    var ccm_id = options.ccm_id;
    var class_time = options.class_time;
    var theme_name = options.theme_name;
    var curriculum_form = options.curriculum_form;
    
    this.setData({
      noIds: noIds,
      ccm_id: ccm_id,
      class_time: class_time,
      theme_name: theme_name,
      curriculum_form: curriculum_form
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight + 100
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
  wxSearchInput: function (e) {
    this.setData({
      theme_name: e.detail.value
    })
  },
  curriculum_form: function (e) {
    this.setData({
      curriculum_form: e.detail.value
    })

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
  },
  /* 点击减号 */
  bindMinus: function (e) {
    var componentid = e.currentTarget.dataset.componentid;
    var list = this.data.carts;
    var num = list[componentid].count;
    if (num > 1) {
      num--;
      // 不作过多考虑自增1
      // 只有大于一件的时候，才能normal状态，否则disable状态
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      list[componentid].count = num;
      list[componentid].minusStatus = minusStatus;
      // 将数值与状态写回
      this.setData({
        carts: list
      });
    }

  },
  /* 点击加号 */
  bindPlus: function (e) {
    var componentid = e.currentTarget.dataset.componentid;
    var list = this.data.carts;
    var num = list[componentid].count;
    num++;
    // 不作过多考虑自增1
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';

    list[componentid].count = num;
    list[componentid].minusStatus = minusStatus;
    // 将数值与状态写回
    this.setData({
      carts: list
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    var componentid = e.currentTarget.dataset.componentid;
    var list = this.data.carts;

    if (num > 1) {
      // 不作过多考虑自增1
      // 只有大于一件的时候，才能normal状态，否则disable状态
      var minusStatus = num < 1 ? 'disabled' : 'normal';

      list[componentid].count = num;
      list[componentid].minusStatus = minusStatus;
      // 将数值与状态写回
      this.setData({
        carts: list
      });

    }
  },
  primary: function () {//点名保存
    //main.initQiniu();//初始化七牛
    var that = this;

    // if (this.data.content.length == 0) {
    //   this.setData({
    //     focusContent: true,
    //   })
    //   return;
    // }


    var isCpc = 0; //是否发布到家长圈
    // if (that.data.isCheckF) {
    //   isCpc = 1;
    // }
    //查看权限
    var lookType = "";
    // if (that.data.isCheckF2) {
    //   lookType += ",0"
    // }
    // if (that.data.isCheckF3) {
    //   lookType += ",1"
    // }

    //获取选中的学员
    var thisCpc = [];
    for (var i = 0; i < that.data.carts.length; i++) {
      if (that.data.carts[i].isSelect) {
        that.data.carts[i].cscState = 0;
        thisCpc.push(that.data.carts[i]);
      }
    }

    thisCpc = JSON.stringify(thisCpc);

    var imgPath = "";
    // for (var i = 0; i < that.data.imgs.length; i++) {
    //   qiniuUploader.upload(that.data.imgs[i], (qiniu) => {
    //     if (null != qiniu.imageURL && "" != qiniu.imageURL) {
    //       if (imgPath == "") {
    //         imgPath = qiniu.imageURL;
    //       } else {
    //         imgPath += "," + qiniu.imageURL;
    //       }
    //     }
    //   })
    // }
    wx.showLoading({ mask: true });
    setTimeout(function () {
      // 消课保存
      wx.request({
        url: main.localUrl + 'mobileXcx/fireClass', //仅为示例，并非真实的接口地址
        data: {
          crm_code: main.crm_code,
          tId: app.globalData.teacher.id,
          ccm_id: that.data.ccm_id,
          class_time: that.data.class_time,
          theme_name: that.data.theme_name,
          content: that.data.content,
          imageList: imgPath,
          isCpc: isCpc,
          isUrl: 0,
          urlPic: "",
          roomname: that.data.roomname,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          lookType: lookType,
          thisCpc: thisCpc,
          curriculum_form: that.data.curriculum_form,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {

          if (res.data.succeed == "000") {
            wx.hideLoading()
            wx.showToast({
              title: '消课成功',
              icon: 'success',
              duration: 2000,
              mask: true,
              complete: function () {
                setTimeout(function () {
                  //成功
                  var pages = getCurrentPages(); // 当前页面  
                  var beforePage = pages[pages.length - 2]; // 前一个页面
                  beforePage.backLoad();
                  wx.navigateBack();  //返回上个页面
                }, 1000)
              }
            })
          }
        }
      })
    }, 2500)
  },
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