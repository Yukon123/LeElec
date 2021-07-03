export default function getcookie(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    // let token = ''
    let header = {
      'content-type': 'application/json', // 默认值
    }
    // if (wx.getStorageSync('token')) {
    //   token = wx.getStorageSync('token')
    //   header.Authorization = token
    // }
    wx.request({
      // url: 'http://hjyjorv.nat.ipyingshe.com' + url,
      url: 'http://f6v95jt3.dongtaiyuming.net:27359' + url,
      data,
      method,
      header,
      success: (res) => {
        console.log(res)
        resolve(res)
        if (wx.getStorageSync('cookies')) {
          return
        }
        wx.setStorage({
          key: 'cookies',
          data: res.cookies.find((item) => {
            return item.indexOf('MUSIC') !== -1
          }),
        })
      },
      fail: (err) => {
        console.log(err)
        reject(err)
      },
    })
  })
}
