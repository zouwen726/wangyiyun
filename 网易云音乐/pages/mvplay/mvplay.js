// pages/mvplay/mvplay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //mvid
    mvid:"",
    //mv地址
    mvurl:'',
    //mv详情
    mvdata:{},
    count:"",
    mvlist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const mid = options.mvid
    this.info(mid)
   

  },
  info:function(mid){
    //存储当前mvid
    // console.log(options.mvid)
    this.setData({
      mvid:mid
    })
    //当前视频url获取
    this.getmvdata()
    this. getmvdetail()
    this.getsimi()
  },
  //获取mv的地址
  getmvdata:function(){
    // console.log(this.data.mvid)
    const mvid = this.data.mvid
    wx.request({
      url: 'http://localhost:3000/mv/url?id='+mvid,
      success:(res)=>{
        // console.log(res)
        this.setData({
          mvurl:res.data.data.url
        })
      }
    })
  },
  //获取mv的详情数据
  getmvdetail:function(){
    // console.log(this.data.mvid)
    const mvid = this.data.mvid
    wx.request({
      url: 'http://localhost:3000/mv/detail?mvid='+mvid,
      success:(res)=>{
        // console.log(res)
        let playcount = res.data.data.playCount
        let playcountstr=""
        if(playcount>=10000){
          let c1 = Math.floor(playcount/10000)
          let c2 = playcount%10000
          playcountstr = c1+"."+c2
          playcountstr = playcountstr.slice(0,-3)+"万"
          this.setData({
            count:playcountstr
          })
        }else{
          this.setData({
            count:playcount
          })
        }

        this.setData({
          mvdata:res.data.data
        })
      }
    })
  },
  //相似mv获取
  getsimi:function(){
    const mvid = this.data.mvid
    wx.request({
      url: 'http://localhost:3000/simi/mv?mvid='+mvid,
      success:(res)=>{
        // console.log(res.data.mvs)
        this.setData({
          mvlist:res.data.mvs
        })
      }
    })
  },
  //点击推荐mv
  playvideo:function(e){
    const index = e.currentTarget.dataset.index
    const mid = this.data.mvlist[index].id
    // this.setData({
    //   mvid:itemdata.id
    // })
    this.info(mid)
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