// pages/play/play.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //定义空列表
    lrcdata:[],
    //歌曲列表
    musiclist:[],
    //当前歌曲下标
    nowindex:"",
    //当前歌曲数据
    music:{},
    //歌曲id
    musicid:"",
    //控制播放方法
    action:{
      method:"play"
    },
    //当前播放歌词下标
    lrcindex:0,
    //当前滚动参数
    top:0,
    //播放时间的对象
 
      "playtime":"00:00",
      "sumtime":"03:00",
      "maxtime":180,
      "valuetime":0,
      //顺序，单曲，随机
    mode:["loop","single","random"],
    modeindex:0,
    modestate:"loop",
    //播放列表显示状态
    // listhidden:"hidden",
    //播放列表的top值
    listtop:0
  },
  //播放控制
  playdate:function(){
    //获取当前状态
    let date = this.data.action.method
    //判断当前状态
    if(date==="play"){
      this.setData({
        action:{
        "method":"pause"
        }
      })
    }else{
      this.setData({
        action:{
          "method":"play"
        }
      })
    }
  },
  //获取歌词
  getlrc:function(){
    wx.request({
      url: 'http://localhost:3000/lyric?id='+this.data.musicid,
      success:(res)=>{
        // console.log(res.data.lrc.lyric)
        const lrcstr = res.data.lrc.lyric
        this.setlrcshow(lrcstr)
      },

    })
  },
// [00:22.591]对花色独有情怀
// [00:25.226]房间永远保持干净状态
// [00:27.780]即便平日里无人来
  //整理歌词
  setlrcshow:function(lrc){
    //定义空列表
    let lrcdata = []
    //拆分成段落
    const lrclist = lrc.split("\n")
    // console.log(lrclist)
    //分离时间和歌词
    //定义正则 [00:36.344]
    const re = /\[\d{2}:\d{2}\.\d{2,3}\]/
    lrclist.forEach(item =>{
      // console.log(item)
      // if(!item){

      // }
      //获取时间
      let itemdate = item.match(re)
      // console.log(itemdate)
      //判断剔除空时间
      if(itemdate){
        itemdate = itemdate[0]
        // console.log(itemdate)
        //整理时间-拆分中括号
        itemdate = itemdate.slice(1,-1)
        // console.log(itemdate)
        // 01:24.55 转化成运算意义的  秒
        const timelist = itemdate.split(":")
        const time0 = timelist[0]
        const time1 = timelist[1]
        // console.log(time0,time1)
        //整理拿到的最终的时间值
        const time = parseFloat(time0)*60+parseFloat(time1)
        // console.log(time)
        //找歌词
        const lrcstr =  item.replace(re,"")
        // console.log(lrcstr)
        //给歌词和时间整理存到列表
        lrcdata.push([time,lrcstr])
      }
    })
    // console.log(lrcdata)
    //存储
    this.setData({
      lrcdata:lrcdata
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取传过来的歌曲数据
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('emitsong',(data)=>{
        // console.log(data.data)
        const musiclist = data.data.musiclist
        const nowindex = data.data.nowIndex
        const music = musiclist[nowindex]
        //赋值
        this.setData({
          nowindex:nowindex,
          musiclist:musiclist,
          musicid:music.id,
        })
      })
      //调用歌曲详情的方法
      this.getMusicDetail()
      //播放暂停
      // this.playdate()
      //获取歌词
      this.getlrc()
  },
  //歌曲详情
  getMusicDetail:function(){
    wx.request({
      url: 'http://localhost:3000/song/detail?ids='+this.data.musicid,
      success: (res)=>{
        // console.log(res.data.songs[0])
        this.setData({
          music: res.data.songs[0]
        })
      }
    })
  },
  //播放时间改变 播放歌曲会一直执行这个方法// console.log("aaaa")
  timechange:function(e){
    //当前时间
    var playtime = e.detail.currentTime
    //总时间
    var sumtime = e.detail.duration
    // console.log(playtime,sumtime)
    //获取e
    // console.log(e)
    //歌词滚动
    this.lrcscroll(playtime)
    //进度条时间改变
    this.timeplay(sumtime,playtime)
  },
  //歌词显示和滚动
  lrcscroll:function(playtime){
    //拿到歌词数据
    const lrcdata = this.data.lrcdata
    for(let i=0; i<lrcdata.length-1;i++){
      // console.log(lrcdata[i][0])
      // console.log(lrcdata[i][1])
      //判断当前是否匹配到这个歌词（判断区间）
      if(lrcdata[i][0]<playtime&&playtime<lrcdata[i+1][0]){
        //设置歌词下标
        this.setData({
          lrcindex:i
        })
        // console.log(lrcdata[i][1])
      }
    }
    //歌词滚动
    this.setData({
      top:(this.data.lrcindex-5)*30
    })
  },
  //进度条时间改变
  timeplay:function(sumtime,playtime){
    //处理总时长
    var m = sumtime/60
    m=Math.floor(m)
    let s = sumtime%60
    s=Math.floor(s)
    if(m<10) m="0"+m
    if(s<10) s="0"+s
    // console.log(m+":"+s)
    //处理正在播放的时长
    var play_m = playtime/60
    play_m=Math.floor(play_m)
    let play_s = playtime%60
    play_s=Math.floor(play_s)
    if(play_m<10) play_m="0"+play_m
    if(play_s<10) play_s="0"+play_s
    // console.log(play_m+":"+play_s)
    this.setData({
        "sumtime":m+":"+s,
        "playtime":play_m+":"+play_s,
        "maxtime":sumtime,
        "valuetime":playtime
    })
  },
  //拖动滚动条
  sliderchange:function(e){
    // console.log(e.detail.value)
    let v = e.detail.value
    this.setData({
      timeobj:{
        valuetime:v
      }
    })
    //对播放器定义的修改
    this.setData({
      action:{
        method:"setCurrentTime",
        data:v
      }
    })
    //修改播放状态
    this.setData({
      action:{
        method:"play",
      }
    })
  },
  //下一首
  nextsong:function(){
    const musiclist = this.data.musiclist
    let index = this.data.nowindex
    //拿到模式
    const modestate = this.data.modestate
    //判断模式给出不同的修改id方案
    switch(modestate){
      case "loop":
          index++
          // console.log("顺序播放",index)
        break;
      case "single":
        // console.log("单曲播放",index)
        break;
      case "random":
        index =Math.floor( Math.random()*musiclist.length) 
        // console.log("随机播放",index)
        break; 
    }
    if(index===musiclist.length) index=0
    this.setData({
      musicid:musiclist[index].id,
      nowindex: index
    })
    this.setData({
      action:{
        method:"play"
      }
    })
    this.getlrc()
    this.getMusicDetail()
  },
  //上一首
  pervsong:function(){
    const musiclist = this.data.musiclist
    let index = this.data.nowindex
    //拿到模式
    const modestate = this.data.modestate
    //判断模式给出不同的修改id方案
    switch(modestate){
      case "loop":
          index--
          // console.log("顺序播放",index)
        break;
      case "single":
        // console.log("单曲播放",index)
        break;
      case "random":
        index =Math.floor( Math.random()*musiclist.length) 
        // console.log("随机播放",index)
        break; 
    }
    if(index<0) index=musiclist.length-1
    this.setData({
      musicid:musiclist[index].id,
      nowindex: index
    })
    this.setData({
      action:{
        method:"play"
      }
    })
    this.getlrc()
    this.getMusicDetail()
  },
  //状态修改
  playmode:function(){
    //状态列表
    const mode =  this.data.mode
    //状态下标
    let modeindex = this.data.modeindex
    modeindex++
    if(modeindex===mode.length) modeindex=0
    this.setData({
      modestate:mode[modeindex],
      modeindex:modeindex
    })
  },
 //播放结束
 musicend:function(){
   this.nextsong()
 },
 //播放列表
 playlist:function(e){
  //  console.log(e)
  const listhidden = this.data.listtop
  if(listhidden==="400"){
    this.setData({
      listtop:0
    })
  }else{
    this.setData({
      listtop:400
    })
  }
 },
 //隐藏播放列表
 hiddenlist:function(){
  this.setData({
    listtop:0
  })
 },
 //歌单列表切歌
 musicchange:function(e){
  // console.log(e)
  const index = e.currentTarget.dataset.index
  //拿到下标后找到该歌曲
  const musiclist = this.data.musiclist
  const music = musiclist[index]
  this.setData({
    musicid:music.id,
    nowindex:index
  })
  //更新播放状态
  this.setData({
    action: {
      method:"play"
    }
  })
  //获取歌词
  this.getlrc()
  this.getMusicDetail()
 },
 //删除歌曲歌曲
 deletemusic:function(e){
  const musiclist = this.data.musiclist
  const index = e.currentTarget.dataset.index
  //拿到当前播放歌曲下标
  const nowindex = this.data.nowindex
  if(index ===nowindex){
    wx.showModal({
      title: '提示',
      content: '当前正在播放此歌曲，无法删除',
     
    })
    return
  }
  //删除操作
  musiclist.splice(index,1)
  // console.log("被删除：",delitem)
  this.setData({
    musiclist:musiclist
  })
 },
 //点击mv页面
 playmv:function(e){
  const music = this.data.music
  // console.log("mvid:",music.mv)
  const mvid = music.mv
  //判断是否有mv
  if(!mvid){
    wx.showModal({
      title: '提示',
      content: '这个歌曲没有mv',
    })
    return
  }
  //把mvid传到mv详情播放页面
  wx.navigateTo({
    url: '/pages/mvplay/mvplay?mvid='+mvid,
  })
  //停止当前歌曲播放
  this.setData({
    action:{
      method:"pause"
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