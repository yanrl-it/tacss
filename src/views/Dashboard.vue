<template>
  <div class="dashboard-box">
    <el-row :gutter="20">
      <el-col :span="11">
        <ul class="dashboard-item">
          <li><title-pag :title="'集成状态'"></title-pag></li>
          <li class="item-content">
            <ul class="item-content-box">
              <li>
                <div style="height: 178px;width: 178px;">
                  <circle-progress
                    :id="1"
                    barColor="#2fd6bb"
                    backgroundColor="#2f4157"
                    :width="178"
                    :height="178"
                    :radius="14"
                    :progress="onlinePercent"
                    :isAnimation="false"></circle-progress>
                </div>
              </li>
              <li class="encode-des">
                <ul>
                  <li><span>编码器数量：</span>{{encoderCount}}</li>
                  <li><span>在线编码器数量：</span>{{onlineCount}}</li>
                  <li><span>编码器在线率：</span>{{onlinePercent}}%</li>
                  <li><span>编码器上行流量：</span>{{upFlowData[upFlowData.length-1]}} Mbps</li>
                  <li><span>编码器下行流量：</span>{{downFlowData[downFlowData.length-1]}} Mbps</li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="code-status">
            <div><i></i><span>在线</span></div>
            <div><i style="backgroundColor:#5d5d5d;"></i><span>下线</span></div>
          </li>
        </ul>
      </el-col>
      <el-col :span="13"><div class="">
        <ul class="dashboard-item">
          <li><title-pag :title="'实时流量'"></title-pag></li>
          <li style="padding: 30px 0 0 20px;">
            <line-chart :flowData="{upFlowData,downFlowData}" :widthHeight="{width: '700px', height: '210px'}"></line-chart>
          </li>
          <li class="flow">
            <div><i></i><span>上行流量</span></div>
            <div style="padding-left: 50px;"><i style="backgroundColor: #edb12f;"></i><span>下行流量</span></div>
          </li>
        </ul>
        </div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <ul class="serverStatus">
          <li><title-pag :title="'服务器状态'"></title-pag></li>
          <li>
            <ul class="serverStatus-list">
              <li>
                <div style="height: 178px;width: 178px;padding-top: 35px;">
                  <circle-progress
                    :id="2"
                    barColor="#1f7fd7"
                    backgroundColor="#2f4157"
                    :width="178"
                    :radius="14"
                    :progress="cpuUsedPercent"
                    :isAnimation="false"></circle-progress>
                </div>
                <div class="serverStatus-item-title">CPU状态</div>
              </li>
              <li>
                <div style="height: 178px;width: 178px;padding-top: 35px;">
                  <circle-progress
                    :id="3"
                    barColor="#218240"
                    backgroundColor="#2f4157"
                    :width="178"
                    :radius="14"
                    :progress="memoryUsedPercent"
                    :isAnimation="false"></circle-progress>
                </div>
                <div class="serverStatus-item-title">内存状态</div>
              </li>
              <li>
                <div style="height: 212px;width: 160px;">
                  <temperature :val="temperature"></temperature>
                </div>
                <div class="serverStatus-item-title">服务器温度</div>
              </li>
            </ul>
          </li>
        </ul>
      </el-col>
    </el-row>
    <footer-content></footer-content>
  </div>
</template>

<script>
import CircleProgress from '@/components/CircleProgress'
import TitlePag from '@/components/TitlePag'
import LineChart from '@/components/LineChart'
import Temperature from '@/components/Temperature'
import FooterContent from '@/components/Footer'

export default {
  components: {
    CircleProgress,
    TitlePag,
    LineChart,
    Temperature,
    FooterContent
  },
  data() {
    return {
      encoderCount: 0,     //编码器数量
      onlineCount: 0,     //在线编码器数量
      onlinePercent: 0,    //编码器在线率
      cpuUsedPercent: 0,
      memoryUsedPercent: 0,
      temperature: 0,
      upFlowData: [0, 0, 0, 0, 0, 0, 0],
      downFlowData: [0, 0, 0, 0, 0, 0, 0],
      inter: ''
      // title: ''
    }
  },
  created () {
    this.load()
    this.interval()
  },
  methods: {
    load() {
      this.axios
          .get('/system/info')
          .then(res => {
            // console.log(res.data);
            let obj = res.data.data;
            this.encoderCount = parseInt(obj.encoderCount)
            this.onlineCount = parseInt(obj.onlineCount)
            this.onlinePercent = Math.round(obj.onlinePercent * 100)
            this.upFlowData.shift() 
            this.upFlowData.push(parseInt(obj.upFlowSum))
            this.downFlowData.shift() 
            this.downFlowData.push(parseInt(obj.downFlowSum))
            this.cpuUsedPercent = Math.round(obj.cpuUsedPercent * 100)
            this.memoryUsedPercent = Math.round(obj.memoryUsedPercent * 100)
            this.temperature = parseInt(obj.temperature)
          })
    },
    interval() {
      this.inter = setInterval(this.load, 30000);
    }
  },
  destroyed() {
    clearInterval(this.inter)
  }
}
</script>

<style scoped>
.dashboard-item {
  height: 339px;
	background-color: #1f3147;
  border-radius: 4px;
  padding: 20px 30px;
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
}
.item-content .item-content-box {
  display: flex;
  padding-top: 50px;
  padding-left: 88px;
}
.item-content-box .encode-des {
  padding-left: 75px;
}
.encode-des ul li {
	font-size: 16px;
	line-height: 36px;
	color: #afafaf;
}
.encode-des ul li span {
  display: inline-block;
  width: 150px;
  text-align: right;
}
.code-status, .code-status div {
  display: flex;
  align-items:center;
}
.code-status {
  margin-top: 30px;
  padding-left: 108px;
}
.code-status div {
  width: 89px;
}
.code-status div i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #28d2be;
}
.code-status div span {
  font-size: 14px;
  padding-left: 15px;
}
.flow {
  padding-top: 18px;
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
.serverStatus {
  margin-top: 20px;
  box-sizing: border-box;
  background-color: #1f3147;
  padding-top: 20px;
  padding-left: 30px;
  height: 365px;
}
.serverStatus-list {
  display: flex;
  justify-content: center;
  /* padding-top: 53px; */
}
.serverStatus-list li {
  width: 30%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.serverStatus-item-title {
  margin-top:  35px;
  font-size: 14px;
}
</style>