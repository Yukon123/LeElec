import request from '../../utils/getcookie'

// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phonenum: '17750597459',
    password: 'wm123456',
    userInfo: {},
  },

  handleInput(e) {
    console.log(e)
    const type = e.currentTarget.id
    this.setData({
      [type]: e.detail.value,
    })
  },
  async login() {
    console.log('登录')
    let params = {
      phone: this.data.phonenum,
      password: this.data.password,
    }
    console.log(params)

    if (!this.validate()) {
      return console.log('验证未通过')
    } else {
      console.log('验证通过')
    }
    const res = await request('/login/cellphone', params).catch((err) => console.log(err))
    console.log(res)
    if (res.data.code !== 200) {
      wx.showToast({
        title: res.data.msg,
        icon: 'error',
      })
      return
    }

    // wx.setStorage({
    //   key: 'token',
    //   data: res.data.token,
    // })

    wx.setStorage({
      key: 'userInfo',
      data: JSON.stringify(res.data.profile),
    })
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  validate() {
    const regTel = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
    const regPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    if (!this.data.phonenum.trim()) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'error',
      })
      return 0
    } else if (!this.data.password.trim()) {
      wx.showToast({
        title: '请输入密码',
        icon: 'error',
      })
      return 0
    } else if (!regTel.test(this.data.phonenum)) {
      wx.showToast({
        title: '手机号码不正确',
        icon: 'error',
      })
      this.setData({
        phonenum: '',
      })
      return 0
    } else if (!regPass.test(this.data.password)) {
      wx.showToast({
        title: '密码格式不正确',
        icon: 'error',
      })
      this.setData({
        password: '',
      })
      return 0
    }
    return 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
  async onUnload() {},

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
