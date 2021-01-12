// pages/components/alert/alert.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg:{
      type:Object,
      value:{
        show:true
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
        clickRight:function(){
            // if(this.data.msg.right){
              this.triggerEvent('right')
              
            // this.mes.show = false
        },
        clickLeft:function(){
          this.setData({
            'msg.show':false
          })
          console.log("close~~")
        }
  }
})
