// pages/singerdetail/singerdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前歌手数据
    singerdata:{},
    //歌手详情
    singerdetail:{},
    //歌手热门歌曲
    hotMusicList:{},
    txthidden:"hidden",
    btntxt:"查看完整歌手介绍"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取页面传输过来的基本数据
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('emitSingerData',data=>{
        this.setData({
          singerdata:data
        })
    })
    //调用渲染页面的方法
    this.getdetail()
    //调用歌手热门歌曲
    this.gethotMusic()
  },
  getdetail:function(){
      //获取id
      const id = this.data.singerdata.data.id
      console.log(id)
      //通过id数据请求
      wx.request({
        url: 'http://localhost:3000/artist/detail?id='+id,
        success: (res) =>{
          // console.log(res)
            this.setData({
              singerdetail:res
            })
        }
      })
  },
  //歌手热门歌曲
  gethotMusic:function(){
    //获取id
    const id = this.data.singerdata.data.id
    // console.log(id)
    //通过id数据请求
    wx.request({
      url: 'http://localhost:3000/artist/top/song?id='+id,
      success: (res) =>{
        console.log(res)
          this.setData({
            hotMusicList:res
          })
      }
    })
},
//点击进入play页面
palylink:function(e){
  //拿到当前下标
  // console.log(e.currentTarget.dataset.index)
  const index = e.currentTarget.dataset.index
  //拿到播放列表数据
  const musicdata = this.data.hotMusicList.data.songs
  console.log(musicdata)
  //获取歌曲id
  const mid = musicdata[index].id
  wx.request({
    url: 'http://localhost:3000/check/music?id='+mid,
    // success: (res) =>{
    //   console.log(res)
    // },
    success:(res)=>{
      // console.log(res.data)
      if(res.data.success){
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
//切换简介
  showbtn:function(){
    let txthidden = this.data.txthidden
    if(txthidden==="show"){
      this.setData({
        txthidden:"hidden",
        btntxt:"查看完整歌手介绍"
      })
    }else{
      this.setData({
        txthidden:"show",
        btntxt:"收起"
      })
    }
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