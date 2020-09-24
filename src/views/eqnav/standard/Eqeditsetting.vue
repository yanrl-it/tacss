<template>
  <div class="editsetting-box">
    <div><title-pag :title="'视频参数设置'"></title-pag></div>
    <div style="padding-top: 30px;">
      <div style="padding-bottom: 10px;">
        <ul class="title-group">
          <li class="col-236"><div class="title">频道名称</div></li>
          <li class="col-168"><div class="title">国际分辨率</div></li>
          <li class="col-168"><div class="title">编码方式</div></li>
          <!-- <li class="col-187"><div class="title">编码质量</div></li> -->
          <li class="col-90"><div class="title">码率控制</div></li>
          <li class="col-90"><div class="title">码率</div></li>
          <li class="col-90"><div class="title">GOP(秒)</div></li>
          <li class="col-64"><div class="title">音频</div></li>
          <li class="col-64"><div class="title">子码流</div></li>
          <li class="col-90"><div class="title">通道</div></li>
        </ul>
      </div>
      <div>
        <ul class="setting-box" v-for="(item, i) in OnvifChannel" :key="i" style="padding-bottom: 32px;">
          <li class="col-236"><input v-model="item.name" class="info-input" type="text"></li>
          <li class="col-168">
            <select v-model.number="item.keep_size">
              <option value="1">与源分辨率一致</option>
            </select>
          </li>
          <!-- <li class="col-168">
            <select>
              <option value="">H.264 Baseline</option>
            </select>
          </li> -->
          <li class="col-187">
            <select v-model="item.codec">
              <option value="h264">h264</option>
              <option value="h265">h265</option>
            </select>
          </li>
          <li class="col-90">
            <select v-model.number="item.bitrate_type">
              <option value="0">cdr</option>
              <option value="1">vbr</option>
              <option value="2">avbr</option>
            </select>
          </li>
          <li class="col-90">
            <input class="info-input" type="text" v-model.number="item.bitrate">
          </li>
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
          <li class="col-64">
            <div style="padding-top: 3px;">
              <el-switch
                v-model.number="item.audio"
                :width="64"
                :height="26"
                :active-value="1"
                :inactive-value="0"
                active-text="CN"
                inactive-text="OFF">
              </el-switch>
            </div>
          </li>
          <li class="col-64">
            <div style="padding-top: 3px;">
              <el-switch
                v-model.number="item.sub_stream"
                :width="64"
                :height="26"
                :active-value="1"
                :inactive-value="0"
                active-text="CN"
                inactive-text="OFF">
              </el-switch>
            </div>
          </li>
          <li class="col-90">
            <select v-model.number="item.seq">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </li>
        </ul>
      </div>
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
      DeviceInfo: {},
      OnvifChannel: [],
      OnvifServer: {},
      Setting: {},
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
        .post(`/encoderconfig/read/conf.json/${this.mac}`,{})
        .then(res => {
          if (res.status != '200') return
          this.DeviceInfo = res.data.DeviceInfo
          this.OnvifChannel = res.data.OnvifChannel
          this.OnvifServer = res.data.OnvifServer
          this.Setting = res.data.Setting
          // console.log(res.data)
        })
    },
    setConfig() {
      // console.log(this.OnvifChannel)
      var hash = {};
      for(var i in this.OnvifChannel) {
        if(hash[this.OnvifChannel[i].seq]) {
          this.$message({
            showClose: true,
            message: '通道不能重复，请重新输入！',
            type: 'error'
          })
          return
        }
        hash[this.OnvifChannel[i].seq] = true;
      }
      this.axios
        .post(`/encoderconfig/write/conf.json/${this.mac}`, {
          "DeviceInfo": this.DeviceInfo,
          "OnvifChannel": this.OnvifChannel,
          "OnvifServer": this.OnvifServer,
          "Setting": this.Setting
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
.editsetting-box {
  box-sizing: border-box;
  height: 670px;
  padding: 20px;
  background-color: #1f3147;
  box-sizing: border-box;
}
.title-group, .setting-box {
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
.col-187 {
  width: 187px;
}
.col-168 {
  width: 168px;
}
.col-90 {
  width: 90px;
}
.col-64 {
  width: 64px;
}
.info-input {
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
.in-abled {
  background-color: #3c4b5e;
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
.click-btn {
  position: absolute;
  text-align: center;
  width: 1480px;
  bottom: 28px;
  box-sizing: border-box;
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