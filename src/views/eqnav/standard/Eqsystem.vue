<template>
  <div class="system-box">
    <ul class="box-row">
      <li class="box-col">
        <title-pag :title="'网络设置'"></title-pag>
        <ul class="info">
          <li>
            <span class="info-title">网络接口</span>
            <select style="width:130px;" v-model="lan">
              <option value="0">LAN1</option>
              <option value="1">LAN2</option>
            </select>
          </li>
          <li>
            <span class="info-title">IPv4地址</span>
            <input v-if="lan==0" v-model="net.cpu_ip" class="info-input" type="text">
            <input v-if="lan==1" v-model="net.mcu_ip" class="info-input" type="text">
          </li>
          <li>
            <span class="info-title">子网掩码</span>
            <input v-if="lan==0" v-model="net.cpu_mask" class="info-input" type="text">
            <input v-if="lan==1" v-model="net.mcu_mask" class="info-input" type="text">
          </li>
          <li>
            <span class="info-title">默认网关</span>
            <input v-if="lan==0" v-model="net.cpu_gateway" class="info-input" type="text">
            <input v-if="lan==1" v-model="net.mcu_gateway" class="info-input" type="text">
          </li>
        </ul>
        <ul class="btn-group">
          <li><button class="btn btn-lf">测试</button></li>
          <li><button @click="setNet" class="btn">保存</button></li>
        </ul>
      </li>
      <li class="box-col">
        <title-pag :title="'密码设置'"></title-pag>
        <ul class="info">
          <li>
            <span class="info-title">原密码</span>
            <input v-model="password.oldPwd" class="info-input" type="password">
          </li>
          <li>
            <span class="info-title">新密码</span>
            <input v-model="password.newPwd" class="info-input" type="password">
          </li>
          <li>
            <span class="info-title">确认密码</span>
            <input v-model="password.conPwd" class="info-input" type="password">
          </li>
        </ul>
        <ul class="btn-group">
          <li><button @click="setPwd" class="btn">保存</button></li>
        </ul>
      </li>
      <li class="box-col" style="height: 197px;">
        <title-pag :title="'时间设置'"></title-pag>
        <ul class="time-set">
          <li style="font-size: 14; color: #afafaf;">时间设置</li>
          <li><input v-model="currTime" class="info-input" style="width: 228px;" type="text"></li>
          <li><button @click="getTime" class="btn time-syn">与服务器时间同步</button></li>
        </ul>
        <div class="btn-group"><button class="btn">保存</button></div>
      </li>
      <li class="box-col" style="height: 197px;">
        <title-pag :title="'版本信息'"></title-pag>
        <ul class="syetemNumber">
          <li>
            <div class="system-title">应用版本</div>
            <input class="version" disabled v-model="net.app_version" type="text">
          </li>
        </ul>
      </li>
    </ul>
    <footer-content></footer-content>
  </div>
</template>

<script>
import TitlePag from '@/components/TitlePag'
import FooterContent from '@/components/Footer'

export default {
  components: {
    TitlePag,
    FooterContent
  },
  data() {
    return {
      lan:0,
      net: {},
      DeviceInfo: {},
      OnvifChannel: [],
      OnvifServer: {},
      Setting: {},
      mac: '',
      password: {
        oldPwd: '',
        newPwd: '',
        conPwd: ''
      },
      currTime: ''
    }
  },
  created() {
    this.mac = this.$route.query.mac;
    this.configLoad()
  },
  methods: {
    configLoad() {
      this.axios
        .post(`/encoderconfig/read/net.json/${this.mac}`, {})
        .then(res => {
          this.net = res.data
          // console.log(res)
        })
    },
    setNet() {
      this.axios.post(`/encoderconfig/write/net.json/${this.mac}`,this.net)
        .then(res => {
          console.log(res.data.code)
           if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
          }
        })
    },
    getTime() {
      this.currTime = this.$getTime();
    },
    setPwd() {
      if (this.password.newPwd != this.password.conPwd) {
        this.$message({
          showClose: true,
          message: '确认密码不正确！',
          type: 'error'
        });
        return;
      }
      this.axios
        .post(`/encoderconfig/pass.json/${this.mac}`, {
          "id": this.mac,
          "oldPassword": this.password.oldPwd,
          "newPassword": this.password.newPwd
        })
        .then(res => {
          if (res.data.error == '密码错误') {
            this.$message({
              showClose: true,
              message: '原密码不正确！',
              type: 'error'
            })
          } else {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
            this.password.oldPwd = ''
            this.password.newPwd = ''
            this.password.conPwd = ''
          }
      })
    }
  }
}
</script>

<style scoped>
.box-row {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  /* flex-direction: row; */
  flex-wrap: wrap;
}
.box-col {
  width: 750px;
  box-sizing: border-box;
	background-color: #1f3147;
  border-radius: 4px;
  padding: 30px;
  margin-bottom: 20px;
}
.info {
  display: flex;
  justify-content: center;
  padding-top: 29px;
}
.info li {
  padding: 0 10px;
}
.info-title {
	font-size: 14px;
  color: #afafaf;
  display: block;
  text-align: center;
  margin-bottom: 10px;
}
.info-input {
	width: 142px;
  height: 32px;
  box-sizing: border-box;
	background-color: #182633;
	border-radius: 2px;
  border: solid 1px rgba(255, 255, 255, 0.07);
  font-size: 14px;
  padding-left: 9px;
	color: #ffffff;
}
.btn-group, .time-set {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
}
.btn-group li, .upgrade-pro li, .time-set li {
  padding: 0 10px;
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
.btn-lf {
  background-color: #2078cf;
}
.btn:active {
  opacity:0.8;
}
.version {
  box-sizing: border-box;
  display: block;
	width: 340px;
  height: 32px;
  line-height: 32px;
  padding-left: 10px;
  margin: 0 auto;
  font-size: 14px;
  color: #ffffff;
	background-color: #3c4b5e;
	border-radius: 2px;
	border: solid 1px rgba(255, 255, 255, 0.07);
}
.time-syn {
	width: 158px;
	height: 32px;
	background-color: #2078cf;
	border-radius: 2px;
}
.syetemNumber {
  padding-top: 30px;
  display: flex;
  justify-content: center;
}
.system-title {
  text-align: center;
  font-size: 14px;
  padding-bottom: 10px;
  color: #afafaf;
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