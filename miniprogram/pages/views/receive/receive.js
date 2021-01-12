// pages/views/receive/receive.js
import request from '../../request'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
      myReceive: [],
      show: false,
      unkshow: {
        show: false,
      },
      alertMessage: {
        show: false,
        title: "您确认不要这份餐饭吗",
        left: "再考虑考虑",
        leftCSS: {
          color: "#F7CE74",
          fontSize: 14*2+"rpx",
        },
        right: "确认取消",
        rightCSS: {
          color: "#AB9393",
          fontSize: 14*2+"rpx",
        },
        msg: [
          {
            txt: "发布者",
            style: {
              color: "#101010",
              fontSize: 13*2+"rpx",
              textAlign: "left",
              margin: 10*2+"rpx",
            },
          },
          {
            txt: "餐饭",
            style: {
              color: "#101010",
              fontSize: 13*2+"rpx",
              textAlign: "left",
              margin: 10*2+"rpx",
            },
          },
          {
            txt: "取餐地址",
            style: {
              color: "#101010",
              fontSize: 13*2+"rpx",
              textAlign: "left",
              margin: 10*2+"rpx",
            },
          },
        ],
        type: "1",
        // rightFn: this.cancelMyReceive,
        receive_id: -1,
      },
      getAlert: {
        show: false,
        title: "是否现在取餐？",
        type: 0,
        msg: "",
        left: "再考虑考虑",
        leftCSS: {
          color: "##AB9393",
          fontSize: 14*2+"rpx",
        },
        right: "确认领取",
        rightCSS: {
          color: "#F7CE74",
          fontSize: 14*2+"rpx",
        },
        // rightFn: "sureGetFood",
        receive_id: -1,
      },
      Alert: {
        show: false,
        title: "取餐成功",
        type: 0,
        msg: "",
        left: "确定",
      },
      showAlert: 0,
    },

  /**
   * 组件的方法列表
   */
  methods: {

    toGetMealList(){
      request.toRequest('/v1/meal/receive/my').then(res=>{
        if (res.data.code == 610) {
          this.setData({
            myReceive:res.data.data.list,
            show:true
          })
        } else if (res.data.code == 1000) {
            var msg = {
              show: true,
              title: "温馨提示",
              left: "确认",
              msg: `未知错误，请稍后再试`,
              type: 0,
              rightFn: this.defaultFn
          };
          this.triggerEvent('alert',{msg})
        } else if (res.data.code == 900) {
            var msg = {
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
          };
          this.triggerEvent('alert',{msg})
        }
      }).catch(e=>{
        this.triggerEvent("loading",{loading:false})
        console.log(e)
      })
    },
    
    // 点击取消按钮执行的函数
    cancel(event) {
      var item = event.currentTarget.dataset.item
      this.setData({
          "alertMessage.msg[0].txt" : `发布者:${item.publisher_job_num}`,
          "alertMessage.msg[1].txt" :`餐饭:${item.meal_name}`,
          "alertMessage.msg[2].txt" : `取餐地址:${item.pickup_location}`,
          "alertMessage.show" : true,
          showAlert :1,
          "alertMessage.rightFn":()=>this.cancelMyReceive(item.receive_id)
      })
      this.triggerEvent('alert',{msg:this.data.alertMessage})
    },
    // 点击确认取消按钮取消领取的餐饭
    cancelMyReceive(receive_id) {
      this.triggerEvent("loading",{loading:true})
      console.log(this.data.alertMessage,this.data)
      request.toRequest('/v1/meal/receive/cancel',{receive_id}).then(res=>{
        this.triggerEvent("loading",{loading:false})
          console.log(res);
          if (res.data.code == 580) {
            this.setData({showAlert : -1})
          }else if (res.data.code == 581) {
            this.setData({
              "showAlert" : 2,
              "Alert.show ": true,
              "Alert.title" : "温馨提示",
              "Alert.msg" : "该餐饭已被您领取，取消失败",
            })
          } else if (res.data.code == 582) {
            this.setData({
                ".showAlert": 2,
                ".Alert.show": true,
                ".Alert.title": "温馨提示",
                ".Alert.msg": "该餐饭已被您取消，无需重复取消",
            })
          } else if (res.data.code == 900) {
            // this.$store.state.logoutTip = true;
          } else {
            // this.unkshow.show = true;
          }
          this.triggerEvent("alert",{msg:this.data.Alert})
          this.toGetMealList();
      })
      
    },
    // 确认取餐吗弹窗，告知餐饭楼层
    getFood(event) {
      var item = event.currentTarget.dataset.item
      this.setData({
        "showAlert" : 3,
        "getAlert.show" : true,
        "getAlert.msg" : `餐饭位于${item.pickup_location}`,
        "getAlert.receive_id" : item.receive_id,
        "getAlert.rightFn":()=>this.sureGetFood(item)
      })
      console.log(this.getAlert.receive_id);
    },
    // 二次确认取餐，开柜0p  
    sureGetFood(item) {
      this.triggerEvent("loading",{loading:true})
      console.log(item)
      request.toRequest('/v1/meal/receive/open-box',{receive_id: item.receive_id}).then(res=>{
        this.triggerEvent("loading",{loading:false})
          console.log(res);
          if (res.data.code == 560) {
            console.log("取餐成功");
            this.setData({
              "showAlert" : 2,
              "Alert.show" : true,
            })
            
            if (res.data.data.use_closet) {
              this.setData({
                "Alert.title" : `餐柜:${res.data.data.closet_code}-${res.data.data.box_number}`,
                "Alert.msg" : `取餐位置在${res.data.data.pickup_location}哦`,
              })
              
            } else {
              this.setData({
                "Alert.title" : `${res.data.data.publisher_job_num}(特殊餐品)`,
                "Alert.msg" : `${res.data.data.pickup_location}`,
              })
            }
          }
          // 餐未到
          else if (res.data.code == 561) {
            this.setData({
              "showAlert": 2,
              "Alert.show" : true,
              "Alert.title" : "温馨提示",
              "Alert.msg" : "饭还没到噢，现在还不能取餐呢",
            })
            
          }
          // 开柜失败
          else if (res.data.code == 562) {
            this.setData({
                "showAlert" : 2,
                "Alert.show" : true,
                "Alert.title" : "温馨提示",
                "Alert.msg" : "开柜失败，请重新尝试",
            })
            
          }
          // 不在领取时间
          else if (res.data.code == 563) {
            this.setData({
              "showAlert" : 2,
              "Alert.show" : true,
              "Alert.title" : "温馨提示",
              "Alert.msg" : "不在领取时间，请稍后再试",
            })
            
          }
          // 登录美餐账号发生错误
          else if (res.data.code == 985) {
            this.setData({
              "showAlert" : 2,
              "Alert.show" : true,
              "Alert.title" : "温馨提示",
              "Alert.msg" :
                "非常抱歉,餐饭的美餐账号或密码错误了\n该餐饭已失效，请领取其他餐饭",
            })
            
          }
          else if (res.data.code == 986) {
            this.setData({
              "showAlert" : 2,
              "Alert.show" : true,
              "Alert.title" : "温馨提示",
              "Alert.msg" : "该餐饭已失效",
            })
            
            this.toGetMealList();
          } else if (res.data.code == 1000) {
              this.setData({
                Alert:{
                  show: true,
                  title: "温馨提示",
                  left: "确认",
                  msg: `未知错误，请稍后再试`,
                  type: 0,
                  rightFn: this.defaultFn
                }
              })
          } else if (res.data.code == 900) {
              this.setData({
                Alert:{
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
            };
            this.triggerEvent('alert',{msg:this.data.Alert})
            this.toGetMealList();
      }).catch(e=>{
        this.triggerEvent("loading",{loading:false})
        console.log(e)
      })
      
      
      }    

  }
})
