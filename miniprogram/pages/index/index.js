//index.js
var request = require('../request')
//获取应用实例
const app = getApp()

Page({
  data:{
    msg:{},
    show:false,
    current:0,
    views:['.dining','.receive','.publish'],
    showCenter:false,
    loading:false
  },
  
  loading(item){
    this.setData({
      loading:item.detail.loading
    })
  }
  ,
  changecomponents(data){
    this.setData({'current':parseInt(data.detail.index)})
  },

  change(e){
    if(e.detail.source=='touch'){
      console.log(e)
      this.setData({current:e.detail.current})
    }
    console.log(this.data.current,this)
    this.selectComponent(this.data.views[this.data.current]).toGetMealList()
  },

  showCenter(){
    this.setData({showCenter:true })
    request.toRequest('/v1/credit').then(res=>{
      console.log("积分请求");
      var code = res.data.code;
      var data = res.data.data;
      if(code == 200){
          this.selectComponent('.userCenter').whatIGet(data.credit);
      }else if (code == 1000) {
        this.setData({
            msg:{
                  show: true,
                  title: "温馨提示",
                  left: "确认",
                  msg: `未知错误，请稍后再试`,
                  type: 0,
                  rightFn: this.defaultFn
              }
        })  
    } else if (code == 900) {
      this.setData({
          msg : {
            show: true,
            title: "温馨提示",
            right:"确认",
            msg: `登录失效，请重新登录`,
            type: 0,
            rightFn:()=>{
              wx.redirectTo({
                url: '/pages/login/login',
              })
            }
          }
      })
        
    }
    }).catch(e=>{e})
    
  },

  right(){},

  alert(item){
    this.setData({
      msg:item.detail.msg
    })
    this.right = item.detail.msg.rightFn
  },
    
    onLoad(){
      // token登录
      // request.toRequest('/v1/token').then(res=>{
      //   if(res.data.code==100){
      //     wx.setStorageSync('token', res.data.data.token)
      //     this.setData({
      //       show:true
      //     })
          
      //   }else{
      //     wx.redirectTo({
      //       url: '/pages/login/login',
      //     })
      //   }
      // })
      // 1. 获取数据库引用
      const db = wx.cloud.database()
      // 2. 构造查询语句
      // collection 方法获取一个集合的引用
      // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
      // get 方法会触发网络请求，往数据库取数据
      db.collection('userinfo').where({
        // token:wx.getStorageSync('token')
        token:"sdfsdf"
      }).get().then(res => {
          console.log(res)
          if (res.data.length) {
            this.setData({
              show: true
            })
          }
          else {
            // wx.redirectTo({
            //   url: '/pages/login/login',
            // })
            this.setData({
              show: true
            })
          }

      })
    },

    onShow(){
    }
    
  
})
