<template>
  <div class="status-box">
    <div>
      <ul class="status-row-top">
        <li class="top-col">
          <div>
            <title-pag :title="'编码器状态'"></title-pag>
          </div>
          <div style="padding-top: 20px;">
            <ul class="code-status-list">
              <li>
                <div style="height: 120px;width: 120px;">
                  <circle-progress
                    :id="5"
                    barColor="#1a99f1"
                    backgroundColor="#2f4157"
                    :width="120"
                    :radius="10"
                    :progress="cpuStatus"
                    :isAnimation="false"></circle-progress>
                </div>
                <div class="serverStatus-item-title">CPU状态</div>
              </li>
              <li>
                <div style="height: 120px;width: 120px;">
                  <circle-progress
                    :id="6"
                    barColor="#30ab6f"
                    backgroundColor="#2f4157"
                    :width="120"
                    :radius="10"
                    :progress="memoryStatus"
                    :isAnimation="false"></circle-progress>
                </div>
                <div class="serverStatus-item-title">内存状态</div>
              </li>
              <li>
                <div style="height: 120px;width: 120px;">
                  <circle-progress
                    :id="7"
                    barColor="#1a99f1"
                    backgroundColor="#2f4157"
                    :width="120"
                    :radius="10"
                    :progress="temperature"
                    :isAnimation="false"></circle-progress>
                </div>
                <div class="serverStatus-item-title">编码器温度</div>
              </li>
            </ul>
          </div>
        </li>
        <li style="width: 856px;" class="top-col">
          <div>
            <title-pag :title="'实时流量'"></title-pag>
          </div>
          <div style="padding: 20px 0 0 50px;">
            <line-chart :flowData="{upFlowData,downFlowData}" :widthHeight="{width: '700px', height: '125px'}"></line-chart>
          </div>
          <div class="flow">
            <div><i></i><span>上行流量</span></div>
            <div style="padding-left: 50px;"><i style="backgroundColor: #edb12f;"></i><span>下行流量</span></div>
          </div>
        </li>
      </ul>
    </div>
    <div style="padding-top: 20px;">
      <div class="access-status">
        <div>
          <title-pag :title="'通道状态'"></title-pag>
        </div>
        <div style="padding-top: 20px;">
          <el-table
            :data="codeData" 
            tooltip-effect="dark" 
            stripe>
            <el-table-column prop="configs.chanCode" label="通道编码" width="140"></el-table-column>
            <el-table-column prop="configs.outputAddr" label="播放地址" width="314">
              <template slot-scope="scope">
                <input disabled type="text" v-model="scope.row.configs.outputAddr">
              </template>
            </el-table-column>
            <el-table-column prop="configs.inputAddr" label="源地址" width="314">
              <template slot-scope="scope">
                <input disabled type="text" v-model="scope.row.configs.inputAddr">
              </template>
            </el-table-column>
            <el-table-column prop="configs.upFlow" label="上行流量(Kbps)" width="176"></el-table-column>
            <el-table-column prop="configs.downFlow" label="下行流量(Kbps)" width="176"></el-table-column>
            <el-table-column prop="configs.onlineNum" label="在线点播数" width="142">
              <template slot-scope="scope">{{scope.row.configs.onlineNum==-1?'离线':scope.row.configs.onlineNum}}</template>
            </el-table-column>
            <el-table-column prop="configs.chanCreateTime" label="通道创建时间" width="218"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <footer-content></footer-content>
  </div>
</template>

<script>
import TitlePag from '@/components/TitlePag'
import CircleProgress from '@/components/CircleProgress'
import LineChart from '@/components/LineChart'
import FooterContent from '@/components/Footer'

export default {
  components: {
    TitlePag,
    CircleProgress,
    LineChart,
    FooterContent
  },
  data() {
    return {
      mac: '',
      cpuStatus: 0,
      memoryStatus: 0,
      temperature: 0,
      versionNumber: '1.0.0 build 20190428_4913',
      upFlowData: [0, 0, 0, 0, 0, 0, 0],
      downFlowData: [0, 0, 0, 0, 0, 0, 0],
      inter: '',
      codeData: []
    }
  },
  created() {
    this.mac = this.$route.query.mac;
      // this.axios.get(`/encoderconfig/conf/${this.mac}`)
      //   .then(res => {
      //     console.log(res.data)
      //   })
    this.load()
    this.interval()
  },
  methods: {
    load() {
      this.axios
        .get(`/encoder/detail/${this.mac}`)
        .then(res => {
          let obj = res.data.data;
          this.cpuStatus = Math.round(obj.statistics.cpu * 100);
          this.memoryStatus = Math.round(obj.statistics.memory * 100);
          this.temperature = parseInt(obj.statistics.temperature);
          this.upFlowData.shift() 
          this.upFlowData.push(parseInt(obj.statistics.upFlow))
          this.downFlowData.shift() 
          this.downFlowData.push(parseInt(obj.statistics.downFlow))
          // console.log(2, res)
        })
      this.axios
        .get(`/encoder/units/${this.mac}`)
        .then(res => {
          // console.log(res.data.data)
          this.codeData = res.data.data;
        })
    },
    interval() {
      this.inter = setInterval(this.load, 20000);
    }
  },
  destroyed() {
    clearInterval(this.inter)
  }
}
</script>

<style scoped>
.status-row-top {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
}
.top-col {
	width: 644px;
	height: 225px;
	background-color: #1f3147;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 20px;
}
.code-status-list {
display: flex;
justify-content: center;
}
.code-status-list li {
  padding: 0 30px;
}
.serverStatus-item-title {
  padding-top: 14px;
  text-align: center;
}
.access-status {
	width: 1520px;
	height: 422px;
	background-color: #1f3147;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 20px;
}
.flow {
  padding-top: 5px;
}
.flow, .flow div{
  display: flex;
  align-items: center;
  justify-content: center;
}
.flow div i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #28d2be;
}
.flow div span {
  padding-left: 15px;
  font-size: 14px;
}
.el-table {
  background-color: transparent;
  color: #ffffff;
}
.el-table::before {
  height: 0;
}
input {
  width: 100%;
  box-sizing: border-box;
	background-color: transparent;
  border: 0;
  font-size: 14px;
  padding: 0 9px;
	color: #ffffff;
}
</style>