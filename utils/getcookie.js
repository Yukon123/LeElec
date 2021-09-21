export default function getcookie(url, data = {}, method = 'GET') {
  return new Promise((resolve, reject) => {
    // let token = ''
    let header = {
      'content-type': 'application/json', // 默认值
    }
    wx.request({
      url: 'http://39.108.224.26:5002' + url,
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
