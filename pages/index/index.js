// index.js
// 获取应用实例
import request from '../../utils/request'
//Page Object
Page({
  data: {
    bannerList: [],
    bannerIdList: [],
    recommendList: [],
    recommendIdList: [],
    billboardList: [],
    billboardIdList: [],
    res: {},
  },
  //options(Object)
  toDailyRecommend() {
    wx.navigateTo({
      url: '/pages/recommend/recommend',
    })
  },
  toMusicDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?id=${e.currentTarget.id}&list=${this.idList}`,
    })
  },
  async getBannerList() {
    const res = await request('/banner', { type: 2 })
    let bannerList = res.banners.filter((item) => item.targetId !== 0 && item.typeTitle !== '直播')
    let bannerIdList = bannerList.map((item) => item.targetId)
    this.setData({ bannerList, bannerIdList })
  },
  async getRecommendList() {
    const res = await request('/personalized', { limit: 10 })
    let recommendIdList = res.result.map((item) => item.id)
    this.setData({ recommendList: res.result, recommendIdList })
  },
  async getbillboardList() {
    let billboardList = []
    for (let i = 0; i < 5; ++i) {
      const { playlist: res } = await request('/top/list', { idx: i })
      const item = {
        name: res.name,
        id: res.id,
        tracks: res.tracks.slice(0, 3),
      }
      billboardList.push(item)
      let billboardIdList = billboardList.map((item) => item.tracks.map((value) => value.id))
      this.setData({ billboardList, billboardIdList })
    }
  },
  tapBanner(e) {
    console.log(e)
    let appInstance = getApp()
    appInstance.globalData.idList = this.data.bannerIdList
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?id=${e.currentTarget.id}`,
    })
  },
  tapRecommend(e) {
    console.log(e)
    // let appInstance = getApp()
    // appInstance.globalData.idList = this.data.recommendIdList
    // wx.navigateTo({
    //   url: `/pages/songDetail/songDetail?id=${e.currentTarget.id}`,
    // })
  },
  tapBillboard(e) {
    // console.log('00000')
    // this.setData({ res: e })
    // console.log(e)
    wx.showLoading({
      title: '排行加载中',
      mask: true,
      success: (result) => {},
      fail: () => {},
      complete: () => {},
    })
    wx.navigateTo({
      url: `/pages/songDetail/songDetail?id=${e.currentTarget.id}`,
      success: (result) => {
        wx.hideLoading()
      },
    })
  },
  tapBillboardItem(e) {
    console.log(e)
    let appInstance = getApp()
    appInstance.globalData.idList = this.data.billboardIdList[e.currentTarget.dataset.index]
  },
  onLoad: function () {
    //轮播图
    this.getBannerList()
    //推荐栏
    this.getRecommendList()
    //排行榜
    this.getbillboardList()
  },

  onReady: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
})
