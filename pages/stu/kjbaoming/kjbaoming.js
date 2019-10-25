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
    dateValue: '请选择出生日期',
    select: false,
    grade_name: '请选择证件类型',
    grades: [
      '猛犸机器人1班',
      '猛犸机器人2班',
      '口才1班',
    ],
    gender: '请选择性别',
    genders: [
      '男',
      '女',
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
  bindGender() {
    this.setData({
      select1: !this.data.select1
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
  mySelect1(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name
    this.setData({
      gender: name,
      select1: false
    })
  },
  
  })
