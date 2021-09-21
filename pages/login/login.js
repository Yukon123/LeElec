import getcookie from '../../utils/getcookie'
Page({
  data: {
    phonenum: '',
    password: '',
    userInfo: {},
  },

  handleInput(e) {
    const type = e.currentTarget.id //id="password or phonenum"
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
    const res = await getcookie('/login/cellphone', params).catch((err) => console.log(err))
    console.log(res)
    if (res.data.code !== 200) {
      wx.showToast({
        title: res.data.msg,
        icon: 'error',
      })
      return
    }
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
})
