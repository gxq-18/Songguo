var main = require('../../../utils/main.js');
const qiniuUploader = require("../../../utils/qiniuUploader");
//获取应用实例
const app = getApp()


Page({
  data: {
    bpImage: 'http://p7mq9gjza.bkt.clouddn.com/t_me_head.png',
    teacher: [],
    circleList: [],
    content: "",
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    totalPage: 0,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    releaseFocus: false, //回复
    releaseText: "评论",
    releaseCircle_id: "",
    releaseParent_id: "",
    delCommentId: 0,
    delCirclIndex: "",
    dexCommentIndex: "",
    releaseIndex: "",
    pullDownRefresh: false,
    actionSheetHidden: true,
    actionSheetHidden2: true,
    actionSheetHidden2: true,
    actionSheetHidden3: true,
    showModalStatus: false,
  },
  onLoad: function (options) {
    if (options.fx == 'h') {
      wx.navigateTo({
        url: "../xiangqing/xiangqing?id=" + options.id + "&fx=h",
      })
    }
    var that = this;
    main.initQiniu();//初始化七牛
    var bpImage = app.globalData.teacher.bp_image;
    if (null == bpImage || "" == bpImage) {
      bpImage = "http://p7mq9gjza.bkt.clouddn.com/t_me_head.png";
    }

    this.setData({
      teacher: app.globalData.teacher,
      bpImage: bpImage
    });

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight + 700
        });
      }
    });
    this.fetchSearchList();
    
    
  },
  // 更换封面
  actionSheetChange: function (e) {

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  // 发布家长圈
  actionSheetChange2: function (e) {
    // this.setData({
    //   actionSheetHidden2: !this.data.actionSheetHidden2
    // });
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../parentCircleFb/parentCircleFb",
    })
  },
  // 删除评论
  actionSheetChange3: function (e) {
    this.setData({
      actionSheetHidden3: !this.data.actionSheetHidden3
    });
  },
  addContent: function (e) {
    console.log(e.detail.value);
    this.setData({
      content: e.detail.value
    })
  },
  previewImage: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = e.currentTarget.dataset.src;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  previewVio: function (e) {
    //获取当前图片的下标
    var src = e.currentTarget.dataset.src;
    console.log(src);
    wx.previewVideo({
      current: 1,
      urls: src
    })
  },
  circle: function () {
    wx.navigateTo({
      url: "../parentCircle/parentCircle",
    })
  },
  circleImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        var imgmodel = JSON.stringify(res.tempFilePaths);
        wx.navigateTo({
          url: "../parentCircle/parentCircle?imgmodel=" + imgmodel + "&tp=0",
        })
        that.actionSheetChange2();
      }
    })
  },
  circleVio: function () {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        wx.navigateTo({
          url: "../parentCircle/parentCircle?vioUrl=" + res.tempFilePath + "&tp=1",
        })
        that.actionSheetChange2();
      }
    })
  },
  //分页搜索家长圈
  fetchSearchList: function () {
    let that = this;
    // searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
    // callbackcount = that.data.callbackcount; //返回数据的个数  
    //访问网络  
    circleList(that.data.searchPageNum, that.data.callbackcount, (data) => {
      console.log(data.dataInfo.dataList);
      //console.log(data.dataInfo.dataList[0].img_path[0]);  获得图片列表
      //判断是否有数据，有则取数据   
      if (data.dataInfo.dataList != null && data.dataInfo.dataList.length != 0) {

        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.dataInfo.dataList : searchList = that.data.circleList.concat(data.dataInfo.dataList)
        that.setData({
          circleList: searchList, //获取数据数组 
          searchLoading: true   //把"上拉加载"的变量设为false，显示  
        });
        //判断页码是否是最后一页
        if (data.dataInfo.totalPage <= that.data.searchPageNum) {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false,  //把"上拉加载"的变量设为false，隐藏 
          });
        }
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: false, //把“没有数据”设为true，显示  
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
  onReachBottom: function () {
    this.searchScrollLower();
  },
  onPullDownRefresh: function () {
    // console.log('--------下拉刷新-------')
    // console.log("sdf");
    // wx.hideNavigationBarLoading() //完成停止加载
    // wx.stopPullDownRefresh() //停止下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.backLoad();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

  },
  backLoad() {
    this.setData({
      circleList: [],
      searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
      callbackcount: 15,      //返回数据的个数  
      totalPage: 0,
      searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
      searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
    })
    this.fetchSearchList();
  },
  // 点赞、取消点赞
  selLike: function (e) {
    var that = this;
    var circle_id = e.currentTarget.dataset.circle_id;
    var isLike = e.currentTarget.dataset.is_like;
    var index = e.currentTarget.dataset.index;
    circleLike(circle_id, isLike, (data) => {
      that.data.circleList[index].is_like = data.dataInfo.isLike;
      that.data.circleList[index].likeNameStr = data.dataInfo.likeNameStr;
      this.setData({
        circleList: that.data.circleList
      })
    })
  },
  // 隐藏回复
  releaseBlur: function () {
    this.setData({
      releaseFocus: false
    })
  },
  /**
* 点击回复
*/
  bindReply: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var cpccIndex = e.currentTarget.dataset.cpccIndex;

    var circle_id = e.currentTarget.dataset.circle_id;
    var parent_id = e.currentTarget.dataset.parent_id;
    var parent_tid = e.currentTarget.dataset.parent_tid;
    var cid = e.currentTarget.dataset.cid;

    var releaseText = e.currentTarget.dataset.parent_name;
    if (parent_tid == that.data.teacher.id) {
      this.setData({
        actionSheetHidden3: false,
        delCommentId: cid,
        delCirclIndex: index,
        dexCommentIndex: cpccIndex,
      })
    } else {
      if (releaseText != null && releaseText != "") {
        releaseText = "回复 " + releaseText;
      } else {
        releaseText = "评论";
      }

      this.setData({
        releaseFocus: true,
        releaseIndex: index,
        releaseCircle_id: circle_id,
        releaseParent_id: parent_id,
        releaseText: releaseText,
      })
    }

  },
  bindReply1: function (e) {
    //console.log("id="+e.currentTarget.dataset.circle_id);
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../parentCircle/parentCircle?id=" + e.currentTarget.dataset.circle_id,
    })
  },

  //发送回复信息
  addCommentL: function () {
    var that = this;
    var releaseIndex = that.data.releaseIndex;
    var releaseCircle_id = that.data.releaseCircle_id;
    var releaseParent_id = that.data.releaseParent_id;
    var content = that.data.content;
    saveComment(releaseCircle_id, content, releaseParent_id, (data) => {
      that.data.circleList[releaseIndex].cpccList = data.dataInfo.cpccList;
      this.setData({
        circleList: that.data.circleList,
        releaseFocus: false
      })
    })
  },
  //删除家长圈
  delCpc: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: main.localUrl + 'mobileXcx/delCpc', //仅为示例，并非真实的接口地址
      data: {
        circle_id: id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.succeed == '000') {
          that.data.circleList.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            circleList: that.data.circleList
          })
        }
      }
    })
  },
  //删除评论
  delComment: function (e) {
    var that = this;
    var id = that.data.delCommentId;
    wx.request({
      url: main.localUrl + 'mobileXcx/delComment', //仅为示例，并非真实的接口地址
      data: {
        cId: id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.succeed == '000') {
          that.data.circleList[that.data.delCirclIndex].cpccList.splice(that.data.dexCommentIndex, 1)
          that.setData({
            circleList: that.data.circleList
          })
          that.actionSheetChange3();
        }
      }
    })
  },
  // 更换封面
  bpImage: function () {
    var _this = this;
    main.initQiniu();//初始化七牛
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      success: function (res) {
        wx.navigateTo({
          url: "../../wx-cropper/index?url=" + res.tempFilePaths[0] + "&tp=1",
        })
        _this.actionSheetChange();
      }
    })
  },

  showModal: function (e) {
    var videoUrl = e.currentTarget.dataset.src;
    wx.navigateTo({
      url: "../parentCircleListVio/parentCircleListVio?videoUrl=" + videoUrl,
    })
    // this.setData({
    //   videoUrl: videoUrl
    // })
    // // 显示遮罩层
    // var animation = wx.createAnimation({
    //   duration: 200,
    //   timingFunction: "linear",
    //   delay: 0
    // })
    // this.animation = animation
    // animation.translateY(300).step()
    // this.setData({
    //   animationData: animation.export(),
    //   showModalStatus: true
    // })
    // setTimeout(function () {
    //   animation.translateY(0).step()
    //   this.setData({
    //     animationData: animation.export()
    //   })
    // }.bind(this), 200)
  },
  xqym:function(e){
    wx.navigateTo({
      url: "../xiangqing/xiangqing?id=" + e.currentTarget.dataset.circle_id,
    }) 

  },
  hideModal: function () {
    this.setData({
      videoUrl: ""
    })
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  //查询位置
  openMap: function (e) {
    var latitude = parseFloat(e.currentTarget.dataset.latitude);
    var longitude = parseFloat(e.currentTarget.dataset.longitude);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })
  },
  preventD: function () { },


})
//查询家长圈集合
function circleList(pageindex, callbackcount, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/circleListBypublic', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      account_type: 1,
      account_code: app.globalData.teacher.id,
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

//查询点赞、取消点赞
function circleLike(circle_id, isLike, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/circleLike', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      account_type: 1,
      account_code: app.globalData.teacher.id,
      circle_id: circle_id,
      isLike: isLike,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      dataList(res.data)
    }
  })
}
//回复
function saveComment(circle_id, content, parent_id, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/addComment', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      account_type: 1,
      account_code: app.globalData.teacher.id,
      circle_id: circle_id,
      content: content,
      parent_id: parent_id,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      dataList(res.data)
    }
  })
}