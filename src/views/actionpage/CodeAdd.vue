<template>
  <div class="handel-code">
    <div class="title">添加成员</div>
    <div style="width: 337px;"><search-box :placeholder="'请输入编码器名称/MAC地址/IP'" @searchClick="search"></search-box></div>
    <div style="margin-top: 20px;">
      <code-table @selection="handleslelct" :tableHeight="'height:456px;'" :tableData="codeData.filter(data => !inner || data.ip.toLowerCase().includes(inner.toLowerCase()) || data.netStatus.toLowerCase().includes(inner.toLowerCase()))" :dataList="dataList"></code-table>
    </div>
    <div style="margin-top: 20px;">
      <ul class="code-btn">
        <li @click="setGroup">确定</li>
        <li style="margin-left: 84px; background-color: #5d5d5d;" @click="back">取消</li>
      </ul>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/SearchBox'
import CodeTable from '@/components/CodeTable'

export default {
  components: {
    SearchBox,
    CodeTable
  },
  data() {
    return {
      dataList: [
        {'type': 'selection', 'prop': '', 'label': '', 'width': '81'},
        {'type': '', 'prop': 'ame', 'label': '编码器名称', 'width': '196'},
        {'type': '', 'prop': 'mac', 'label': 'MAC地址', 'width': '246',},
        {'type': '', 'prop': 'ip', 'label': 'IP', 'width': '241', 'ope': 1}
      ],
      codeData: [],
      group: '',
      multipleSelection: [],
      inner: ''
    }
  },
  created() {
    this.group = this.$route.query.group;
    this.axios
      .get('encoder/list_by_group/0')
      .then(res => {
        this.codeData = res.data.data;
        // console.log(res)
      })
  },
  methods: {
    search(inner) {
      this.inner = inner
      // console.log(inner)
    },
    handleslelct(val) {
      this.multipleSelection = []
      for (let i of val) {
        this.multipleSelection.push(i.mac)
      }
      // console.log(this.multipleSelection)
    },
    setGroup() {  //添加分组成员
      if (this.group == 30) return
      this.axios
      .post('/encoder/set_group', {
        "encoder": this.multipleSelection,
        "group": this.group
      })
      .then(res => {
        // console.log(res)
        this.$router.go(-1);
      })
    },
    back() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.handel-code {
  width: 848px;
  height: 667px;
  margin: 117px auto;
  padding: 30px;
  box-sizing: border-box;
  background-color: #1f3147;
  border-radius: 4px;
}
.title {
  text-align: center;
	font-size: 16px;
  color: #ffffff;
  padding-bottom: 30px;
}
.code-btn {
  display: flex;
   justify-content: center;
}
.code-btn li {
	width: 90px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;
	background-color: #0fb79c;
  border-radius: 2px;
  font-size: 14px;
  color: #ffffff;
  text-align: center;
}
.code-btn li:active {
  opacity: 0.8;
}
</style>