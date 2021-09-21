// pages/video/video.js
import request from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navList: [],
    navID: '',
    videoList: [],
    videoID: '',
    isRefresh: false,
    placeHolder: '',
  },
  async getPlaceHolder() {
    const res = await request('/search/default')
    if (res.code !== 200) {
      return console.log(res.msg)
    }
    let placeHolder = res.data.showKeyword
    this.setData({ placeHolder })
  },
  async getNavList() {
    const res = await request('/video/group/list')
    if (res.code !== 200) {
      return console.log(res.msg)
    }

    res.data.splice(4, 1),
      res.data.splice(7, 1),
      this.setData({
        navList: res.data.slice(0, 12),
        navID: res.data[0].id,
      })
    console.log('标签列表', this.data.navList)
    this.getVideoGroup(res.data[0].id)
    console.log(this.data)
  },
  async getVideoGroup(id) {
    const res = await request('/video/group', { id })
    if (res.code !== 200) {
      return console.log(res.msg)
    }
    wx.hideLoading()
    let keyID = 0
    res.datas.map((item) => {
      item.videoTime = 0
      item.id = keyID
      keyID++
      return item
    })
    this.setData({ videoList: res.datas, isRefresh: false })
    console.log('视频列表', res.datas)
    return res.datas
  },
  handleNavTap(e) {
    this.setData({
      navID: e.target.dataset.id,
      videoID: '',
      videoList: [],
    })
    wx.showLoading({
      title: '正在加载中',
    })
    this.getVideoGroup(this.data.navID)
  },
  videoPlay(e) {
    let backgroundAudioManager = wx.getBackgroundAudioManager()
    backgroundAudioManager.pause()
    let videoContext = wx.createVideoContext(e.currentTarget.id)
    console.log(this.data.videoList)
    videoContext.seek(this.data.videoList[e.currentTarget.dataset.index].videoTime)
    this.videoID = e.currentTarget.id
    this.setData({
      videoID: e.currentTarget.id,
    })
  },
  timeUpdate(e) {
    let videoList = this.data.videoList
    videoList[e.currentTarget.dataset.index] &&
      (videoList[e.currentTarget.dataset.index].videoTime = e.detail.currentTime)
    this.setData({ videoList })
  },
  videoEnd(e) {
    let videoList = this.data.videoList
    videoList[e.currentTarget.dataset.index].videoTime = 0
    this.setData({ videoList })
  },
  pullDownRefresh() {
    this.getVideoGroup(this.data.navID)
  },
  async pullUpRefresh() {
    console.log('没数据下拉刷新')
  },
  toSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  onLoad: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      console.log('USERinfo不存在')
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {},
      })
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    this.getPlaceHolder()
    wx.showLoading({
      title: '正在加载中',
    })
    this.getNavList()
  },

  onShareAppMessage: function ({ from }) {
    console.log(from)
    if (from === 'button') {
      return {
        title: 'button转发',
        path: '/pages/video',
        imageUrl: '/static/images/nvsheng.jpg',
      }
    } else
      return {
        title: 'menu转发',
        path: '/pages/video',
        imageUrl: '/static/images/nvsheng.jpg',
      }
  },
  onShareTimeline() {
    return {
      title: '转发',
      path: '/pages/video/video.js',
      imageUrl: '/static/images/nvsheng.jpg',
    }
  },
})
