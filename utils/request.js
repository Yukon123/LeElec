export default function request(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    let token = ''
    let header = {
      'content-type': 'application/json', // 默认值
    }
    if (wx.getStorageSync('cookies')) {
      let cookies = wx.getStorageSync('cookies')
      header.cookie = cookies
    }
    wx.request({
      url: 'http://39.108.224.26:5002' + url,
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
