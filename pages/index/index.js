// index.js
// 获取应用实例
import { request } from '../../utils/request'
//Page Object
Page({
  data: {
    bannerList: [],
    recommendList: [],
    billboardList: [],
  },
  //options(Object)

  onLoad: async function () {
    //轮播图
    let res = await request('/banner', { type: 2 })
    this.setData({ bannerList: res.banners })

    //推荐栏
    res = await request('/personalized', { limit: 10 })
    this.setData({ recommendList: res.result })

    //排行榜
    let resArr = []
    for (let i = 0; i < 5; ++i) {
      const { playlist: res } = await request('/top/list', { idx: i })
      const item = {
        name: res.name,
        id: res.id,
        tracks: res.tracks.slice(0, 3),
      }
      resArr.push(item)
      this.setData({ billboardList: resArr })
    }
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
})
