// pages/components/topbar/topbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actived:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabList:[{
        name:"我要干饭"
      },{
        name:"我的领取"
      },{
        name:"我的发布"
      }
      ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTo(event){
      
      this.triggerEvent('changecomponents',{index:event.target.id})
      this.setData({
        actived:event.target.id
      })
    },
  }
})
