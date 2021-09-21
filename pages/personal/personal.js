// pages/personal/personal.js
import request from '../../utils/request'
let touchStartY = 0
let touchDistance = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    transformVar: 'translateY(0rpx)',
    transitionVar: '',
    userInfo: {},
    recentPlayList: [],
    recentPlayIdList: [],
  },

  touchStart(e) {
    this.setData({
      transitionVar: '',
    })
    touchStartY = e.touches[0].clientY
  },
  touchMove(e) {
    touchDistance = e.touches[0].clientY - touchStartY
    if (touchDistance <= 0) {
      return 0
    }
    if (touchDistance >= 80) {
      touchDistance = 80
    }
    this.setData({
      transformVar: `translateY(${touchDistance}rpx)`,
    })
  },
  touchEnd(e) {
    this.setData({
      transformVar: `translateY(0rpx)`,
      transitionVar: 'transform 1s linear ',
    })
  },
  login() {
    if (!this.data.userInfo.nickname) {
      console.log('跳转登录')
      wx.navigateTo({ url: '/pages/login/login' })
    }
  },
  async getRecentPlayList(uid, type) {
    const res = await request('/user/record', { uid, type })
    if (res.code !== 200) {
      return wx.showToast({
        title: '获取最近播放失败',
        icon: 'error',
      })
    }
    let recentPlayList = res.allData.filter((value) => value.song.copyright !== 1).slice(0, 10)
    let recentPlayIdList = recentPlayList.map((item) => item.song.id)
    this.setData({ recentPlayList, recentPlayIdList })
    console.log('最近记录', this.data.recentPlayList)
  },
  tapRecentPlay(e) {
    console.log(e)
    console.log('点击最近播放')
    let appInstance = getApp()
    appInstance.globalData.idList = this.data.recentPlayIdList
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?id=${e.currentTarget.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    // console.log(userInfo)
    if (!userInfo) {
      console.log('userInfo不存在')
      return
    }
    userInfo = JSON.parse(userInfo)
    this.setData({
      userInfo,
    })
    // console.log('用户信息', userInfo)

    this.getRecentPlayList(userInfo.userId, 0)
  },
})
