// pages/stu/home/home.js
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');
//获取应用实例
const app = getApp()
Page({
  /**
   * 初始化数据
   */
  data: {
    cjlist:[],
    // leaver_Calligraphy:'',
    // leaver_painting:'',
    // leaver_music:'',
    // address:'',
    // time:''
  },

  onLoad: function (options) {
    this.setData({
      inputName : options.name,
      IdCard: options.IdCard,

      // leaver_Calligraphy: options.leaver_Calligraphy,
      // leaver_painting: options.leaver_painting,
      // leaver_music: options.leaver_music,
      // address: options.address,
      // time:options.time
    })

    findList(this.data.inputName, this.data.IdCard, (data) => {
      console.log((data.dataInfo.sex)+"!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      this.setData({
        cjlist: data.dataInfo
      })
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '成绩信息'
    });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
function findList(name, IdCard, dataList){
  wx.request({
    url: main.localUrl + 'mobileXcx/cjList', //仅为示例，并非真实的接口地址
    data: {
      name: name,
      IdCard: IdCard,
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      dataList(res.data);
    }
  })
}
