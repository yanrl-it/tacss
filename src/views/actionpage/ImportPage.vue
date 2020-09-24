<template>
<div>
  <div class="handel-code">
    <div class="title">{{title}}</div>
    <div style="margin-bottom: 30px;">
      <ul class="file-box">
        <li style="color:  #afafaf;">文件路径</li>
        <li class="file-path">{{filePath.path}}</li>
        <li><input type="file" class="file" @change="handelFile($event)"><button class="btn">浏览</button></li>
        <li><button :disabled="connected" class="btn btn-rt" @click="fileSub">配置导入</button></li>
      </ul>
    </div>
    <code-table :tableHeight="'height:456px;'" :tableData="receivers" :dataList="dataList"></code-table>
    <div style="text-align: center;margin-top: 20px;">
      <button @click="back" class="btn" style="background-color: #5d5d5d;">关闭</button>
    </div>
  </div>
  
</div>
</template>

<script>
import CodeTable from '@/components/CodeTable'
let client
const Stomp = require('@stomp/stompjs')

export default {
  components: {
    CodeTable
  },
  data() {
    return {
      filePath: {
        path: '',
        file: ''
      },
      title: '',
      msg: '',
      dataList: [
        {'type': '', 'prop': 'name', 'label': '编码器名称', 'width': '222'},
        {'type': '', 'prop': 'id', 'label': 'IP', 'width': '298'},
        {'type': '', 'prop': 'status', 'label': '操作状态', 'width': '240'},
      ],
      codeData: [],
      webSocket: null,

      dest: '/user/topic/import',
      receivers: [],
      connected: false,
    }
  },
  created() {
    this.title = this.$route.query.title;
    this.msg = this.$route.query.msg;
  },
  methods: {
    back() {
      this.cancel();
      this.$router.go(-1);
    },
    handelFile(e) {
      this.filePath.path = e.target.value;
      this.filePath.file = e.target.files[0];
    },
    fileSub() {
      if (!this.filePath.file) return;
      this.connectWebsocket()
      this.connected = true
      this.$message({
        showClose: true,
        message: '导入中，请等候！',
        type: 'success'
      })
    },
    cancel() {
      if (client) {
        client.disconnect()
        client = null
        this.connected = false
      }
    },
    connectWebsocket() {
      this.cancel()
      this.connected = false
      client = Stomp.Stomp.client(`ws://${window.location.host}/ws/websocket`)
      client.connect('', '', this.afterConnected)
    },
    subscribeValues() {
      this.axios
        .post('/encoderconfig/import', this.filePath.file)
        .then(res => {
          if (res.data.code == 400) {
            this.cancel()
            this.$message({
              showClose: true,
              message: res.data.error,
              type: 'error'
            })
          }
          this.filePath.path = '';
          this.filePath.file = '';
        })
      client.subscribe(this.dest, frame =>{
        for (let item of this.receivers) {
          if (item.id == JSON.parse(frame.body).id) {
            item.status = JSON.parse(frame.body).status
            return
          }
        }
        this.receivers.push(JSON.parse(frame.body))
      })
    },
    afterConnected() {
      this.connected = true
      this.subscribeValues()
    }
  },
  destroyed() {
    this.cancel()
  }
}
</script>

<style scoped>
.handel-code {
  width: 848px;
  height: 683px;
  margin: 117px auto;
  box-sizing: border-box;
  padding: 30px;
  background-color: #1f3147;
  border-radius: 4px;
}
.title {
  text-align: center;
	font-size: 16px;
  color: #ffffff;
  padding-bottom: 30px;
}
.file-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn-rt {
  width: 100px;
	background-color: #0fb79c;
}
.file-path {
	width: 473px;
  height: 32px;
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
  width: 90px;
  height: 32px;
  opacity: 0;
  cursor: pointer;
  font-size: 0;
}
.msg-box {
	width: 524px;
	height: 320px;
	background-color: #1f3147;
  border-radius: 4px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.msg-title {
  margin-top: 112px;
	font-size: 16px;
	color: #ffffff;
}
.btn {
	width: 90px;
	height: 32px;
	background-color: #0fb79c;
  border-radius: 2px;
	font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  border: 0;
}
.btn-off {
  background-color: #5d5d5d;
}
.btn-group {
  padding-top: 121px;
}
.btn-group ul {
  display: flex;
  justify-content: center;
}
.btn:active {
  opacity:0.8;
}
</style>