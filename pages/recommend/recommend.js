// pages/recommend/recommend.js
import request from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mouth: 0,
    date: 0,
    playList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async getRecommendSong() {
    const res = await request('/recommend/songs').catch((err) => console.log(err))
    if (res.code !== 200) {
      return wx.showToast({
        title: '获取每日推荐失败',
        icon: 'error',
      })
    }
    let idList = res.recommend.map((item) => item.id)

    this.setData({
      playList: res.recommend,
      idList,
    })
  },

  toMusicDetail(e) {
    console.log(e)
    let appInstance = getApp()
    appInstance.globalData.idList = this.data.idList
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?id=${e.currentTarget.id}`,
    })
  },

  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')

    if (!userInfo) {
      console.log('userInfo不存在')
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        },
      })
      return
    }
    this.setData({
      date: new Date().getDate(),
      mouth: new Date().getMonth() + 1,
    })
    this.getRecommendSong()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
