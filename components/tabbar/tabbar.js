// components/tabbar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: Array,
      value: ['张三', '李四', '王五']
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentIndex: 0
  },

  /**
   * 组件的方法列表
   */
  pageLifetimes: {},
  methods: {
    handleTap(e) {
      console.log(e)
      this.setData({
        currentIndex: e.target.dataset.index
      })
      this.triggerEvent("clickTag", {
        name: "张三",
        index: e.target.dataset.index
      })
    }
  }
})