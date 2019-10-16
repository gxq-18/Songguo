var app = getApp();
Page({
	data: {
    title:"我的"
  },
	onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    });
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
});

