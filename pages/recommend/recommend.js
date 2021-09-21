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
})
