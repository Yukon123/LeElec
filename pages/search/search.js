// pages/search/search.js
import request from '../../utils/request'
import debounce from '../../utils/debounce'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeHolder: '',
    hotSearchList: [],
    keyWords: '',
    keySearchResult: [],
    searchHistory: [],
    isShowResult: false,
  },
  async getPlaceHolder() {
    const res = await request('/search/default')
    let placeHolder = res.data.showKeyword
    this.setData({ placeHolder })
  },
  async getHotSearchList() {
    const res = await request('/search/hot/detail')
    let hotSearchList = res.data
    this.setData({ hotSearchList })
  },
  async search() {
    let keywords = this.data.keyWords.trim()
    const limit = 10
    if (!keywords) {
      return
    }

    const res = await request('/search', { keywords, limit })
    if (res.code !== 200) {
      return
    }
    // let keySearchResult = res.result.songs.filter((value) => value.song.copyright !== 1).slice(0, 10)
    const keySearchResult = res.result.songs
    this.setData({ keySearchResult, isShowResult: true })
    console.log(res.result.songs)
  },
  tapHotSearchItem(e) {
    console.log(e)
    const keyWords = e.currentTarget.id || e.currentTarget.dataset.name

    this.setData({ keyWords })
    this.search()
  },
  tapCancelButton() {
    console.log('取消了')
    this.setData({ isShowResult: false, keyWords: '' })
  },
  tapCancelIcon() {
    this.setData({ searchHistory: [] })
    wx.setStorage({
      key: 'searchHis',
      data: [],
    })
  },
  handleInput: debounce(function (e) {
    console.log('1111')
    this.setData({ keyWords: e.detail.value })
    this.search()
  }, 300),
  tapSearchResult(e) {
    console.log(e)
    this.setSearchHistory(e.currentTarget.dataset.name)
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?id=${e.currentTarget.id}`,
    })
    // this.setData({ keyWords: '' })
  },

  setSearchHistory(name) {
    let searchHistory = this.data.searchHistory
    let index = searchHistory.indexOf(name)
    if (index !== -1) {
      searchHistory.splice(index, 1)
      searchHistory.unshift(name)
      this.setData({ searchHistory })
    } else {
      searchHistory.unshift(name)
      this.setData({ searchHistory })
    }
    wx.setStorage({
      key: 'searchHis',
      data: JSON.stringify(searchHistory),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlaceHolder()
    this.getHotSearchList()
    let searchHistory = JSON.parse(wx.getStorageSync('searchHis'))
    this.setData({ searchHistory })
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
