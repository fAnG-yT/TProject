var request = require("../../request");

// pages/views/publish/publish.js
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
    unkshow: {
      show: false,
    },
    releaseList: [],
    tranMyID: "", // 用于临时存储被点取消的信息的发布id
    showAlert: false,
    alertMessage: {
      // 字段规则和意义参考Alert组件的注释
      show: false,
      title: "您要取消发布的这份餐饭吗",
      left: "再考虑考虑",
      leftCSS: {
        color: "#F7CE74",
        fontSize: 14*2+"rpx",
        textAlign: "center",
      },
      right: "确认取消",
      rightCSS: {
        color: "#AB9393",
        fontSize: 14*2+"rpx",
        textAlign: "center",
      },
      type: 1,
      msg: [
        {
          txt: "名例子",
          style: {
            color: "#101010",
            fontSize: 16*2+"rpx",
            textAlign: "left",
          },
        },
        {
          txt: "楼例子",
          style: {
            color: "#101010",
            fontSize: 13*2+"rpx",
            textAlign: "left",
          },
        },
      ],
      rightFn: function () {
        // 使用外部方法
      },
    },
    haveMsg: true, // 列表有没有信息
  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    cancelRelease: function (event) {
      var s = event.currentTarget.dataset.item
      // s参数是餐品信息
      // console.log('test click it');
      if (s.status !== "one") {
        // console.log('test no');
        return;
      } else {
        // 当该餐品可以点击取消发布时(s.status为one)
        // console.log('test yes');
        // this.alertMessage.msg[0].txt = s.name;
        // this.alertMessage.msg[1].txt = s.address;
        // this.alertMessage.show = true;
        this.setData({
          tranMyID : s.id//存储发布id
        })
        var alertMessage = {
          show: true,
          title: "您要取消发布的这份餐饭吗",
          left: "再考虑考虑",
          leftCSS: {
            color: "#F7CE74",
            fontSize: 14*2+"rpx",
            textAlign: "center",
          },
          right: "确认取消",
          rightCSS: {
            color: "#AB9393",
            fontSize: 14*2+"rpx",
            textAlign: "center",
          },
          type: 1,
          msg: [
            {
              txt: s.name,
              style: {
                color: "#101010",
                fontSize: 16*2+"rpx",
                textAlign: "left",
              },
            },
            {
              txt: s.address,
              style: {
                color: "#101010",
                fontSize: 13*2+"rpx",
                textAlign: "left",
              },
            },
          ],
          rightFn: this.throttle(()=>this.askCancel(s.id), 1000)
        };
        this.triggerEvent('alert',{msg:alertMessage})
      }
    },

    toGetMealList() {
      request.toRequest('/v1/meal/publish/my')
        .then((res) => {
          console.log("test getMyRelease");
          console.log(res.data);
          if (res.data.code == 620) {
            var sub = []
            
            if (res.data.data.list.length > 0) {
              for (let i = 0; i < res.data.data.list.length; i++) {
                // 循环获取到的list
                // console.log(i);
                let lobj = {}; // 用于临时存放的对象
                lobj.id = res.data.data.list[i].publish_id;
                if (res.data.data.list[i].meal_name.length > 15) {
                  var qiege =
                    res.data.data.list[i].meal_name.substring(0, 14) + "...";
                  lobj.name = qiege;
                } else {
                  lobj.name = res.data.data.list[i].meal_name;
                }
                lobj.address = res.data.data.list[i].pickup_location;
                lobj.time = res.data.data.list[i].date.replace(/-/g, "/");
                if (res.data.data.list[i].meal_type == 1) {
                  lobj.mealType = "午餐";
                } else {
                  lobj.mealType = "晚餐";
                }
                if (res.data.data.list[i].status == 1) {
                  lobj.status = "one";
                  lobj.tipstext = "取消";
                } else if (res.data.data.list[i].status == 2) {
                  lobj.status = "two";
                  lobj.tipstext = "已被领取";
                } else if (res.data.data.list[i].status == 3) {
                  lobj.status = "three";
                  lobj.tipstext = "已失效";
                }
                sub.push(lobj);
              }
              // console.log(this.releaseList);
              this.setData({
                releaseList:sub,
                haveMsg:true
              })
            } else {
              this.setData({
                haveMsg : false
              })
              
            }
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
        })
        .catch((e) => {
          console.log(e);
        });
    },

    askCancel: function (publish_id) {
      console.log("test askCancel");
      request.toRequest('/v1/meal/publish/cancel',{publish_id})
        .then((res) => {
          var alertMessage = null
          var code = res.data.code;
          
          if (code == 530) {
            console.log("cancelRelease 530");
            alertMessage = {show:false}
          } else if (code == 531) {
            console.log("cancelRelease 531");
            alertMessage = {
              show: true,
              title: "提示",
              left: "确定",
              leftCSS: {
                color: "#000",
                fontSize: 14*2+"rpx",
                textAlign: "center",
              },
              type: 0,
              msg: "该餐饭已被领取，不可取消。",
              rightFn: function () {
                // 使用外部方法
              },
            };
          } else if (code == 532) {
            console.log("cancelRelease 532");
            alertMessage = {
              show: true,
              title: "提示",
              left: "确定",
              leftCSS: {
                color: "#000",
                fontSize: 14*2+"rpx",
                textAlign: "center",
              },
              type: 0,
              msg: "该餐饭已被领取，不可取消。",
              rightFn: function () {
                // 使用外部方法
              },
            };
            
          }
          this.triggerEvent('alert',{msg:alertMessage})
          this.toGetMealList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    // ownRightFn: function (a) {
    //   console.log("test rFn");
    //   a.show = false;
    //   if (a.type == "1") {
    //     this.throttleAskCancel();
    //   } else {
    //     // console.log('a.type: 0');
    //   }
    // },
  }
})
