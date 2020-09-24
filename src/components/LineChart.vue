<template>
  <div>
    <div id="temperature" :style="widthHeight"></div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'hello',
  data () {
    return {
      upFlow: [0,0,0,0,0,0,0],
      dowFlown: [0,0,0,0,0,0,0]
    }
  },
  props: ['flowData', 'widthHeight'],
  watch: {
    flowData: function(newVal,oldVal) {
      // console.log(newVal.upFlowData)
      this.upFlow = newVal.upFlowData;
      this.dowFlown = newVal.downFlowData;
      this.drawLine();
    }
  },
  mounted(){
    this.drawLine();
  },
  methods: {
    drawLine(){
      let option = {
        grid: {
          top: '5%',   // 等价于 y: '16%'
          left: '0', 
          right: '1',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine:{  //x轴线
            show:false,
            lineStyle: {
              color: '#a7a7a7',
              type: 'dashed'
            }
          },
          splitLine:{
            show:true,
            lineStyle:{
              color: '#a7a7a7',
              type: 'dashed'
            }
          },
          axisTick: {
              show: false
          },
          data: ['', '', '', '', '', '', '']
        },
        yAxis: {
          type: 'value',
          splitNumber: 3,
          axisLine: {
            show:false,
            lineStyle: {
              color:'#a7a7a7',
              type: 'dashed'
            }
          },
          splitLine:{
            show:true,
            lineStyle:{
              color: '#a7a7a7',
              type: 'dashed'
            }
          },
          axisTick: {
              show: false
          }
        },
        series: [
          {
            data: this.upFlow,
            type: 'line',
            areaStyle: {},
            symbol:'none',
            smooth: true,
            itemStyle: {
              normal: {
                color: 'none'            
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#28d2be'
                }, {
                  offset: 1,
                  color: '#28d2be'
                }])
              }
            },
          },
          {
            data: this.dowFlown,
            type: 'line',
            areaStyle: {},
            symbol:'none',
            smooth: true,
            itemStyle: {
              normal: {
                color: 'none'
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#edb12f'
                }, {
                  offset: 1,
                  color: '#ffa'
                }])
              }
            },
          }
        ]
      };
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('temperature'))
      // 绘制图表
      myChart.setOption(option);
    }
  }
}
</script>

<style scoped>
</style>