//var localUrl = "https://www.arter.net.cn/";
//var localUrl = "http://121.40.104.182:8088/shiyi_xcx/";
var localUrl = "http://localhost:8080/aters_xcx_interface/";
var crm_code = "crm0000";
const qiniuUploader = require("qiniuUploader");
//第一次推送 2019年10月22日15:28:20
//第二次推送 2019年10月22日15:28:20第二次推送 2019年10月22日15:28:20
//第三次推送 2019年10月22日16:13:0500
//页面加载 微信授权
// var binding = function (thisObj) {
//   var that = thisObj;
//   wx.login({
//     success: function (res) {
//       if (res.code) {
//         //获取openId
//         wx.request({
//           url: 'https://api.weixin.qq.com/sns/jscode2session',
//           data: {
//             //小程序唯一标识
//             appid: 'wxbb7fdd2c071b7dff',
//             //小程序的 app secret 
//             secret: '915218a15c0c7c77ed102d665070a914',
//             grant_type: 'authorization_code', 
//             js_code: res.code
//           },
//           method: 'GET',
//           header: { 'content-type': 'application/json' },
//           success: function (openIdRes) {
//             console.info("登录成功返回的openId：" + openIdRes.data.openid);
//             console.log(openIdRes.data.openid);
//             // 判断openId是否获取成功
//             if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
//               console.info("获取用户openId成功");
              
//             } else { 
//               console.info("获取用户openId失败1");

//             }
//           },
//           fail: function (error) {
//             console.info("获取用户openId失败2");
//             console.info(error);
//           }
//         })
//       }
//     }
//   });
// }

// 初始化“课程表”日期
// 初始化date对应的月份的日期列表
// -1表示非本月日期
// 1表示今天
// 2表示本月非今天的日期
function initMonthDates(date, isNextMonth = false) {
  var datas = []
  var month_this = date.getMonth() + 1; // 本月的月份
  var month_last = month_this == 1 ? 12 : (month_this - 1) // 上个月的月份
  var month_next = month_this == 12 ? 1 : (month_this + 1) // 下个月的月份

  var year_this = date.getFullYear()
  var year_last = month_last == 12 ? (year_this - 1) : year_this
  var year_next = month_next == 1 ? (year_this + 1) : year_this

  var day_this = date.getDay() //今天是本周的第几天
  var date_this = date.getDate() // 今天是本月的第几天

  var lastNum = date_this - day_this
  while (lastNum > 0) {
    lastNum = lastNum - 7
  }

  var dayNum_last = DayNumOfMonth(year_last, month_last) // 上个月有多少天
  var dayNum = dayNum_last + lastNum
  for (var i = 0, c = Math.abs(lastNum); i < c; i++) {
    var tmp = {}

    tmp.year = year_last
    tmp.month = month_last
    tmp.day = dayNum
    tmp.type = -1

    if (dayNum == 1) {
      tmp.dateShow = month_last + "月"
    } else {
      tmp.dateShow = dayNum
    }

    dayNum++
    datas.push(tmp)
  }

  var dayNum_this = DayNumOfMonth(year_this, month_this) //这个月有多少天
  for (var i = 1; i <= dayNum_this; i++) {
    var tmp = {}

    tmp.year = year_this
    tmp.month = month_this
    tmp.day = i

    if (isNextMonth) {
      if (i == 1) {
        tmp.type = 1
      } else {
        tmp.type = 2
      }
    } else {
      if (i == date_this) {
        tmp.type = 1
      } else {
        tmp.type = 2
      }
    }


    if (i == 1) {
      tmp.dateShow = month_this + "月"
    } else {
      tmp.dateShow = i
    }

    datas.push(tmp)
  }

  var dayNum_next = dayNum_this - date_this + day_this
  while (dayNum_next > 0) {
    dayNum_next -= 7
  }

  for (var i = 1, c = Math.abs(dayNum_next); i <= c; i++) {
    var tmp = {}

    tmp.year = year_next
    tmp.month = month_next
    tmp.day = i
    tmp.type = -1

    if (i == 1) {
      tmp.dateShow = month_next + "月"
    } else {
      tmp.dateShow = i
    }

    datas.push(tmp)
  }
  return datas
}

function DayNumOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

// 初始化下个月的日期列表
// offset为偏移量，offset默认为0，offset＝1表示获取应该获取到的那个月的下一个月的数据
function initNextMonthDates(offset = 0) {
  var date = new Date()
  var nextDate = new Date(date.setMonth(date.getMonth() + 1 + offset))
  return initMonthDates(nextDate, true)
}

// 初始化这个月的日期列表
// offset为偏移量，offset默认为0，offset＝1表示获取应该获取到的那个月的下一个月的数据
function initThisMonthDates(offset = 0) {
  var date = new Date()
  var thisDate = new Date(date.setMonth(date.getMonth() + offset))
  return initMonthDates(thisDate)
}

function initRowList(num) {
  var arr = []
  for (var i = 0; i < num; i++) {
    arr.push(i)
  }
  return arr
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === "string" && typeof latitude === "string") {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split("."),
    latitude: latitude.toString().split(".")
  }
}


// 初始化七牛相关参数
function initQiniu() {
  var token = "";
  wx.request({
    url: localUrl + 'mobileXcx/getQNToken', //仅为示例，并非真实的接口地址
    data: {
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log(res.data.dataInfo.token);
      var options = {
        region: 'SCN', // 华东区
        uptokenURL: 'https://up.qbox.me/api/uptoken',
        uptoken: res.data.dataInfo.token,
        domain: 'http://pzuu7skza.bkt.clouddn.com',
        shouldUseQiniuFileName: false
      };
      qiniuUploader.init(options);
    }
  })
  console.log(token);
  
}
// 收集formid
function collectFomrId(formId, time, openId) {
  console.log("openid=↓↓↓↓↓↓↓↓");
  console.log(openId);
  wx.request({
    url: localUrl + 'mobileXcx/collectFomrId', //仅为示例，并非真实的接口地址
    data: {
      formId: formId,
      time: time,
      openId: openId
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {  
    }
  })

}



module.exports = {
  initThisMonthDates: initThisMonthDates,
  initNextMonthDates: initNextMonthDates,
  initRowList: initRowList,
  formatLocation: formatLocation,
  initQiniu: initQiniu,
  collectFomrId: collectFomrId,

}
 

// module.exports.binding = binding;
module.exports.localUrl = localUrl;
module.exports.crm_code = crm_code;


