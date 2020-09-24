<template>
  <div class="config-box">
    <div class="col">
      <div><title-pag :title="'GB28181本地服务管理设置'"></title-pag></div>
      <ul class="gb-lf">
        <li>
          <div class="title">本地SIP服务器ID</div>
          <div class="input"><input type="text" v-model="GBLocalServer.id"></div>
        </li>
        <li>
          <div class="title">本地SIP域名</div>
          <div class="input"><input type="text" v-model="GBLocalServer.realm"></div>
        </li>
        <li>
          <div class="title">本地SIP服务器IP</div>
          <div class="input"><input type="text" v-model="GBLocalServer.address"></div>
        </li>
        <li>
          <div class="title">本地SIP服务器端口</div>
          <div class="input"><input type="text" v-model.number="GBLocalServer.port"></div>
        </li>
        <li>
          <div class="title">本地SIP通讯传输协议</div>
          <div class="input">
            <select v-model.number="GBLocalServer.protocol">
              <option value="0">TCP</option>
              <option value="1">UDP</option>
            </select>
          </div>
        </li>
        <li>
          <div class="title">本地SIP用户名</div>
          <div class="input"><input type="text" v-model="GBLocalServer.user"></div>
        </li>
        <li>
          <div class="title">本地SIP密码</div>
          <div class="input"><input type="password" v-model="GBLocalServer.passwd"></div>
        </li>
        <li>
          <div class="title">本地SIP是否开启国标服务</div>
          <div class="input">
            <select v-model.number="GBLocalServer.enable" disabled>
              <option value="1">打开</option>
              <option value="0">关闭</option>
            </select>
          </div>
        </li>
        <li>
          <div class="title">接收媒体数据IP地址</div>
          <div class="input"><input type="text" v-model="GBLocalServer.media_address"></div>
        </li>
        <li>
          <div class="title">接收媒体数据端口</div>
          <div class="input"><input type="text" v-model.number="GBLocalServer.media_recv_port"></div>
        </li>
        <li>
          <div class="title">媒体数据转发端口</div>
          <div class="input" style="width: 230px;">
            <input type="text" v-model.number="GBLocalServer.media_forward_port_min">
          </div>
          <div style="width:39px;text-align:center;">
            -
          </div>
          <div class="input" style="width: 230px;">
            <input type="text" v-model.number="GBLocalServer.media_forward_port_max">
          </div>
        </li>
        <li>
          <div class="title">本地鉴权是否打开</div>
          <div class="input">
            <select v-model.number="GBLocalServer.auth_enable" disabled>
              <option value="1">打开</option>
              <option value="0">关闭</option>
            </select>
          </div>
        </li>
      </ul>
      <div class="click-btn"><button @click="setConfig" class="btn">保存</button></div>
    </div>
    <div class="col">
      <div><title-pag :title="'GB28181级联平台设置'"></title-pag></div>
      <ul class="gb-rt">
        <li>
          <div class="title">级联平台SIP服务器ID</div>
          <div class="input"><input type="text" v-model="GBRemoteServer.id"></div>
        </li>
        <li>
          <div class="title">级联平台SIP域名</div>
          <div class="input"><input type="text" v-model="GBRemoteServer.realm"></div>
        </li>
        <li>
          <div class="title">级联平台SIP服务器IP</div>
          <div class="input"><input type="text" v-model="GBRemoteServer.address"></div>
        </li>
        <li>
          <div class="title">级联平台SIP服务器端口</div>
          <div class="input"><input type="text" v-model.number="GBRemoteServer.port"></div>
        </li>
        <li>
          <div class="title">级联平台SIP用户名</div>
          <div class="input"><input type="text" v-model="GBRemoteServer.user"></div>
        </li>
        <li>
          <div class="title">级联平台SIP密码</div>
          <div class="input"><input type="password" v-model="GBRemoteServer.passwd"></div>
        </li>
        <li>
          <div class="title">级联平台SIP心跳超时时间</div>
          <div class="input"><input type="text" v-model.number="GBRemoteServer.heartbeat"></div>
        </li>
        <li>
          <div class="title">级联平台SIP心跳超时次数</div>
          <div class="input"><input type="text" v-model.number="GBRemoteServer.heartbeat_num"></div>
        </li>
        <li>
          <div class="title">注册到上级平台有效时间</div>
          <div class="input"><input type="text" v-model.number="GBRemoteServer.expire"></div>
        </li>
        <li>
          <div class="title">级联平台SIP是否国标服务</div>
          <div class="input">
            <select v-model.number="GBRemoteServer.enable">
              <option value="1">打开</option>
              <option value="0">关闭</option>
            </select>
          </div>
        </li>
      </ul>
      <div class="click-btn"><button @click="setConfig" class="btn">保存</button></div>
    </div>
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
.config-box {
  display: flex;
  justify-content: space-between;
  flex-wrap:wrap;
}
.col {
  width: 750px;
  height: 668px;
  box-sizing: border-box;
	background-color: #1f3147;
  border-radius: 4px;
  padding: 20px;
  position: relative;
}
.gb-lf, .gb-rt {
  padding-top: 25px;
}
.gb-lf li, .gb-rt li {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 12px;
}
.title {
	width: 165px;
	font-size: 14px;
  color: #afafaf;
  text-align: right;
  margin-right: 20px;
}
.input {
  width: 499px;
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
select:disabled {  
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
</style>