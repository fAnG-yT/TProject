// pages/login/login.js
var request  = require('../request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobnumber:"",
    password:"",
    loading:false
  },

  login(){
    console.log(this.data.jobnumber,this.data.password)
    this.setData({
      loading:true
    })
    request.toRequest('/v1/login',{password:this.data.password,username:this.data.jobnumber}).then(res=>{
      console.log(res)
      if(res.data.code==100){
        wx.setStorageSync('token', res.data.data.token)
        wx.setStorageSync('jobnumber', res.data.data.job_num)
        wx.redirectTo({
          url: "/pages/index/index"
        })
      }
    }).catch(e=>{
      console.log(e)
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})