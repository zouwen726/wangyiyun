// pages/songlist/songlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //banner
    background: {},
    //singer
    singer: {},
    //newmusic
    newMusicList: {},
    //热歌榜
    hotMusicList:{},
  },

  //获取banner
  getbanner:function(){
    wx.request({
      url: 'http://localhost:3000/banner',
      dataType: "json",
      success:(res) =>{
        // console.log(res.data.banners)
        this.setData({
          background: res.data.banners
        })
      },
    })
  },
  //获取歌手
  getsinger:function(){
    wx.request({
      url: 'http://localhost:3000/top/artists',
      dataType: "json",
      success:(res) =>{
        // console.log(res.data.artists)
        this.setData({
          singer: res.data.artists
        })
      },
    })
  },
  //获取热歌推荐
  gethotMusic:function(){
    wx.request({
      url: 'http://localhost:3000/playlist/track/all?id='+3778678+'&limit=20&offset=1',
      dataType: "json",
      success:(res) =>{
        // console.log(res.data.result)
        this.setData({
          hotMusicList: res.data.songs
        })
      },
    })
  },
  //点击热歌榜
  playhotlink:function(e){
    const index = e.currentTarget.dataset.index
      //拿到播放列表数据
      const musicdata = this.data.hotMusicList
      // console.log(musicdata)
      //获取歌曲id
      const mid = musicdata[index].id
      wx.request({
        url: 'http://localhost:3000/check/music?id='+mid,
        // success: (res) =>{
        //   console.log(res)
        // },
        success:(res)=>{
          // console.log(res.data)
          if(res.data.message=="ok"){
            console.log("可以播放")
             //定义数据对象
              const objdata = {}
              objdata.musiclist = musicdata
              objdata.nowIndex = index
              // console.log(objdata)
              wx.navigateTo({
                url: '/pages/play/play',
                success: (res)=>{
                  res.eventChannel.emit('emitsong',{data:objdata})
                }
              })
              
          }else{
            console.log('不能播放')
            wx.showModal({
              title: '',
              content: '歌曲没有版权，请选择其他歌曲播放',
            })
          }
        }
      })
  },
   //获取最新音乐
   getNewMusic:function(){
    wx.request({
      url: 'http://localhost:3000/personalized/newsong',
      dataType: "json",
      success:(res) =>{
        // console.log(res.data.result)
        this.setData({
          newMusicList: res.data.result
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //banner
    this.getbanner()
    //歌手
    this.getsinger()
    //最新音乐
    this.getNewMusic()
    //获取热歌推荐
    this.gethotMusic()
  },
  //点击热门歌手
  hotlink:function(e){
    // console.log(e.currentTarget)
    //拿到当前下标
    const index = e.currentTarget.dataset.index
    //获取当前数据
    const singer = this.data.singer
    // console.log(singer[index])
    //调整页面和数据传递
    wx.navigateTo({
      url: '/pages/singerdetail/singerdetail',
      success:function(res){
        res.eventChannel.emit('emitSingerData',{data:singer[index]})
      }
    })
  },
  // palylink:function(e){
  //   const index = e.currentTarget.dataset.index
  //   console.log(index)
  //   const musicdata = this.data.newMusicList
  //   console.log(musicdata)
  //   const mid = musicdata[index].id
  //   console.log(mid)
  // },
  //点击进入play页面
  palylink:function(e){
    //拿到当前下标
    // console.log(e.currentTarget.dataset.index)
    const index = e.currentTarget.dataset.index
    //拿到播放列表数据
    const musicdata = this.data.newMusicList
    // console.log(musicdata)
    //获取歌曲id
    const mid = musicdata[index].id
    wx.request({
      url: 'http://localhost:3000/check/music?id='+mid,
      // success: (res) =>{
      //   console.log(res)
      // },
      success:(res)=>{
        // console.log(res.data)
        if(res.data.message=="ok"){
          console.log("可以播放")
           //定义数据对象
            const objdata = {}
            objdata.musiclist = musicdata
            objdata.nowIndex = index
            // console.log(objdata)
            wx.navigateTo({
              url: '/pages/play/play',
              success: (res)=>{
                res.eventChannel.emit('emitsong',{data:objdata})
              }
            })
            
        }else{
          console.log('不能播放')
          wx.showModal({
            title: '',
            content: '歌曲没有版权，请选择其他歌曲播放',
          })
        }
      }
    })
  },
  //搜索按钮
  tabsearch:function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //mv精选按钮
  tabmv:function(){
    wx.navigateTo({
      url: '/pages/mv/mv',
    })
  },
  //热门歌曲按钮
  tabhot:function(){
    new Promise((resolve,reject) => {
      wx.request({
        url: 'http://localhost:3000/playlist/detail?id=3778678',
        success:(res)=>{
          resolve(res)
        }
      })
    }).then(res =>{
      const itemdata = res.data.playlist
      wx.navigateTo({
        url: '/pages/listdetail/listdetail',
        success:function(res){
          res.eventChannel.emit('emitlist',{data:itemdata})
        }
      })
    })
  },
  //分类页面
  tabclassify:function(){
    wx.navigateTo({
      url: '/pages/classify/classify',
    })
  },
  //用户个人中心页面
  tabuser:function(){
    wx.navigateTo({
      url: '/pages/user/user',
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