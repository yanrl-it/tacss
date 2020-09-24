<template>
  <div class="aisle-box">
    <div>
      <title-pag :title="'通道管理'"></title-pag>
    </div>
    <div style="padding-top: 30px;">
      <ul class="title-group" style="padding-bottom: 10px;">
        <li class="col-236"><div class="title">频道名称</div></li>
        <li class="col-244"><div class="title">压缩频道ID</div></li>
        <li class="col-168"><div class="title">IP地址</div></li>
        <li class="col-168"><div class="title">管理端口</div></li>
        <li class="col-126"><div class="title">心跳周期</div></li>
        <li class="col-126"><div class="title">心跳超时次数</div></li>
        <!-- <li class="col-89"><div class="title">状态</div></li> -->
        <li class="col-64"><div class="title">TCP</div></li>
        <li class="col-64"><div class="title">通道开关</div></li>
      </ul>
      <ul class="export-group" v-for="(item, i) in GBChannel" :key="i">
        <li class="col-236"><input v-model="item.name" type="text" :disabled="item.tcp_enable=='0'?true:false"></li>
        <li class="col-244"><input v-model="item.id" type="text" :disabled="item.tcp_enable=='0'?true:false"></li>
        <li class="col-168"><input v-model="item.ip" type="text" :disabled="item.tcp_enable=='0'?true:false"></li>
        <li class="col-168"><input v-model.number="item.port" type="text" :disabled="item.tcp_enable=='0'?true:false"></li>
        <li class="col-126"><input v-model.number="item.heartbeat" type="text" :disabled="item.tcp_enable=='0'?true:false"></li>
        <li class="col-126"><input v-model.number="item.heartbeat_num" type="text" :disabled="item.tcp_enable=='0'?true:false"></li>
        <!-- <li class="col-89">
          <span class="export-status">{{item.tcp_enable==0?'离线':'在线'}}</span>
        </li> -->
        <li class="col-64">
          <div style="padding-top:3px">
            <el-switch
              :disabled="item.tcp_enable=='0'?true:false"
              v-model.number="item.tcp"
              :width="64"
              :height="26"
              :active-value="1"
              :inactive-value="0"
              active-text="TCP"
              inactive-text="UDP">
            </el-switch>
          </div>
        </li>
        <li class="col-64">
          <div style="padding-top:3px">
            <el-switch
              v-model="item.tcp_enable"
              :width="64"
              :height="26"
              :active-value="1"
              :inactive-value="0"
              active-text="CN"
              inactive-text="OFF">
            </el-switch>
          </div>
        </li>
      </ul>
    </div>
    <div @click="setConfig" class="click-btn"><button class="btn">保存</button></div>
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
      mac: ''
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
        .post(`/encoderconfig/write/conf.json//${this.mac}`, {
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
.aisle-box {
  background-color: #1f3147;
  padding: 20px;
  height: 670px;
  box-sizing: border-box;
}
.title-group, .export-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.export-group {
  padding-bottom: 30px;
}
.title {
  text-align: center;
	font-size: 14px;
	color: #afafaf;
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
.export-status {
  display: block;
	width: 89px;
	height: 32px;
  line-height: 30px;
  text-align: center;
	background-color: #3c4b5e;
	border-radius: 2px;
	border: solid 1px rgba(255, 255, 255, 0.07);
  box-sizing: border-box;
}
.col-236 {
  width: 236px;
}
.col-244 {
  width: 244px;
}
.col-168 {
  width: 168px;
}
.col-126 {
  width: 126px;
}
.col-89 {
  width: 89px;
}
.col-64 {
  width: 64px;
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
</style>