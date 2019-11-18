var app = getApp();
Page({
	data: {
    title:"我的",
    actionSheetHidden: true,
    bpImage: 'http://p7mq9gjza.bkt.clouddn.com/t_me_head.png',
  },
	onLoad: function () {
    var bpImage = app.globalData.cpc.bp_image;
    if (null == bpImage || "" == bpImage) {
      bpImage = "http://p7mq9gjza.bkt.clouddn.com/t_me_head.png";
    }

    this.setData({
      cpc: app.globalData.cpc,
      bpImage: bpImage,
    });
	},
	onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    });
    wx.setNavigationBarTitle({
      title: '个人信息'
    });

	},
  spareTime: function () {
    wx.navigateTo({
      url: "../spareTime/spareTime",
    })
  },
  score: function () {
    wx.navigateTo({
      url: "../score/score",
    })
  },
  order: function () {
    wx.navigateTo({
      url: "../order/order",
    })
  },
  activity: function () {
    wx.navigateTo({
      url: "../myActivity/myActivity",
    })
  },
  switchAccount: function () {
    wx.navigateTo({
      url: "../switchAccount/switchAccount",
    })
  },

  myIndex: function () {
    wx.navigateTo({
      url: "../myIndex/myIndex",
    })
  },
  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  mailbox: function (e) {
    wx.navigateTo({
      url: "../mailbox/mailbox",
    })
  },

  // 更换封面
  bpImage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      success: function (res) {
        wx.navigateTo({
          url: "../../wx-cropper/index?url=" + res.tempFilePaths[0] + "&tp=0",
        })
        _this.actionSheetChange();
      }
    })
  },
});

