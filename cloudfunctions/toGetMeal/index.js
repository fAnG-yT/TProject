// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const item = event.item
  const user = event.user
  const receive_status=0
    // 1. 获取数据库引用
    const db = wx.cloud.database()
    db.collection('publish').where({
      _id : item["_id"]
    }).update({
      // data 传入需要局部更新的数据
      data: {
        // 领取状态为1，表示已领取
        receive_status: 1
      },
      // success: function(res) {
      //   console.log(res.data)
      // }
    }).then(res=>{

    })
    db.collection('receive').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        publish_id:item.publish_id,
        receive_status:0,
        user_id:user.user_id
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  return {
    code:540,
    can_open:true
  }
}