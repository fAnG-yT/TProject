// pages/views/dining/dining.js
var request = require("../../request")

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
    msg:{},
    show:true,
    timeToPublish:false,
    listData:[
    ],
    subListData:[
    ],
    floor:"不限",
  },

  lifetimes: {
    created: function() {
      this.toGetMealList()
      this.throttleToRequestPublish = this.throttle(this.toRequestPublish,1000)

    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    defaultFn(){},

    select(item){
      var floor = item instanceof Object?item.detail.floor:item
      // console.log(floor)
      if(floor!='不限'){
        this.setData({
          subListData : this.data.listData.filter((v)=>v.pickup_location==floor),
          floor:floor
        })
      }else{
        this.setData({
          subListData : this.data.listData,
          floor:floor
        })
      }
    },
    
    //节流函数
    throttle(fun, delay) {
      var flag = true;
      function fn() {
        var _this = this,
          _arguments = arguments;
        if (flag) {
          fun.call(_this, _arguments);
          flag = false;
          setTimeout(() => {
            flag = true;
          }, delay);
        } else {
          console.log("节流中");
        }
      }
      return fn;
    },

    toGetMealList:function(){
      request.toRequest('/v1/meal/list').then((res) => {
        if (res.data.code == 600) {
          this.setData({
            show:true,
            timeToPublish:res.data.data.can_ganfan,
            listData : res.data.data.list,
          })
          this.select(this.data.floor);
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
        // else if(res.data.code==1000){
        //   this.unkmsg.show=true
        // }
      }).catch(e=>{
        console.log(e)
      })

    },

    toRequestMeal(event){
        var item = event.currentTarget.dataset.item
        var msg = {
          show: true,
          title: "你确定要领取这份餐饭吗",
          left:"取消",
          right: "领取",
          type: 1,
          msg: [
            {txt: `发布者：${item.publisher_job_num}`},
            {txt: `餐饭：${item.meal_name}`},
            {txt: `取餐地址：${item.pickup_location}`},
          ],
          rightFn:this.throttle(() => this.toGetMeal(item), 1000),
        };
        this.triggerEvent('alert',{msg})
        // this.setData({msg})
      },

    toGetMeal(item){
      this.triggerEvent("loading",{loading:true})
      request.toRequest('/v1/meal/receive/order',{publish_id:item.publish_id}).then(res=>{
        this.triggerEvent("loading",{loading:false})
        var msg = null
        if (res.data.code == 540) {
          if(!res.data.data.can_open){
              msg = {
                show: true,
                title: "领取成功！",
                left: "确认",
                msg: `领取成功的餐饭\n可以去"我的领取"查看哦`,
                type: 0,
                rightFn: this.defaultFn
            };
          }else{
            msg = {
                show: true,
                title: "领取成功！是否现在取餐？",
                left: "稍后取餐",
                right: "现在取餐",
                msg: `取餐位置在${item.pickup_location}哦`,
                type: 0,
                rightFn: this.throttle(
                  () => this.toDining(res.data.data.receive_id),
                  1000
                ),
            };
          }
        } else if (res.data.code == 541) {
          msg = {
            show: true,
            title: "温馨提示",
            left: "关闭",
            type: 0,
            msg: "这个时间段你已经领过一份啦\n不能再领了哦",
            rightFn: this.defaultFn,
          };
        } else if (res.data.code == 542) {
          msg = {
            show: true,
            title: "温馨提示",
            left: "关闭",
            type: 0,
            msg: "哎呀，被别人抢先领走啦！\n看看其他餐饭吧",
            rightFn: this.defaultFn,
          };
        } else if (res.data.code == 543) {
          msg = {
            show: true,
            title: "温馨提示",
            left: "关闭",
            type: 0,
            msg: "哎呀，发布者取消分享这份餐饭了\n看看其他餐饭吧",
            rightFn: this.defaultFn,
          };
        } else if (res.data.code == 544) {
          msg = {
            show: true,
            title: "温馨提示",
            left: "关闭",
            type: 0,
            msg:
              "此时间段不能领取餐饭呢\n允许领取时间段为\n8:30-14:00\n15:30-20:30",
            rightFn: this.defaultFn,
          };
        } else if (res.data.code == 985) {
          msg = {
            show: true,
            title: "温馨提示",
            left: "关闭",
            type: 0,
            msg:
              "哎呀，领取失败了\n非常抱歉,美餐账号或密码错误了\n还是去看看其他餐饭吧",
            rightFn: this.defaultFn,
          };
        } else if (res.data.code == 986) {
          msg = {
            show: true,
            title: "温馨提示",
            left: "关闭",
            type: 0,
            msg: "哎呀，领取失败了\n非常抱歉,此餐饭已被清理了，无法领取哦",
            rightFn: this.defaultFn,
          };
        } else if (res.data.code == 1000) {
            msg = {
              show: true,
              title: "温馨提示",
              left: "确认",
              msg: `未知错误，请稍后再试`,
              type: 0,
              rightFn: this.defaultFn
          };
        } else if (res.data.code == 900) {
          msg = {
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
        }
        this.triggerEvent('alert',{msg})
        this.toGetMealList();
      }).catch((e) => {
        this.triggerEvent("loading",{loading:false})
        console.log(e);
      });
    },
    
    toDining(receive_id) {
      this.triggerEvent("loading",{loading:true})
      var msg = null
      request.toRequest("/v1/meal/receive/open-box",{receive_id})
        .then((res) => {
          this.triggerEvent("loading",{loading:false})
          // 取餐成功
          if (res.data.code == 560) {
            if (res.data.data.use_closet) {
              msg = {
                show: true,
                left: "确认",
                title: `餐柜:${res.data.data.closet_code}-${res.data.data.box_number}`,
                msg: `取餐位置在${res.data.data.pickup_location}哦`,
                type: 0,
                rightFn: this.defaultFn,
              };
            } else {
              msg = {
                show: true,
                left: "确认",
                title: `${res.data.data.publisher_job_num} (特殊餐品区)`,
                msg: `${res.data.data.pickup_location}`,
                type: 0,
                rightFn: this.defaultFn,
              };
            }
          } else if (res.data.code == 561) {
            msg = {
              show: true,
              title: "温馨提示",
              left: "关闭",
              msg: `饭还没到噢，现在还不能取餐呢\n领取成功的餐饭可以去"我的领取"查看哦`,
              type: 0,
              rightFn: this.defaultFn,
            };
          } else if (res.data.code == 562) {
            msg = {
              show: true,
              left: "关闭",
              title: "温馨提示",
              msg: `开柜失败，请重新尝试\n领取成功的餐饭可以去"我的领取"查看哦`,
              type: 0,
              rightFn: this.defaultFn,
            };
          } else if (res.data.code == 563) {
            msg = {
              show: true,
              left: "关闭",
              title: "温馨提示",
              msg: `开柜失败，此时间段不能取餐呢`,
              type: 0,
              rightFn: this.defaultFn,
            };
          } else if (res.data.code == 985) {
            msg = {
              show: true,
              title: "温馨提示",
              left: "关闭",
              type: 0,
              msg:
                "非常抱歉,餐饭的美餐账号或密码错误了\n该餐饭已失效，请领取其他餐饭",
              rightFn: this.defaultFn,
            };
          } else if (res.data.code == 986) {
            msg = {
              show: true,
              title: "温馨提示",
              left: "关闭",
              type: 0,
              msg: "非常抱歉,此餐饭已被清理了，无法取餐哦\n去看看其他餐饭吧",
              rightFn: this.defaultFn,
            };
          } else if (res.data.code == 1000) {
              msg = {
                show: true,
                title: "温馨提示",
                left: "确认",
                msg: `未知错误，请稍后再试`,
                type: 0,
                rightFn: this.defaultFn
            };
          } else if (res.data.code == 900) {
              msg = {
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
          }
          this.triggerEvent('alert',{msg})
        })
        .catch((e) => {
          this.triggerEvent("loading",{loading:false})
          console.log(e);
        });
    },

    throttleToRequestPublish(){},

    //请求发布
    toRequestPublish() {
      this.triggerEvent("loading",{loading:true})
      var msg = null
      request.toRequest("/v1/meal/publish/check")
        .then((res) => {
          this.triggerEvent("loading",{loading:false})
          if (res.data.code == 510) {
            msg = {
              show: true,
              title: "你确定要分享这份餐饭吗",
              left:"取消",
              right: "分享",
              type: 1,
              msg: [
                {txt: res.data.data.meal_name},
                {txt: res.data.data.pickup_location},
              ],
              rightFn: this.throttle(
                () => this.topublishMeal(res.data.data.meal_id),
                1000
              ),
            };
          } else if (res.data.code == 511) {
            msg = {
              show: true,
              title: "温馨提示",
              left: "关闭",
              type: 0,
              msg: "你没有可以分享的餐饭哦",
              rightFn: this.defaultFn,
            };
          } else if (res.data.code == 512) {
            msg = {
              show: true,
              title: "温馨提示",
              left: "关闭",
              type: 0,
              msg:
                "还没到可以发布的时间哦\n允许发布时间段为\n8:30-14:00\n15:30-20:30",
              rightFn: this.defaultFn,
            };
          } else if (res.data.code == 513) {
            msg = {
              show: true,
              left: "关闭",
              title: "温馨提示",
              type: 0,
              msg: "你已经发布过啦\n没有可以发布的餐饭了",
              rightFn: this.defaultFn,
            };
          } else if (res.data.code == 999) {
            this.rmcshow.show = true;
          } else if (res.data.code == 1000) {
              msg = {
                show: true,
                title: "温馨提示",
                left: "确认",
                msg: `未知错误，请稍后再试`,
                type: 0,
                rightFn: this.defaultFn
            };
          } else if (res.data.code == 900) {
              msg = {
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
          }
          this.triggerEvent('alert',{msg})
        })
        .catch((e) => {
          this.triggerEvent("loading",{loading:false})
          console.log(e);
        });
    },

    //确认发布
    topublishMeal(meal_id) {
      this.triggerEvent("loading",{loading:true})
      var msg = null
      request.toRequest("/v1/meal/publish/confirm",{ meal_id })
        .then((res) => {
          this.triggerEvent("loading",{loading:false})
          if (res.data.code == 520) {
            msg = {
              show: true,
              left: "留在此页",
              right:"跳转",
              title: "发布成功",
              type: 0,
              msg: `发布成功的餐饭\n是否跳转到"我的发布"？`,
              rightFn: ()=>{
                this.triggerEvent('alert',{msg:{show:false}})
                this.triggerEvent('changecomponents',{index:2})
              },
            };
          } else if (res.data.code == 999) {
            this.rmcshow.show = true;
          } else if (res.data.code == 1000) {
              msg = {
                show: true,
                title: "温馨提示",
                left: "确认",
                msg: `未知错误，请稍后再试`,
                type: 0,
                rightFn: this.defaultFn
            };
          } else if (res.data.code == 900) {
              msg = {
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
          }
          this.triggerEvent('alert',{msg})
        })
        .catch((e) => {
          this.triggerEvent("loading",{loading:false})
          console.log(e);
        });
    }, 

  }
})
