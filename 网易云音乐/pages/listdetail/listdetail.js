// pages/listdetail/listdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //榜单id
    listid:'',
    //榜单
    listdata:{},
    //歌单数据
    musiclist:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
    this.getmusiclist()
  },
  getpagedate:function(){
    return new Promise((resolve,reject)=>{
      //获取数据
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('emitlist',(data)=>{
      resolve(data)
      this.setData({
        listid:data.data.id,
        listdata:data.data
      })
      // console.log(data)
    })
    })
  },
//歌单数据
  getmusiclist:function(){
    this.getpagedate().then(data=>{
        //获取id
      const id = data.data.id
      wx.request({
        url: 'http://localhost:3000/playlist/track/all?id='+id+'&limit=100&offset=1',
        success:(res)=>{
          // console.log(res.data.songs)
          this.setData({
            musiclist:res.data.songs
          })
        }
      })
    })
  },
  //播放功能
  play:function(e){
      // console.log(e.currentTarget.dataset.index)
      const index = e.currentTarget.dataset.index
      const musicdata = this.data.musiclist
      const music = musicdata[index]
      const mid = music.id
      //传输数据
      wx.request({
        url: 'http://localhost:3000/check/music?id='+mid,
        success:(res)=>{
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