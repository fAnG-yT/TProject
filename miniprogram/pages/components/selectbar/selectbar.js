// pages/components/selectbar/selectbar.js
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
    floorList:["不限","星辉中心17楼","星辉中心18楼","星辉中心19楼","高志大厦1102室"],
    floor:"不限",
    show:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showbox(){
      this.setData({show:!this.data.show})
    },
    getFloor(event){
      var floor = event.target.dataset.item
      this.setData({
        floor:floor,
        show:false
      })
      this.triggerEvent('select',{floor})
  }
  }
})
