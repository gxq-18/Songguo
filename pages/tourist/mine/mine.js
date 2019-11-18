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
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '游客中心'
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

