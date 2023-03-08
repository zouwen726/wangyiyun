// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   searchdata:{},
   //搜索关键字
   word:"",
   //搜索结果
   songlist:[],
  },
  //热搜数据
  getsearchdata:function(){
    wx.request({
      url: 'http://localhost:3000/search/hot/detail',
      success:(res)=>{
        console.log(res.data.data)
        this.setData({
          searchdata:res.data.data
        })
      }
    })
  },
  //搜索
  search:function(){
    const word = this.data.word
    wx.request({
      url: 'http://localhost:3000/search?keywords='+word,
      success:(res)=>{
        // console.log(res)
        if(res.data.code==200){
          if(res.data.result.songs){
            this.setData({
              songlist:res.data.result.songs,
              // console.log(res.data.result.songs)
            })
          }else{
              wx.showModal({
                title: '',
                content: '未找到匹配内容,请更换其他关键词',
              })
          }
 
        }else{
          console.log("搜索关键字无效")
        }
      }
    })
  },
  //键入关键字触发
  inputshow:function(e){
    let w = e.detail.value
    if(w){
      this.setData({
        word:w
      })
    }else{
      this.setData({
        word:"",
        songlist:[]
      })
    }
  },
  //点击关键字进行定义
  clickword:function(e){
    const word = e.currentTarget.dataset.word
    this.setData({
      word:word
    })
    this.search()
  },
  //调整播放
  play:function(e){
    //拿到当前下标
  // console.log(e.currentTarget.dataset.index)
  const index = e.currentTarget.dataset.index
  //拿到播放列表数据
  const musicdata = this.data.songlist
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getsearchdata()
    // this.search()
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