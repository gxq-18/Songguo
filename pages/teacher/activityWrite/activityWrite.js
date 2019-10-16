// pages/teacher/activityWrite/activityWrite.js
var dateTimePicker = require('../../../utils/dateTimePicker.js');
var main = require('../../../utils/main.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    address:"",
    star_time: '',
    end_time: '',
    content:"",
    remark:"",
    captainList: [],
    teammateList: [],
    teacherList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    findList("", (data) => {
      console.log(data);
      var array = [];
      for (var i = 0; i < data.length;i++){
        array.push(data[i].name);
      }
      this.setData({
        teacherList: data,
        array: array,
      })
    })
  },
  inputTitle:function(e){
    this.setData({
      title: e.detail.value
    })
  },
  inputAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateStar: function (e) {
    this.setData({
      star_time: e.detail.value
    })
  },
  bindDateEnd: function (e) {
    this.setData({
      end_time: e.detail.value
    })
  },
  inputContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  inputRemark: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  bindPickerChange: function (e) {

    var that = this;
    that.data.captainList.push(that.data.teacherList[e.detail.value]);
    this.setData({
      captainList: that.data.captainList
    })
  },
  bindPickerChange2: function (e) {

    var that = this;
    that.data.teammateList.push(that.data.teacherList[e.detail.value]);
    this.setData({
      teammateList: that.data.teammateList
    })
  },
  // 删除队长
  deleteCaptainList: function (e) {
    var captainList = this.data.captainList;
    var index = e.currentTarget.dataset.index;
    captainList.splice(index, 1);
    this.setData({
      captainList: captainList
    });
  },
  // 删除队友
  deleteTeammateList: function (e) {
    var teammateList = this.data.teammateList;
    var index = e.currentTarget.dataset.index;
    teammateList.splice(index, 1);
    this.setData({
      teammateList: teammateList
    });
  },
  addActivity:function(){
    var that = this;
    var captain_id = "";
    for (var i = 0; i < that.data.captainList.length;i++){
      if (captain_id=="")
        captain_id = that.data.captainList[i].id;
      else
        captain_id +=","+that.data.captainList[i].id;
    }
    var teammate_id = "";
    for (var i = 0; i < that.data.teammateList.length; i++) {
      if (teammate_id == "")
        teammate_id = that.data.teammateList[i].id;
      else
        teammate_id += "," + that.data.teammateList[i].id;
    }

    // 发布活动
    wx.request({
      url: main.localUrl + 'mobileXcx/addActivity', //仅为示例，并非真实的接口地址
      data: {
        crm_code: main.crm_code,
        title: that.data.title,
        activity_address:that.data.address,
        star_time: that.data.star_time,
        end_time: that.data.end_time,
        content: that.data.content,
        remark: that.data.remark,
        captain_id: captain_id,
        teammate_id: teammate_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            mask: true
          })
          setTimeout(function () {
            //成功
            var pages = getCurrentPages(); // 当前页面  
            var beforePage = pages[pages.length - 2]; // 前一个页面
            beforePage.backLoad();
            wx.navigateBack();  //返回上个页面

          }, 2000)
        }
      }
    })
  }

})

//查询老师集合
function findList(noIds, dataList) {
  wx.request({
    url: main.localUrl + 'mobileXcx/findTeacher', //仅为示例，并非真实的接口地址
    data: {
      crm_code: main.crm_code,
      noIds:noIds
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      dataList(res.data.dataInfo.teacherList)
    }
  })
}