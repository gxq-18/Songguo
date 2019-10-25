
let chooseYear = null;
let chooseMonth = null;
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');

//获取应用实例
const app = getApp()

const conf = {
  data: {
    hasEmptyGrid: false,
    showPicker: false,
    todayClass: []
  },

  kjbaoming: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    wx.navigateTo({
      url: "../kjbaoming/kjbaoming",
    })
  },





  onLoad() {

    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const weeksCh = ['日', '一', '二', '三', '四', '五', '六'];
    this.calculateEmptyGrids(curYear, curMonth);
    this.calculateDays(curYear, curMonth);
    this.setData({
      curYear,
      curMonth,
      weeksCh,
      checkYear: curYear,
      checkMonth: curMonth,
      checkDay: date.getDate(),
    });

    //选中当天
    this.checkToDay();
    //查询排课记录
    findClass(curYear, curMonth, date.getDate(), (dataList) => {
      this.setData({
        todayClass: dataList,
      });
    });

  },
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  calculateDays(year, month) {
    let days = [];

    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: false
      });
    }

    this.setData({
      days
    });
  },
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    if (handle === 'prev') {
      let newMonth = curMonth - 1;
      let newYear = curYear;
      if (newMonth < 1) {
        newYear = curYear - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        curYear: newYear,
        curMonth: newMonth
      });
    } else {
      let newMonth = curMonth + 1;
      let newYear = curYear;
      if (newMonth > 12) {
        newYear = curYear + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.setData({
        curYear: newYear,
        curMonth: newMonth
      });
    }

    this.checkToDay();
  },
  tapDayItem(e) {
    const idx = e.currentTarget.dataset.idx;
    const days = this.data.days;
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    for (var index in days) {
      days[index].choosed = false;
    }
    days[idx].choosed = true;
    this.setData({
      days,
      checkYear: curYear,
      checkMonth: curMonth,
      checkDay: days[idx].day,
    });

    //查询排课记录
    findClass(curYear, curMonth, days[idx].day, (dataList) => {
      this.setData({
        todayClass: dataList,
      });
    })
  },
  chooseYearAndMonth() {
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    let pickerYear = [];
    let pickerMonth = [];
    for (let i = 1900; i <= 2100; i++) {
      pickerYear.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      pickerMonth.push(i);
    }
    const idxYear = pickerYear.indexOf(curYear);
    const idxMonth = pickerMonth.indexOf(curMonth);
    this.setData({
      pickerValue: [idxYear, idxMonth],
      pickerYear,
      pickerMonth,
      showPicker: true,
    });
  },
  pickerChange(e) {
    const val = e.detail.value;
    chooseYear = this.data.pickerYear[val[0]];
    chooseMonth = this.data.pickerMonth[val[1]];
  },
  tapPickerBtn(e) {
    const type = e.currentTarget.dataset.type;
    const o = {
      showPicker: false,
    };
    if (type === 'confirm') {
      if (chooseYear != null & chooseMonth != null) {
        o.curYear = chooseYear;
        o.curMonth = chooseMonth;
        this.calculateEmptyGrids(chooseYear, chooseMonth);
        this.calculateDays(chooseYear, chooseMonth);
      }

    }

    this.setData(o);
    this.checkToDay();
  },
  checkToDay: function () {
    var that = this;

    //当天选中
    const days = that.data.days;
    const curYear = this.data.curYear;
    const curMonth = this.data.curMonth;
    const checkYear = this.data.checkYear;
    const checkMonth = this.data.checkMonth;
    const checkDay = that.data.checkDay;
    if (curYear == checkYear & curMonth == checkMonth) {
      days[checkDay - 1].choosed = true;
      that.setData({
        days
      });
    }

  },
  backLoad() {
    //查询排课记录
    findClass(this.data.checkYear, this.data.checkMonth, this.data.checkDay, (dataList) => {
      this.setData({
        todayClass: dataList,
      });
    })

  },
  layoutDetail: function (e) {
    var ccm_id = e.currentTarget.dataset.ccm_id;
    var class_time = e.currentTarget.dataset.class_time;
    wx.navigateTo({
      url: "../layoutDetail/detail?ccm_id=" + ccm_id + "&class_time=" + class_time,
    })
  },
  //消课详情
  layoutDetailView: function (e) {
    var ccm_id = e.currentTarget.dataset.ccm_id;
    var class_time = e.currentTarget.dataset.class_time;
    wx.navigateTo({
      url: "../layoutDetailView/detailView?ccm_id=" + ccm_id + "&class_time=" + class_time,
    })
  },

};

Page(conf);

function findClass(checkYear, checkMonth, checkDay, dataList) {//查询排课记录
  if (checkMonth < 10)
    checkMonth = "0" + checkMonth;
  if (checkDay < 10)
    checkDay = "0" + checkDay;

  wx.request({
    url: main.localUrl + 'mobileXcx/todayClassStu', //仅为示例，并非真实的接口地址
    data: {
      ccm_id: app.globalData.csc.ccm_id,
      dayTime: checkYear + "-" + checkMonth + "-" + checkDay
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      dataList(res.data.dataInfo.classList)
    }
  })

}