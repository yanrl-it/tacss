<template>
  <div class="eqinsetting-box">
    <div v-show="!isShow">
      <div class="row">
        <div><title-pag :title="'添加网络输入'"></title-pag></div>
        <div class="pad-top">
          <ul class="network-layout">
            <li>
              <div><span class="add-title">频道名称</span></div>
              <div><input v-model="addChannel.name" class="add-input" type="text"></div>
            </li>
            <li>
              <div><span class="add-title">URL</span></div>
              <div><input v-model="addChannel.path" class="add-input" style="width: 653px;" type="text"></div>
            </li>
            <li>
              <div><span class="add-title">Onvif</span></div>
              <div><input v-model="addChannel.onvif" class="add-input" type="text"></div>
            </li>
            <li>
              <div><span class="add-title">TCP</span></div>
              <div style="padding:3px 10px;">
                <el-switch
                  v-model.number="addChannel.using_tcp"
                  :width="64"
                  :height="26"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="TCP"
                  inactive-text="UDP">
                </el-switch>
              </div>
            </li>
            <li style="padding-top:27px;"><button @click="channelAdd" style="background-color: #2078cf;" class="btn">添加</button></li>
            <li style="padding-top:27px;"><button @click="getInfo" class="btn">获取</button></li>
          </ul>
        </div>
      </div>
      <div class="row" style="margin-top: 20px;height: 501px;">
        <div>
           <title-pag :title="'网络输入'"></title-pag>
        </div>
        <div class="pad-top" style="height: 380px;">
          <ul class="network-layout">
            <li style="width:236px;"><div><span class="add-title">频道名称</span></div></li>
            <li style="width:653px;"><div><span class="add-title">URL</span></div></li>
            <li style="width:236px;"><div><span class="add-title">Onvif</span></div></li>
            <li><div style="width: 84px;"><span class="add-title">TCP</span></div></li>
            <li></li>
          </ul>
          <ul class="network-layout net-list" v-for="(item, i) in OnvifChannel" :key="i">
            <li><input class="add-input" type="text" v-model="item.name"></li>
            <li><input style="width: 653px;" class="add-input" type="text" v-model="item.path"></li>
            <li><input class="add-input" type="text" v-model="item.onvif"></li>
            <li><div style="padding:3px 10px;">
                <el-switch
                  v-model.number="item.using_tcp"
                  :width="64"
                  :height="26"
                  :active-value="1"
                  :inactive-value="0"
                  active-text="TCP"
                  inactive-text="UDP">
                </el-switch>
            </div></li>
            <li class="checked" style="padding-left: 30px;">
              <el-checkbox @change="handleCheckedCitiesChange(i)" v-model="sk[i]"></el-checkbox>
            </li>
          </ul>
        </div>
        <div class="btn-group">
          <div style="padding-left: 558px;"><button class="btn" @click="setConfig">保存</button></div>
          <div style="padding-left: 538px;"><button @click="handleDel" class="btn" style="background-color: #e75050;">删除</button></div> 
        </div>
      </div>
    </div>
    <div v-show="isShow" class="get-info-box">
      <div class="get-info">
        <ul>
          <li><div class="get-title">获取频道信息</div></li>
          <li>
            <ul class="get-form" style="padding: 34px 0;">
              <li>
                <div class="get-form-title">摄像头IP</div>
                <div><input class="get-input" type="text" v-model="camera.ip"></div>
              </li>
              <li>
                <div class="get-form-title">用户名</div>
                <div><input class="get-input" type="text" v-model="camera.name"></div>
              </li>
              <li>
                <div class="get-form-title">密码</div>
                <div><input class="get-input" type="password" v-model="camera.pwd"></div>
              </li>
            </ul>
          </li>
          <li class="btn-group">
            <div><button @click="addCoder" class="btn">确认</button></div>
            <div style="padding-left: 84px;"><button @click="back" class="btn" style="background-color: #5d5d5d;">取消</button></div>
          </li>
        </ul>
      </div>
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
      addChannel: {
        name: '',
        path: '',
        onvif: null,
        using_tcp: 1
      },
      camera: {
        ip: '',
        name: '',
        pwd: ''
      },
      mac: '',
      isShow: false,
      value: '1',
      del:[],
      DeviceInfo: {},
      OnvifChannel: [],
      OnvifServer: {},
      Setting: {},
      sk: [false,false,false,false,false,false,false,false]
    }
  },
  created() {
    this.mac = this.$route.query.mac;
    this.configLoad();
  },
  methods: {
    handleCheckedCitiesChange(val) {
      if (this.del.indexOf(val) == '-1') {
        this.del.push(val)
      } else {
        for (let i in this.del) {
          if (this.del[i] == val) this.del.splice(i, 1)
        }
      }
    },
    handleDel() {
      for (let i of this.del) {
        this.OnvifChannel.splice(i, 1)
        // console.log(i)
        // console.log(this.OnvifChannel)
      }
      this.del = []
      this.sk = [false,false,false,false,false,false,false,false]
    },
    getInfo() {
      this.isShow = !this.isShow;
    },
    configLoad() {
      this.axios.post(`/encoderconfig/read/conf.json/${this.mac}`, {})
        .then(res => {
          if (res.status != '200') return
          this.DeviceInfo = res.data.DeviceInfo
          this.OnvifChannel = res.data.OnvifChannel
          this.OnvifServer = res.data.OnvifServer
          this.Setting = res.data.Setting
          // console.log(res)
        })
    },
    setConfig() {
      // console.log(this.OnvifChannel)
      this.axios
        .post(`/encoderconfig/write/conf.json/${this.mac}`, {
          "DeviceInfo": this.DeviceInfo,
          "OnvifChannel": this.OnvifChannel,
          "OnvifServer": this.OnvifServer,
          "Setting": this.Setting
        })
        .then(res => {
          // console.log(res)
           if (res.data.code == 0) {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            })
          }
        })
    },
    addCoder() {
      this.axios
      .post(`/encoderconfig/read/onvif.ask/${this.mac}`, {
        'Ip': this.camera.ip,
        'User': this.camera.name,
        'Passwd': this.camera.pwd
      })
      .then(res => {
        this.addChannel.path = res.data.Path;
        this.isShow = !this.isShow;
      })
    },
    channelAdd() { //添加通道
      if (this.OnvifChannel.length < 8) {
        this.OnvifChannel.push(this.addChannel)
        this.addChannel.name = ''
        this.addChannel.path = ''
      }
    },
    back() {
      this.isShow = !this.isShow;
    }
  }
}
</script>

<style scoped>
.pad-top {
  padding-top: 30px;
}
.row {
	width: 1520px;
	background-color: #1f3147;
  border-radius: 4px;
  padding: 20px;
  box-sizing: border-box;
}
.network-layout {
  display: flex;
}
.network-layout li {
  padding-right: 20px;
}
.add-title {
  font-size: 14px;
  color: #afafaf;
  display: block;
  text-align: center;
  margin-bottom: 10px;
}
.add-input, .get-input {
  width: 236px;
  height: 32px;
  box-sizing: border-box;
	background-color: #182633;
	border-radius: 2px;
  border: solid 1px rgba(255, 255, 255, 0.07);
  font-size: 14px;
  padding-left: 9px;
	color: #ffffff;
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
.net-list {
  padding-bottom: 10px;
}
.checked, .btn-group {
  display: flex;
  align-items: center;
}
.btn-group {
  justify-content: center;
}
.get-info-box {
  position: fixed;
  background-color: #182633;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
}
.get-info {
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
	width: 524px;
	height: 320px;
	background-color: #1f3147;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 30px;
}
.get-title {
	font-size: 16px;
  color: #ffffff;
  text-align: center;
}
.get-form li {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
}
.get-form-title {
  width: 55px;
  text-align: right;
	padding-right: 20px;
	font-size: 14px;
	color: #afafaf;
}
.get-input {
  width: 280px;
}
</style>