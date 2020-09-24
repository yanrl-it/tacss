<template>
  <div class="encoder-edit">
    <div style="padding-bottom: 30px;">
      <title-pag :title="'视频参数设置'"></title-pag>
    </div>
    <div>
      <ul class="title-group" style="padding-bottom: 10px;">
        <li class="col-236"><div class="title">频道名称</div></li>
        <li class="col-403"><div class="title">压缩频道ID</div></li>
        <li class="col-168"><div class="title">目标分辨率</div></li>
        <li class="col-112"><div class="title">码率控制</div></li>
        <li class="col-112"><div class="title">码率</div></li>
        <!-- <li class="col-112"><div class="title">编码质量</div></li> -->
        <li class="col-90"><div class="title">GOP(秒)</div></li>
        <li class="col-64"><div class="title">音频</div></li>
      </ul>
      <ul class="export-group" v-for="(item, i) in GBChannel" :key="i">
        <li class="col-236"><input v-model="item.name" type="text" disabled></li>
        <li class="col-403"><input v-model="item.id" type="text" disabled></li>
        <li class="col-168"><input v-model.number="fb" type="text" disabled></li>
        <li class="col-112">
          <select v-model.number="item.bitrate_type">
            <option value="0">cdr</option>
            <option value="1">vbr</option>
            <option value="2">avbr</option>
          </select>
        </li>
        <li class="col-112">
          <input type="text" v-model.number="item.bitrate">
        </li>
        <!-- <li class="col-112">
          <select>
            <option value="">H.264</option>
          </select>
        </li> -->
        <li class="col-90">
          <select v-model.number="item.gop">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </li>
        <li class="col-64" style="padding-top:3px;">
          <el-switch
            v-model.number="item.audio"
            :width="64"
            :height="26"
            :active-value="1"
            :inactive-value="0"
            active-text="CN"
            inactive-text="OFF">
          </el-switch>
        </li>
      </ul>
    </div>
    <div class="click-btn"><button @click="setConfig" class="btn">保存</button></div>
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
      GBChannel: [],
      GBLocalServer: {},
      GBRemoteServer: {},
      setting: {},
      mac: '',
      fb: '与源码一致'
    }
  },
  created() {
    this.mac = this.$route.query.mac;
    this.configLoad();
  },
  methods: {
    configLoad() {
      this.axios
        .post(`/encoderconfig/read/conf.json/${this.mac}`, {})
        .then(res => {
          if (res.status != '200') return
          this.GBChannel = res.data.GBChannel
          this.GBLocalServer = res.data.GBLocalServer
          this.GBRemoteServer = res.data.GBRemoteServer
          this.setting = res.data.setting
          // console.log(res.data)
        })
    },
    setConfig() {
      this.axios
        .post(`/encoderconfig/write/conf.json/${this.mac}`, {
          "GBChannel": this.GBChannel,
          "GBLocalServer": this.GBLocalServer,
          "GBRemoteServer": this.GBRemoteServer,
          "setting": this.setting
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            })
          }
        })
    }
  }
}
</script>

<style scoped>
.encoder-edit {
	height: 670px;
	background-color: #1f3147;
	border-radius: 4px;
  padding: 20px;
  box-sizing: border-box;
}
.export-group {
  padding-bottom: 30px;
}
.title-group {
  padding-bottom: 10px;
}
.title-group,.export-group {
  display: flex;
  justify-content: space-between;
}
.title {
  text-align: center;
	font-size: 14px;
	color: #afafaf;
}
.col-236 {
  width: 236px;
}
.col-403 {
  width: 403px;
}
.col-168 {
  width: 168px;
}
.col-112 {
  width: 112px;
}
.col-90 {
  width: 90px;
}
.col-64 {
  width: 64px;
}
input {
  width: 100%;
  height: 32px;
  box-sizing: border-box;
	background-color: #182633;
	border-radius: 2px;
  border: solid 1px rgba(255, 255, 255, 0.07);
  font-size: 14px;
  padding-left: 9px;
	color: #ffffff;
}
input:disabled {
  background-color: #3c4b5e;
}
.click-btn {
  position: absolute;
  text-align: center;
  width: 100%;
  bottom: 28px;
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
select {
  color: #ffffff;
  font-family: PingFang-SC-Regular;
  font-size: 14px;
  width: 100%;
	height: 32px;
	border-radius: 2px;
  border: solid 1px rgba(255, 255, 255, 0.07);
  appearance:none;
  -moz-appearance:none;
  -webkit-appearance:none;
  padding: 0 8px;
  padding-right: 18px;
  background: url("../../../assets/image/icon_select.png") no-repeat scroll right 5px center;
	background-color: #182633;
}
select::-ms-expand { 
  display: none; 
}
</style>