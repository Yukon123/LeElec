// pages/video/video.js
import request from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navList: [],
    videoList: [],
    navID: '',
    videoID: '',
    isRefresh: false,
    placeHolder: '',
  },
  async getPlaceHolder() {
    const res = await request('/search/default')
    let placeHolder = res.data.showKeyword
    this.setData({ placeHolder })
  },
  async getNavList() {
    const res = await request('/video/group/list')
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
    const res = await request('/video/group', { id: id })
    wx.hideLoading()
    let keyID = 0
    res.datas &&
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
    // console.log(e)
    // this.videoID !== e.currentTarget.id && this.videoContext && this.videoContext.pause()
    // this.videoID = e.currentTarget.id
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
    // console.log(vlist)
    this.setData({ videoList })
  },
  videoEnd(e) {
    let vlist = this.data.videoList
    vlist[e.currentTarget.dataset.index].videoTime = 0
    // console.log(vlist)
    this.setData({ videoList: vlist })
  },
  pullDownRefresh() {
    this.getVideoGroup(this.data.navID)
  },
  async pullUpRefresh() {
    // let videoList = this.data.videoList
    // videoList.push(...(await this.getVideoGroup(this.data.navID)))
    // console.log(videoList)
    // this.setData({ videoList })
    console.log('没数据下拉刷新')
  },
  toSearchPage() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  onLoad: function () {
    const userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
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
    this.getNavList()
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
