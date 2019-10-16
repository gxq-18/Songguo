// pages/stu/activityView/activityView.js
var main = require('../../../utils/main.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    isPay: true,
    hideModal: true, //模态框的状态  true-隐藏  false-显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    let newTime = new Date().getTime();
    findView(id, (data) => {
      let viewType = 0;
      let star_time = new Date(data.star_time.replace(/-/g, '/')).getTime();
      let endTime = new Date(data.end_time.replace(/-/g, '/')).getTime();
      if (star_time - newTime > 0) {
        viewType = 1;//未开始
      } else {
        if (endTime - newTime > 0){
          viewType = 2;//已开始
        }else{
          viewType = 3;//已结束
        }
      }
      that.setData({
        id: id,
        model: data,
        viewType: viewType,
        money: data.bid_amount + data.increase_price
      })
      this.countDown();

      /**
     * html解析示例
     */
     
      WxParse.wxParse('article', 'html', data.content, that, 5);
    })

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
    var that = this;
    if (null != that.data.model){
      var id = that.data.model.id;
      findView(id, (data) => {
        that.setData({
          model: data
        })
      })
    }
    
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
    return {
      title: this.data.model.title,
    }
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度  
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例  
    var viewWidth = 750,           //设置图片显示宽度，  
      viewHeight = 750 / ratio;    //计算的高度值     
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },
  pay: function (e) {
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800);//收集formId
    wx.navigateTo({
      url: "../activityPay/activityPay?id=" + this.data.model.id,
    })
  },
  bidView: function (e) {
    var that = this;
    var bidlist = JSON.stringify(e.currentTarget.dataset.bidlist);
    wx.navigateTo({
      url: "../auctionBid/auctionBid?bidlist=" + bidlist,
    })
    

  },

  // 显示遮罩层
  showModal: function (e) {
    var that = this;
    that.setData({
      hideModal: false
    })
    var userInfo = e.detail.userInfo;
    console.log(userInfo);
    that.setData({
      pmUserInfo: userInfo
    })
    //获取openid
    wx.login({
      success: function (res) {
        if (res.code) {
          //获取openId
          wx.showLoading({ mask: true });
          wx.request({
            url: main.localUrl + 'mobileXcx/getOpenId', //仅为示例，并非真实的接口地址
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (openIdRes) {
              console.log(openIdRes);
              wx.hideLoading();
              // 判断openId是否获取成功
              if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                // 有一点需要注意 询问用户 是否授权 那提示 是这API发出的
                console.info("登录成功返回的openId：" + openIdRes.data.openid);
                //查询收货地址，
          
                that.setData({
                  openId: openIdRes.data.openid,
                })
                
                
              }
            }
          })
        }
      }
    });
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200)

    
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 720)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    var that = this;
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export(),//动画实例的export方法导出动画数据传递给组件的animation属性
      money:that.data.model.bid_amount + that.data.model.increase_price
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  }, 
  /* 加数 */
  addCount: function (e) {
    var that = this;
    that.setData({
      money: that.data.money + that.data.model.increase_price
    })
  },
  /* 减数 */
  delCount: function (e) {
    var that = this;
    var my = that.data.money;
    if (that.data.money <= that.data.model.bid_amount + that.data.model.increase_price){
      my = that.data.model.bid_amount + that.data.model.increase_price;
    }else{
      my = that.data.money - that.data.model.increase_price;
    }
    that.setData({
      money:my
    })
    
  },
  inputUser: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  inputMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  inputAddress: function (e) {
    this.setData({
      adress: e.detail.value
    })
  },
  offerPrice:function(e){//出价
    main.collectFomrId(e.detail.formId, parseInt(new Date().getTime() / 1000) + 604800, app.globalData.openId);//收集formId
    
   var that = this;
    if (that.data.viewType!=2){
      wx.showToast({
        title: '拍卖已结束',
        icon: 'none',
        duration: 2000,
        mask: true
      })
   }else{
      wx.request({
        url: main.localUrl + 'mobileXcx/offerPrice', //仅为示例，并非真实的接口地址
        data: {
          productId: that.data.model.id,
          bidAmount:that.data.money,
          wxName: that.data.pmUserInfo.nickName,
          wxIcon: that.data.pmUserInfo.avatarUrl,
          wxOpenid: that.data.openId,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (openIdRes) {
          var id = that.data.model.id;
          console.log(that.data.model.bidList.length + "---model.bidList.size");
          var tzOpen = '';
          var tzName = '';
          if (null != that.data.model.bidList && that.data.model.bidList.length>0 ){
            tzOpen = that.data.model.bidList[0].wx_openid;
            tzName = that.data.model.bidList[0].wx_name;
          }
          findView(id, (data) => {
            that.setData({
              model: data
            })
          })
          wx.showToast({
            title: '出价成功',
            icon: 'success',
            duration: 2000,
            mask: true
          })
          that.hideModal();
          if (tzOpen!='' ){
            //发送通知
            wx.request({
              url: main.localUrl + 'mobileXcx/chujiaTongzhi', //仅为示例，并非真实的接口地址
              data: {
                formId: e.detail.formId,
                openId: tzOpen,
                title: that.data.model.title,
                name: tzName,
                price: that.data.money,
                id: that.data.model.id
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (openIdRes) {

              }
            })
          }
          
        }
      })
   }

  },
  timeFormat(param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() {//倒计时函数
    var that = this;
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();

    // 对结束时间进行处理渲染到页面
      let o = that.data.model;
      let endTime = "";
      let starTime = "";
      let obj = null;
    endTime = new Date(o.end_time.replace(/-/g, '/')).getTime();
    starTime = new Date(o.star_time.replace(/-/g, '/')).getTime();
      obj = {
        isTrue: 0 
      }
    if (starTime - newTime < 0){
        // 如果活动未结束，对时间进行处理
        if (endTime - newTime > 0) {
          let time = (endTime - newTime) / 1000;
          // 获取天、时、分、秒
          let day = parseInt(time / (60 * 60 * 24));
          let hou = parseInt(time % (60 * 60 * 24) / 3600);
          let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
          let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
          obj = {
            isTrue: 2,
            day: that.timeFormat(day),
            hou: that.timeFormat(hou),
            min: that.timeFormat(min),
            sec: that.timeFormat(sec)
          }
        } else {//活动已结束，全部设置为'00'
          obj = {
            isTrue: 3,
            day: '00',
            hou: '00',
            min: '00',
            sec: '00'
          }
        }
      }else{
        let time = (starTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          isTrue: 0,
          day: that.timeFormat(day),
          hou: that.timeFormat(hou),
          min: that.timeFormat(min),
          sec: that.timeFormat(sec)
        }
      }
      
      
      o.timeDay = obj;
   
    let viewType = 0;
    if (starTime - newTime > 0) {
      viewType = 1;//未开始
    } else {
      if (endTime - newTime > 0) {
        viewType = 2;//已开始
      } else {
        viewType = 3;//已结束
      }
    }

    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ model: o, viewType: viewType })
    setTimeout(this.countDown, 1000);
  },

})


function findView(id, data) {
  wx.request({
    url: main.localUrl + 'mobileXcx/auctionProductView', //仅为示例，并非真实的接口地址
    data: {
      id: id
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      data(res.data.dataInfo.pojo);
    }
  })
}

