export function request(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    wx.request({
      // url: 'http://yukon.cn1.utools.club' + url,
      url: 'http://localhost:3000' + url,
      data,
      method,
      header: {
        'content-type': 'application/json', // 默认值
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}