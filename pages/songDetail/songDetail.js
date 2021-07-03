//Page Object
import request from '../../utils/request'
import formatDateTime from '../../utils/formatTime'
import shuffle from '../../utils/shuffle'

Page({
  data: {
    musicDetail: [],
    musicAddr: '',
    musicID: '',
    isPlay: true,
    currentWidth: 0, //当前时长宽度
    currentTime: 0, //当前时长
    durationTime: 0, //总时长
    idList: [], //播放列表
    randomIdList: [],
    currentIndex: 0,
    isRandom: false,
    currentWidth: '',
  },
  //options(Object)
  async getMusicDetail(ids) {
    const res = await request('/song/detail', { ids })
    wx.setNavigationBarTitle({ title: res.songs[0].name })
    let durationTime = formatDateTime(res.songs[0].dt)
    let currentTime = formatDateTime(0)
    this.setData({ musicDetail: res.songs[0], durationTime, currentTime })
  },
  async getAudioManager(id) {
    const res = await request('/song/url', { id })
    console.log(res)
    if (res.data[0].code !== 200) {
      wx.showToast({
        title: `因应版权方要求\r\n该资源暂时下架`,
        icon: 'none',
        duration: 1500,
        mask: true,
        success: (result) => {
          let timer = setTimeout(() => {
            if (this.data.idList.length > 1) {
              return this.handleSwitch()
            }
            wx.navigateBack({
              success: () => {
                clearTimeout(timer)
              },
            })
          }, 1500)
        },
        fail: () => {},
        complete: () => {},
      })
      return
    }
    this.setData({ musicAddr: res.data[0].url })

    this.audio.title = this.data.musicDetail.name
    this.audio.src = this.data.musicAddr
    this.audio.onWaiting(() => {
      wx.showLoading({ title: '加载中' })
    })
    this.audio.onCanplay(wx.hideLoading)
    this.audio.onPlay(() => {
      console.log('播放')
      wx.hideLoading()
      this.setData({ isPlay: true })
    })
    this.audio.onPause(() => {
      this.setData({ isPlay: false })
      wx.hideLoading()
    })
    this.audio.onStop(() => {
      this.setData({ isPlay: false })
      wx.hideLoading()
    })
    this.audio.onTimeUpdate(() => {
      let currentTime = formatDateTime(this.audio.currentTime * 1000)
      let currentWidth = (this.audio.currentTime / this.audio.duration) * 450
      this.setData({ currentTime, currentWidth })
    })
    this.data.idList.length > 1 && this.audio.onEnded(this.handleSwitch)
  },
  handleMusicPlay() {
    this.setData({
      isPlay: !this.data.isPlay,
    })
    if (this.data.isPlay) {
      this.audio.play()
    } else {
      this.audio.pause()
    }
  },
  handleSwitch(e) {
    if (e && e.target && e.target.id === 'pre') {
      console.log(this.data.idList.length)
      const currentIndex = (this.data.currentIndex - 1 + this.data.idList.length) % this.data.idList.length
      this.setData({ currentIndex })
      this.getMusicDetail(this.data.idList[currentIndex])
      this.getAudioManager(this.data.idList[currentIndex])
      console.log('切换前一首')
    } else {
      const currentIndex = (this.data.currentIndex + 1 + this.data.idList.length) % this.data.idList.length
      this.setData({ currentIndex })
      this.getMusicDetail(this.data.idList[currentIndex])
      this.getAudioManager(this.data.idList[currentIndex])
      console.log('切换下一首')
    }
  },
  handleSwitchRandom() {
    if (this.data.randomIdList.length === 0) {
      let randomIdList = shuffle(this.data.idList.concat())
      this.setData({ randomIdList })
      console.log(randomIdList)
    }
    let arr = []
    arr = this.data.idList.concat()
    this.setData({
      idList: this.data.randomIdList,
      randomIdList: arr,
      isRandom: !this.data.isRandom,
    })
  },

  onLoad(options) {
    wx.showLoading({ title: '加载中' })
    this.setData({ musicAddr: '' })
    console.log(this.data.musicAddr)
    this.audio = wx.getBackgroundAudioManager()
    this.appInstance = getApp()
    console.log(this.appInstance)
    let gloMusicID = this.appInstance.globalData.musicID
    console.log('刚点击进来', options.id)
    console.log('全局id', gloMusicID)
    gloMusicID == options.id && wx.hideLoading()
    let idList = this.appInstance.globalData.idList
    let currentIndex = idList.findIndex((value) => value == options.id)
    // if (gloMusicID == options.id) {
    //   return
    // }
    this.getMusicDetail(options.id)
    this.getAudioManager(options.id)
    this.setData({ musicID: options.id, idList, currentIndex })
    console.log('加载进来')
  },

  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {
    console.log('离开')
    this.appInstance.globalData.musicID = this.data.musicID
  },
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
})
