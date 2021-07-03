export default function request(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    let token = ''
    let header = {
      'content-type': 'application/json', // 默认值
    }
    // if (wx.getStorageSync('token')) {
    //   token = wx.getStorageSync('token')
    //   header.Authorization = token
    // }
    if (wx.getStorageSync('cookies')) {
      let cookies = wx.getStorageSync('cookies')
      header.cookie = cookies
    }
    wx.request({
      // url: 'http://127.0.0.1:3000' + url,
      url: 'http://f6v95jt3.dongtaiyuming.net:27359' + url,
      // url: 'http://127.0.0.1:3000' + url,   两个都要改  getcookie也要改
      data,
      method,
      header,
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
