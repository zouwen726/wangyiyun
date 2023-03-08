// pages/mv/mv.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvdata:{},
    // count:0,
  },
  getdata:function(){
  
    wx.request({
      url: 'http://localhost:3000/mv/exclusive/rcmd',
      success:(res)=>{
        // console.log(res)
        res.data.data.forEach(item => {
          // console.log(item)
          const countstr =  this.setcount(item.playCount)
          // this.setData({
          //   count:countstr
          // })
          item.countstr = countstr
        });
        this.setData({
          mvdata:res
        })
      }
    })
  },
  //处理播放量格式的方法
  setcount:function(playcount){
    let playcountstr=""
    if(playcount>=10000){
      let c1 = Math.floor(playcount/10000)
      let c2 = playcount%10000
      playcountstr = c1+"."+c2
      playcountstr = playcountstr.slice(0,-3)+"万"
      // console.log(playcountstr)
      return playcountstr
    }else{
     return playcount
    //  console.log(playcount)
    }

  },
  //点击视频跳转
  mvitem:function(e){
    // console.log(e.currentTarget.dataset.mid)
    const mid = e.currentTarget.dataset.mid
    // console.log(e.currentTarget.dataset.index)
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/mvplay/mvplay?mvid='+mid,
     
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getdata()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})