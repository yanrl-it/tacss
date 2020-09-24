<template>
  <div class="system-box">
    <ul class="box-row">
      <li class="box-col">
        <title-pag :title="'网络设置'"></title-pag>
        <ul class="info">
          <li>
            <span class="info-title">IPv4地址</span>
            <input v-model="net.ipv4" class="info-input" type="text">
          </li>
          <li>
            <span class="info-title">子网掩码</span>
            <input v-model="net.mask" class="info-input" type="text">
          </li>
          <li>
            <span class="info-title">默认网关</span>
            <input v-model="net.gateway" class="info-input"  type="text">
          </li>
        </ul>
        <ul class="btn-group">
          <li><button @click="test" class="btn btn-lf" >测试</button></li>
          <li><button @click="netSave" class="btn">保存</button></li>
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
          <li><button @click="handlePwd" class="btn">保存</button></li>
        </ul>
      </li>
      <li class="box-col" style="height: 197px;">
        <title-pag :title="'系统升级'"></title-pag>
        <ul class="file-box">
          <li class="file-des des-width">文件路径</li>
          <li><span class="file-path">{{filePath.path}}</span></li>
          <li class="rt-width"><input type="file" class="file" @change="handelFile($event)"><button class="file-btn">选择升级文件</button></li>
        </ul>
        <ul class="upgrade-pro">
          <li class="file-des des-width">升级进度</li>
          <li><p class="pro"></p></li>
          <li class="rt-width">升级成功后，系统自动重启。</li>
        </ul>
      </li>
      <li class="box-col">
        <title-pag :title="'版本信息'"></title-pag>
        <div style="padding-top: 30px;"><span class="info-title">应用版本</span></div>
        <div style="padding-bottom: 30px;"><input type="text" disabled class="version" v-model="versionNumber"/></div>
      </li>
    </ul>
    <footer-content></footer-content>
  </div>
</template>

<script>
import TitlePag from '../components/TitlePag'
import FooterContent from '../components/Footer'

export default {
  components: {
    TitlePag,
    FooterContent
  },
  data() {
    return {
      net: {
        ipv4: '',
        mask: '',
        gateway: ''
      },
      password: {
        oldPwd: '',
        newPwd: '',
        conPwd: ''
      },
      versionNumber: '',
       filePath: {
        path: '',
        file: ''
      },
      name: ''
    }
  },
  created() {
    this.netLoad()
    // this.axios.get('/system/info').then(res => {console.log(res)})
  },
  methods: {
    netLoad() {
      this.axios
        .get('/system/list_net_interface')
        .then(res => {
          // console.log(res)
          this.name = res.data.data[0]
          this.axios
            .get(`/system/get_net_interface_config?name=${this.name}`)
            .then(res => {
              this.axios
                .get('/system/version')
                .then(res => {
                  this.versionNumber = res.data.data
                })
              if (res.data.code == 0) {
                // console.log(res)
                this.net.ipv4 = res.data.data.ip
                this.net.gateway = res.data.data.gateway
                this.net.mask = res.data.data.mask
              }
            })
        })
    },
    test() { //网络测试
      // this.axios
      //   .post('', {})
      //   .then(res => {

      //   })
    },
    netSave() { //网络设置保存
      this.axios
        .post('/system/ifconfig', {
          "gateway": this.net.gateway,
          "ip": this.net.ipv4,
          "mask": this.net.mask,
          "name": this.name
        })
        .then(res => {
          if (!res.data) {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            })
          }
        })
    },
    handlePwd() {
      if (this.password.oldPwd && this.password.newPwd && this.password.conPwd){
        if (this.password.newPwd == this.password.conPwd) {
          this.axios
            .post('/profile/change_password', {
              "oldPassword": this.password.oldPwd,
              "password": this.password.newPwd
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
              }
            })
        } else {
          this.$message({
            showClose: true,
            message: '确认密码不正确！',
            type: 'error'
          })
        } 
      } else {
        this.$message({
          showClose: true,
          message: '密码不能为空！',
          type: 'error'
        })
      }
    },
    handelFile(e) {
      this.filePath.path = e.target.value;
      this.filePath.file = e.target.files[0];
      this.axios
        .post('/system/update_server', this.filePath.file)
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: '提交成功',
              type: 'success'
            })
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
.btn-group {
  display: flex;
  justify-content: center;
  padding-top: 20px;
}
.btn-group li, .upgrade-pro li {
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
	width: 214px;
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
.file-box, .upgrade-pro {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 29px;
}
.file-box li {
  padding: 0 10px;
}
.file-path {
  display: block;
	width: 342px;
  height: 32px;
  box-sizing: border-box;
  line-height: 32px;
  padding-left: 10px;
	background-color: #182633;
	border-radius: 2px;
  border: solid 1px rgba(255, 255, 255, 0.07);
  color: #ffffff;
  font-size: 14px;
}
.file {
  position: absolute;
  width: 126px;
  height: 32px;
  opacity: 0;
  cursor: pointer;
  font-size: 0;
}
.file-btn {
	width: 126px;
	height: 32px;
	background-color: #2078cf;
  border-radius: 2px;
  color: #ffffff;
  border: 0;
}
.file-des {
  font-size: 14px;
  text-align: right;
}
.pro {
	width: 342px;
	height: 10px;
	background-color: #3c5b77;
	border-radius: 5px;
}
.des-width {
  width: 100px;
}
.rt-width {
  width: 180px;
}
</style>