
function toRequest(url,data){ 
  return new Promise((resolve,reject)=>{
    wx.request({
      url: 'http://192.168.22.151:8000'+url,
      method:"post",
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'charset':'utf-8',
        'token':wx.getStorageSync('token')||""
      },
      // timeout: 5000,
      success: (result) => {
        console.log(result)
        
        resolve(result)
      },
      fail: (res) => {
        reject(res)
      },
      complete: (res) => {
      },
    })
  })
}

exports.toRequest = toRequest