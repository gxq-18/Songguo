// pages/teacher/layoutDetail/detail.js
var main = require('../../../utils/main.js');
//获取应用实例
var WxSearch = require('wxSearch/wxSearch.js')
const qiniuUploader = require("../../../utils/qiniuUploader");
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ccm_id: "",
    class_time:"",
    isAllSelect: false,
    carts: [], // 班级学员集合
    showModalType:false,
    showModalStatus: false,
    theme_name:"",
    curriculum_form:"",
    content: "",
    imgs: [],
    roomname: "",
    latitude: "",
    longitude: "",
    isCheckF: true,//分享到班级圈
    isCheckF2: true,//仅老师可见
    isCheckF3: true,//所有人可见
    // 搜索
    sercherStorage: [],
    inputValue: "",             //搜索框输入的值  
    StorageFlag: true,         //显示搜索记录标志位  
    scrollHeight: 0,
    // 主题
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    main.initQiniu();//初始化七牛
    var that = this
    var ccm_id = options.ccm_id;
    var class_time = options.class_time;
    console.log(class_time+"-----");
    this.setData({
      ccm_id: ccm_id,
      class_time: class_time
    })
    //初始化的时候渲染wxSearchdata
    // WxSearch.init(that, 43, ['weappdev', '小程序', 'wxParse', 'wxSearch', 'wxNotification']);
    // WxSearch.initMindKeys(['weappdev.com', '微信小程序开发', '微信开发', '微信小程序']);
    this.lodeTheme();
    
    //初始化滑块
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight + 400
        });
      }
    });

    //查询本班学员
    this.thisClassCpc();

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
      title: '消课中心'
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
      if (!this.data.carts[i].isSelect){
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
  //发布到朋友圈
  claSelect: function (e) {    
    this.setData({
      isCheckF: !this.data.isCheckF,
    })
  },
  //仅老师
  claSelect2: function (e) {
    this.setData({
      isCheckF2: !this.data.isCheckF2,
    })
  },
  //所有人
  claSelect3: function (e) {
    this.setData({
      isCheckF3: !this.data.isCheckF3,
    })
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
      carts:list
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    var componentid = e.currentTarget.dataset.componentid;
    var list = this.data.carts;

    if(num>1){
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
  

  /*一下是弹出确认页面 */
  //显示对话框
  showModal: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800,app.globalData.openId);//收集formId
    var that = this;
    if (this.data.theme_name.length == 0) {
          this.setData({
            searchKeyword: true,
          })
    }else{
      var thisCpc = [];
      for (var i = 0; i < that.data.carts.length; i++) {
        if (that.data.carts[i].isSelect) {
          that.data.carts[i].cscState = 0;
          thisCpc.push(that.data.carts[i]);
        }
      }
      if (thisCpc.length == 0) {
        wx.showToast({
          title: '请选择学员',
          icon: 'loading',
          duration: 2000
        })
        return;
      }
      // 获取定位
      this.getAddress();
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })

      }.bind(this), 200)
    }
   
  },
  //隐藏对话框
  hideModal: function () {
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
  curriculum_form: function (e) {
    this.setData({
      curriculum_form: e.detail.value
    })

  },
  addContent:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  /**以下是上传图片 */
  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 9) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function () {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 9) {
            that.setData({
              imgs: imgs
            });
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        // console.log(imgs);
        that.setData({
          imgs: imgs
        });
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  getAddress:function(){
    var that = this;
    // 地图选择
    wx.chooseLocation({
      success: function (res) {
       
        // success
        that.setData({
          roomname: res.name,
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  checkF:function(){
    this.setData({
      isCheckF: !this.data.isCheckF,
    })
  },
  primary:function(){//点名保存
    main.initQiniu();//初始化七牛
     var that = this;

    if (this.data.content.length == 0) {
      this.setData({
        focusContent: true,
      })
      return;
    }


     var isCpc=0; //是否发布到家长圈
     if (that.data.isCheckF){
        isCpc = 1;
     }
     //查看权限
     var lookType = "";
     if (that.data.isCheckF2){
       lookType+=",0"
     }
     if (that.data.isCheckF3){
       lookType += ",1"
     }
     
     //获取选中的学员
     var thisCpc = [];
     for (var i = 0; i < that.data.carts.length; i++) {
       if (that.data.carts[i].isSelect) {
         that.data.carts[i].cscState=0;
         thisCpc.push(that.data.carts[i]);
       }
     }
     
     thisCpc = JSON.stringify(thisCpc);

     var imgPath = "";
     for (var i = 0; i < that.data.imgs.length; i++) {
       qiniuUploader.upload(that.data.imgs[i], (qiniu) => {
         if (null != qiniu.imageURL && "" != qiniu.imageURL) {
           if (imgPath == "") {
             imgPath = qiniu.imageURL;
           } else {
             imgPath += "," + qiniu.imageURL;
           }
         }
       })
     }
     wx.showLoading({ mask: true});
    setTimeout(function () {
    // 消课保存
     wx.request({
       url: main.localUrl + 'mobileXcx/fireClass', //仅为示例，并非真实的接口地址
       data: {
         crm_code: main.crm_code,
         tId: app.globalData.teacher.id,
         //tId: 49,
         ccm_id: that.data.ccm_id,
         //ccm_id:51,
         class_time: that.data.class_time,
         theme_name: that.data.theme_name,
         content:that.data.content,
         imageList: imgPath,
         isCpc: isCpc,
         isUrl:0,
         urlPic:"",
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
             complete:function(){
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
  // 以下是搜索
  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
  },
  wxSearchInput: function (e) {
    this.setData({
      theme_name: e.detail.value
    })
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
    this.setData({
      theme_name: that.data.wxSearchData.value
    })
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  searchStu:function(e){
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800);//收集formId
    var that = this;
    var noIds = "";
    for (var i = 0; i < that.data.carts.length; i++) {
        if(noIds==""){
          noIds = "'" + that.data.carts[i].cpc_id+"'";
        }else{
          noIds += ",'" + that.data.carts[i].cpc_id+"'";
        }
      }
    wx.navigateTo({
      url: "../layoutStu/layoutStu?noIds=" + noIds,
    })
  },
  //查询本班学生
  thisClassCpc:function(){
    var that = this;
    findClassCpc(that.data.ccm_id, "", "", (dataList) => {
      if (dataList!=null){
        for (var i = 0; i < dataList.length; i++) {
          dataList[i].cpcType=0;
        }
        this.setData({
          carts: dataList,
        });
      }
    })

    //查询本班试听学员
    findAuditionCpc(that.data.ccm_id, that.data.class_time, (dataList) => {
      if (dataList != null) {
        for (var i = 0; i < dataList.length; i++) {
          dataList[i].cpcType = 0;
          that.data.carts.push(dataList[i]);
        }
        
        this.setData({
          carts: that.data.carts,
        });
      }

    })
  },
  //初始化主题
  lodeTheme:function(){
    var that = this;
    findTheme(9, (dataList) => {
      //初始化的时候渲染wxSearchdata
      WxSearch.init(that, 43, dataList);
    })
    findTheme(0, (dataList) => {
      //初始化的时候渲染wxSearchdata
      WxSearch.initMindKeys(dataList);
    })
    
  }
  
})

//查询班级学员
function findClassCpc(ccm_id, keyword, noIds,dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/cpclList', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      ccm_id: ccm_id,
      keyword: keyword,
      noIds: noIds
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {

      dataList(res.data.dataInfo.dataList)
    }
  })
}

//查询试听学员
function findAuditionCpc(ccm_id, class_time, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/cpcAuditionlList', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      ccm_id: ccm_id,
      class_time: class_time
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      dataList(res.data.dataInfo.dataList)
    }
  })
}
  
  //查询主题
  function findTheme(top, dataList) {
    wx.request({
      url: main.localUrl + 'mobileXcx/findTheme', //仅为示例，并非真实的接口地址
      data: {
        crm_code: main.crm_code,
        top: top
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        dataList(res.data.dataInfo.str)
      }
    })
}