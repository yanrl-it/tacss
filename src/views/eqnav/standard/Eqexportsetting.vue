<template>
  <div class="export-box">
    <div><title-pag :title="'视频参数设置'"></title-pag></div>
    <div style="padding: 30px 0 8px 0">
      <ul class="title-group">
        <li class="col-236"><div class="title">频道名称</div></li>
        <li class="col-568"><div class="title">主码流播放地址</div></li>
        <li class="col-401"><div class="title">子码流播放地址</div></li>
        <li class="col-40"><div class="title">HTTP</div></li>
        <li class="col-40"><div class="title">HLS</div></li>
        <li class="col-40"><div class="title">RTMP</div></li>
        <li class="col-40"><div class="title">RTSP</div></li>
      </ul>
    </div>
    <div>
      <ul class="export-list" v-for="(item, i) in OnvifChannel" :key="i">
        <li class="col-236 des" style="font-size: 14px;">{{item.Name}}</li>
        <li class="col-568 des">{{item.Main_stream}}</li>
        <li class="col-401 des">{{item.Sub_stream}}</li>
        <li class="col-40 checkbox"><el-checkbox disabled v-model="value"></el-checkbox></li>
        <li class="col-40 checkbox"><el-checkbox disabled v-model="value"></el-checkbox></li>
        <li class="col-40 checkbox"><el-checkbox disabled v-model="value"></el-checkbox></li>
        <li class="col-40 checkbox"><el-checkbox disabled v-model="value"></el-checkbox></li>
      </ul>
    </div>
    <!-- <div class="btn-group"><button @click="setConfig" class="btn">保存</button></div> -->
  </div>
</template>

<script>
import TitlePag from '@/components/TitlePag'

export default {
  components: {
    TitlePag
  },
  data() {
    return {
      OnvifChannel: [],
      value: true,
      mac: ''
    }
  },
  created() {
    this.mac = this.$route.query.mac;
    this.configLoad()
  },
  methods: {
    configLoad() {
      this.axios
        .post(`encoderconfig/read/onvif.chan/${this.mac}`, {})
        .then(res => {
          this.OnvifChannel = res.data.Channels
          // console.log(res.data.Channels)
        })
    },
    setConfig() {
      this.$message({
        showClose: true,
        message: '保存成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.export-box {
  box-sizing: border-box;
  height: 670px;
  padding: 20px;
  background-color: #1f3147;
}
.title-group, .setting-box, .export-list {
  display: flex;
  justify-content: space-between;
}
.export-list {
  padding-bottom: 16px;
}
.export-list .checkbox {
 display: flex;
 align-items: center;
 justify-content: center;
}
.export-list .des {
  box-sizing: border-box;
  padding-left: 10px;
  display: flex;
  align-items: left;
  justify-content: space-around;
  flex-direction: column;
	height: 46px;
  color: #ffffff;
	background-color: #3c4b5e;
	border-radius: 2px;
	border: solid 1px rgba(255, 255, 255, 0.07);
}
.btn-group {
  position: absolute;
  bottom: 28px;
  width: 1480px;
  text-align: center;
}
.title {
  text-align: center;
	font-size: 14px;
	color: #afafaf;
}
.col-236 {
  width: 236px;
}
.col-568 {
  width: 568px;
}
.col-401 {
  width: 401px;
}
.col-40 {
  width: 48px;
}
.btn {
	width: 78px;
	height: 32px;
	background-color: #0fb79c;
  border-radius: 2px;
	font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  border: 0;
}
.btn:active {
  opacity:0.8;
}
</style>