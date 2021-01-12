const request = require('../../request');

// pages/components/center/center.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      msg:{
        show:false,//显示弹出框
        msg:"你确认要退出吗",
        left:"取消",//关闭按钮的文本
        right:"确认",
        // rightFn:
    },
    alert:false,//弹出框显示状态
    user:"T1778",
    level: 1, // 等级
    unkshow:false,
    precent: '0/5',
    grow: [  // 进度条
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
    ],
    lvimg: '',
    list:[{
            icon:"icon-clock",
            name:"点餐提醒",
            path:"/pages/remind/remind"
        },{
        icon:"icon-bangzhu",
        name:"帮助",
        path:"/pages/help/help"
        },{
            icon:"icon-shezhi1",
            name:"修改密码",
            path:"/pages/modify/modify"
        },{
            icon:"icon-tuichu",
            name:"退出",
            path:"/pages/login/login"
        }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
            //积分处理方法
            whatIGet:function(cr){ // cr为请求传入的分数
              var inc = 0; // 存储要增加的面包数量（范围0-5）
              console.log('积分：'+cr);
              for(var i=0;i<this.data.grow.length;i++){
                  var data = `grow[${i}]`
                  this.setData({
                    [data]:false
                  })
              };
              if(cr >= 0 && cr <= 10){
                  inc = Math.floor(cr / 1);
                  this.setData({
                    level : 1,
                    precent : cr+'/10',
                    lvimg : '../../../static/img/candy.png',
                  })
                  
                  this.breadGet(inc);
              }else if(cr > 10 && cr <= 40){
                  cr = cr - 10;
                  inc = Math.floor(cr / 3);
                  this.setData({
                      level : 2,
                      precent : cr+'/30',
                      lvimg : '../../../static/img/shutiao.png',
                  })
                  
                  this.breadGet(inc);
              }else if(cr > 40 && cr <= 100){
                  cr = cr - 40;
                  inc = Math.floor(cr / 6);
                  this.setData({
                    level : 3,
                    precent : cr+'/60',
                    lvimg : '../../../static/img/cola.png'
                  })
                  
                  this.breadGet(inc);
              }else if(cr > 100 && cr <= 200){
                  cr = cr - 100;
                  inc = Math.floor(cr / 10);
                  this.setData({
                      level : 4,
                      precent : cr+'/100',
                      lvimg : '../../../static/img/egg.png',
                  })
                  
                  this.breadGet(inc);
              }else if(cr > 200 && cr <= 400){
                  cr = cr - 200;
                  inc = Math.floor(cr / 20);
                  this.setData({
                      level : 5,
                      precent : cr+'/200',
                      lvimg : '../../../static/img/soup.png',
                  })
                  
                  this.breadGet(inc);
              }else if(cr > 400 && cr <= 900){
                  cr = cr - 400;
                  inc = Math.floor(cr / 50);
                  this.setData({
                    level : 6,
                    precent : cr+'/500',
                    lvimg : '../../../static/img/miantiao.png',
                  })
                  
                  this.breadGet(inc);
              }else if(cr > 900 && cr <= 1900){
                  cr = cr - 1000;
                  inc = Math.floor(cr / 100);
                  this.setData({
                      level : 7,
                      precent : cr+'/1000',
                      lvimg : '../../../static/img/shousi.png',
                  })
                  
                  this.breadGet(inc);
              }else if(cr > 1175){
                  inc = 5
                  this.setData({
                    level : '7+',
                    precent : cr,
                    lvimg : '../../../static/img/cake.png',
                  })
                  
                  this.breadGet(inc);
              }
          },
          // 处理面包显示的方法
          breadGet:function(b){  // b为要增加的面包块（0是默认头尾，1-4增加的是中间）
              console.log('面包：'+b);
              if(b > 0 && b <= 10){
                  for(;b > 0;b--){
                      let data = `grow[${b-1}]`
                      this.setData({
                        [data] : true,
                      })
                      
                  }
              }
          },


          //跳转
          changeView:function(event){
              var item = event.currentTarget.dataset.item
              if(item.name!="退出"){
                  wx.navigateTo({
                    url: item.path,
                  })
              }else{
                // console.log(item.name)
                this.setData({
                  "msg.show":true,
                  "msg.rightFn":this.exit
                })
                this.triggerEvent("alert",{msg:this.data.msg})
              }
          },
          //关闭下拉框
          close:function(){
              this.setData({
                show:false
              })
          },
          //退出
          exit:function(){
            request.toRequest("/v1/logout").then(res=>{
              wx.clearStorageSync()
              wx.redirectTo({
                url: '/pages/login/login',
              })
            }).catch(e=>console.log(e))
          },
  }
})
