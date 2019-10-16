// pages/teacher/layoutDetailView/detailView.js
var main = require('../../../utils/main.js');

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ccm_id: "",
    class_time: "",
    carts: [], // 班级学员集合
    themeName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var ccm_id = options.ccm_id;
    var class_time = options.class_time;

    this.setData({
      ccm_id: ccm_id,
      class_time: class_time
    })
    //查询本班学员
    this.fireCpcList();
  },
  //查询本班学生
  fireCpcList: function () {
    var that = this;
    fireClassCpcList(that.data.ccm_id, that.data.class_time, (dataInfo) => {
      if (dataInfo.dataList != null) {
        this.setData({
          carts: dataInfo.dataList,
          themeName: dataInfo.theme_name,
          curriculum_form: dataInfo.curriculum_form
        });
      }
    })
  },
  searchStu: function (e) {//查询学员
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    var that = this;
    var noIds = "";
    for (var i = 0; i < that.data.carts.length; i++) {
      if (noIds == "") {
        noIds = "'" + that.data.carts[i].cpc_id + "'";
      } else {
        noIds += ",'" + that.data.carts[i].cpc_id + "'";
      }
    }
    wx.navigateTo({
      url: "../layoutStuBx/layoutStu?noIds=" + noIds + "&ccm_id=" + that.data.ccm_id + "&class_time=" + that.data.class_time + "&theme_name=" + that.data.themeName + "&curriculum_form=" + that.data.curriculum_form,
    })
  },
  backLoad() {
    //查询排课记录
    this.fireCpcList();

  },
})

//查询班级学员
function fireClassCpcList(ccm_id, class_time, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/fireClassCpcList', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      ccm_id: ccm_id,
      class_time: class_time
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      dataList(res.data.dataInfo)
    }
  })
}

