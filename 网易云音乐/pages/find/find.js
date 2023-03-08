// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //榜单数据
    toplist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTopMusic()
    // console.log(this.data.toplist)
  },
  //找榜单数据
  getTopList:function(){
    return new Promise(function (resolve,reject){
      wx.request({
        url: 'http://localhost:3000/toplist',
        success: (result)=>{
          const list = result.data.list.slice(0,10)
          resolve(list) 
          // console.log("榜单数据:",list )
        }
      })
    })
  },
  //通过榜单找歌单
  getTopMusic:function(){
    const toplist=[]
    this.getTopList().then(res =>{
      res.forEach(item =>{
        return new Promise(function (resolve,reject){
          wx.request({
            url: 'http://localhost:3000/playlist/track/all?id='+item.id+'&limit=3',
            success:(result)=>{
              // console.log("2,找到歌曲",result.data.songs)
              const songlist = result.data.songs
              item.songlist = songlist
              console.log(item)
              toplist.push(item)
              resolve(toplist)
            },
          })
        }).then(res =>{
          // console.log(res)
          this.setData({
            toplist:res
          })
        })
      })
    })
  },
  //跳转页面
  linklistdetail:function(e){

    const index = e.currentTarget.dataset.index
    const toplist = this.data.toplist
    const itemdata = toplist[index]
    wx.navigateTo({
      url: '/pages/listdetail/listdetail',
      success:function(res){
          res.eventChannel.emit('emitlist',{data:itemdata})
      }
    })
  },
  //搜索框聚焦
  searchlink:function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
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