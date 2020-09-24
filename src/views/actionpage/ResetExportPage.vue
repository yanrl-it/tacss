<template>
<div>
  <div class="handel-code">
    <div class="title">{{title}}</div>
    <code-table :tableHeight="'height:456px;'" :tableData="receivers" :dataList="dataList"></code-table>
    <!-- <div v-for="(item, i) in receivers" :key="i">{{item.name}} -- {{item.id}} -- {{item.status}}</div> -->
    <div class="click-bt">
      <button :disabled="!connected" @click="back" class="btn btn-off">关闭</button>
    </div>
  </div>
  <div class="hint-box" v-show="isShow">
    <div class="hint-cont">
      <div class="title">请确认是否{{title}}？</div>
      <div class="click-btn">
        <button :disabled="connected" @click="affirm" class="btn">确认</button>
        <button @click="back" class="btn btn-off">取消</button>
      </div>
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
      dest: '',
      receivers: [],
      connected: false,

      isShow: true,
      title: '',
      msg: '',
      dataList: [
        {'type': '', 'prop': 'name', 'label': '编码器名称', 'width': '222'},
        {'type': '', 'prop': 'id', 'label': '编码器IP', 'width': '298'},
        {'type': '', 'prop': 'status', 'label': '操作状态', 'width': '240', 'ope': 1},
      ],
      encoders: [],
      codeData: []
    }
  },
  created() { 
    this.title = this.$route.query.title;
    this.msg = this.$route.query.msg;
    for (var i of this.$route.query.selected) {
      this.encoders.push(i.mac)
    }
  },
  methods: {
    back() {
      this.cancel()
      this.$router.go(-1);
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
      if (this.dest == '/user/topic/export') { // export
        this.axios
          .post('/encoderconfig/export', {
            "encoders": this.encoders
          })
          .then(res => {
            if (res.data.code == 400){
              this.$message({
                showClose: true,
                message: res.data.error,
                type: 'error'
              })
            }
            location.href = `/api/encoderconfig/download_export/${res.data.data}`
          })
      } else if (this.dest == '/user/topic/reset') { // reset
        this.axios
          .post('/encoderconfig/reset', {
            "encoders": this.encoders
          })
          .then(res => {
            if (res.data.code == 400){
              this.$message({
                showClose: true,
                message: res.data.error,
                type: 'error'
              })
            }
          })
      } else if (this.dest == '/user/topic/reboot') { // reboot
        this.axios
          .post('/encoderconfig/reboot', {
            "encoders": this.encoders
          })
          .then(res => {
            if (res.data.code == 400){
              this.$message({
                showClose: true,
                message: res.data.error,
                type: 'error'
              })
            }
          })
      }
      // var data =[]
      client.subscribe(this.dest, frame =>{
        // this.receivers.unshift(JSON.parse(frame.body))
        // this.receivers.unshift({body: frame.body, id: this.index++})
        // this.receivers.unshift(JSON.parse(frame.body))
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
    },
    affirm() {
      this.isShow = false;
      if (this.title == '批量导出配置') {
        this.dest = '/user/topic/export'
        this.$message({
          showClose: true,
          message: '导出中，请等候！',
          type: 'success'
        })
      } else if (this.title == '批量恢复出厂设置') {
        this.dest = '/user/topic/reset'
        this.$message({
          showClose: true,
          message: '恢复中，请等候！',
          type: 'success'
        })
      } else if (this.title == '批量重启') {
        this.dest = '/user/topic/reboot'
        this.$message({
          showClose: true,
          message: '重启中，请等候！',
          type: 'success'
        })
      }
      this.connectWebsocket()
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
  height: 667px;
  margin: 117px auto;
  box-sizing: border-box;
  position: relative;
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
.btn:active {
	opacity: 0.8;
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
.click-btn {
  display: flex;
  justify-content: space-between;
  padding: 0 120px;
  padding-top: 65px;
}
.click-bt {
  position: absolute;
  bottom: 30px;
  text-align: center;
  width: 788px;
}
.hint-box {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #182633;
  z-index: 999;
}
.hint-cont {
	width: 524px;
	height: 320px;
	background-color: #1f3147;
	border-radius: 4px;
  margin: 0 auto;
  margin-top: 250px;
  padding-top: 112px;
  box-sizing: border-box;
}
</style>