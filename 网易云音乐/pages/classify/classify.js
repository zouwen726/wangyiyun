// pages/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航列表数据
       navlist:[],
      //  当前导航项
       nowNavword:"",
       nowindx:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getNavlist()
  },
  // 获取导航关键词的方法
  getNavlist:function(){
    // 获取当前导航下标
    const nowindex= this.data.nowindx
    // 异步请求
    new Promise((resolve, reject) => {
      wx.request({
        url: 'http://localhost:3000/playlist/catlist',
        success: (result) => {
          resolve(result)
        },
      })
    }).then(result=>{
      // 根据导航下标获取当前选择的导航关键字
      const word=result.data.sub[nowindex].name
      // 拿到数据后获取歌曲列表
      this.getMusiclist(word)
      // 设置导航数据
      // console.log(result)
      this.setData({
        navlist:result.data.sub
      })
    })
  },
  // 点击导航
  navclick:function(e){
    // 获取关键字
     const word=e.currentTarget.dataset.name
      // 获取当前下标
      const index=e.currentTarget.dataset.index
    //  修改当前下标
    this.setData({
      nowindx:index
    })
     this.getMusiclist(word)
  },
  // 通过关键字 获取显示的歌单
  getMusiclist:function(word){
       wx.request({
         url: 'http://localhost:3000/top/playlist?limit=20&cat='+word,
         success: (result) => {
          //  console.log(result.data.playlists)
           this.setData({
             musiclist:result.data.playlists
           })
         },
       })
  },
  // 点击歌曲进行歌单详情跳转
  playclick:function(e){
    //  获取歌单下标
     const index=e.currentTarget.dataset.index
    //  获取所有歌单列表
     const musiclist=   this.data.musiclist
    //  获取歌单id
     const data=musiclist[index]
   // 异步请求歌单id

     new Promise((resolve, reject) => {
      wx.request({
        // 热歌榜 id 3778678
        url: 'http://localhost:3000/playlist/detail?id='+data.id,
        success: (result) => {
           console.log(result.data.playlist)
           resolve(result)
        },
      })
    }).then(result=>{
      const itemdata=result.data.playlist
      wx.navigateTo({
        url: '/pages/listdetail/listdetail',
        // 传递榜单数据
        success:function(res){
          res.eventChannel.emit('emitlist', { data: itemdata})
        }
      })
    })
     
   

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