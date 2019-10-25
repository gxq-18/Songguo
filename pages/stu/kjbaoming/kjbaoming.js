// pages/stu/home/home.js
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  /**
   * 页面的初始数据
   */
  data: {
    dateValue: '             请选择您的预约日期',
    select: false,
    grade_name: '--请选择--',
    grades: [
      '猛犸机器人1班',
      '猛犸机器人2班',
      '口才1班',
    ]
  },
  /**
  *  点击下拉框
  */
  datePickerBindchange: function (e) {
    this.setData({
      dateValue: e.detail.value
    })
  },
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  /**
   * 已选下拉框
   */
  mySelect(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name
    this.setData({
      grade_name: name,
      select: false
    })
  },
  
  })
