var main = require('../../../utils/main.js');
const qiniuUploader = require("../../../utils/qiniuUploader");

var formatLocation = main.formatLocation
var sourceType = [["camera"], ["album"], ["camera", "album"]]
var sizeType = [["compressed"], ["original"], ["compressed", "original"]]

//获取应用实例
const app = getApp()
Page({
  data: {
    imageList: [],//图片列表
    vioUrl: "",//视频地址
    tp: 0,
    imgPath: [],
    sourceTypeIndex: 2,
    sourceType: ["拍照", "相册", "拍照或相册"],
    sizeTypeIndex: 2,
    sizeType: ["压缩", "原图", "压缩或原图"],
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    content: "",
    roomname: "",
    latitude: "",
    longitude: "",
    theclass:"",
    isCpc: 1,
    isCheckF2: true,//仅老师可见
    isCheckF3: true,//所有人可见
    //picker
   
    bjnamelist:[],
    bjlistindex: 0,
    bjidlistlist:[],
    selectedid:'',
    demolist:[],
    default: '请选择',
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    //请求班级
    var that = this;
    var teamarray = [];
    var idarray = [];
    wx.request({
      url: main.localUrl + 'mobileXcx/getbjList', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("请求成功后的数据=");
        console.log(res.data);
        for (var a = 0; a < res.data.sucInfo.length; a++) {
          teamarray.push(res.data.sucInfo[a].name);
          idarray.push(res.data.sucInfo[a].id);
        }
        that.setData({
          bjidlistlist: idarray,
          bjnamelist: teamarray,

        })
      }
    })
    main.initQiniu();//初始化七牛
    var tp = options.tp;
    if (tp == 0) {
      var imgmodel = JSON.parse(options.imgmodel);
      this.setData({
        tp: tp,
        imageList: imgmodel,
      })
    }
    if (tp == 1) {
      var vioUrl = options.vioUrl;
      this.setData({
        tp: tp,
        vioUrl: vioUrl,
      })
    }
    
  }, 
  addContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
 
  bindPickerChange: function (e) {
    console.log("携带的值为" + e.detail.value);
    let array = this.data.bjnamelist;
    let idarray = this.data.bjidlistlist;
    let index = e.detail.value;
    this.setData({
      bjlistindex: e.detail.value,
      default: array[index],
      theclass: idarray[index],
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
  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange: function (e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  countChange: function (e) {
    this.setData({
      countIndex: e.detail.value
    })
  },
  chooseImage: function () {
    var that = this

    wx.chooseImage({

      //sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imageList;

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

        that.setData({
          imageList: imgs
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  //位置
  getAddress: function () {
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
  clear: function () {
    this.setData({
      hasLocation: false
    })
  },
  primary: function () {//点名保存
    var that = this;
    if (that.data.content == "") {
      wx.showToast({
        title: '内容为空，请填写发布内容',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return;
    }
    main.initQiniu();//初始化七牛
    wx.showLoading({ mask: true });
    //查看权限
    var lookType = "";
    if (that.data.isCheckF2) {
      lookType += ",0"
    }
    if (that.data.isCheckF3) {
      lookType += ",1"
    }
    var imgPathStr = ""; //视频、图片上传后拼接路径
    //判断是上传视频还是图片
    if (that.data.tp == 0) {
      //七牛上传图片
      for (var i = 0; i < that.data.imageList.length; i++) {
        // 交给七牛上传
        qiniuUploader.upload(that.data.imageList[i], (qiniu) => {
          if (null != qiniu.imageURL && "" != qiniu.imageURL) {
            if (imgPathStr == "") {
              imgPathStr = qiniu.imageURL;
            } else {
              imgPathStr += "," + qiniu.imageURL;
            }
          }

        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        });
      }
    } else {//上传视频

      // 交给七牛上传
      qiniuUploader.upload(that.data.vioUrl, (qiniu) => {
        if (null != qiniu.imageURL && "" != qiniu.imageURL) {
          imgPathStr = qiniu.imageURL;
        }
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      });
    }

    setTimeout(function () {
      // 发布家长圈
      wx.request({
        url: main.localUrl + 'mobileXcx/addCircle', //仅为示例，并非真实的接口地址 
        data: {
          crm_code: main.crm_code,
          account_type: 1,
          account_code: app.globalData.teacher.id,
          content: that.data.content,
          imageList: imgPathStr,
          isUrl: that.data.tp,
          urlPic: "",
          roomname: that.data.roomname,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          lookType: lookType,
          theclass: that.data.theclass,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.statusCode == 200) {
            wx.hideLoading();
            //成功
            var pages = getCurrentPages(); // 当前页面  
            var beforePage = pages[pages.length - 2]; // 前一个页面
            beforePage.backLoad();
            wx.navigateBack();  //返回上个页面
          }
        }
      })
    }, 2500)


  },


})