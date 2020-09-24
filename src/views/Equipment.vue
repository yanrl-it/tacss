<template>
  <div class="equipment-box">
    <div v-show="!isShow">
    <el-row :gutter="14">
      <el-col :span="4">
        <div class="equipment-box-item">
          <div class="pag-item">
            <title-pag :title="'编码器分组'"></title-pag>
          </div>
          <tree @groupList="handleGroupList"></tree>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="equipment-box-item equipment-item-rt">
          <title-pag :title="'编码器列表'"></title-pag>
          <div class="nav-equ">
            <div class="search-box" style="width: 337px;">
              <search-box :placeholder="'请输入编码器IP/名称'" @searchClick="search"></search-box>
            </div>
            <div class="equ-status">
              <span>设备状态</span>
              <div class="status-select">
                <i style="width:22px" v-if="selectValue == '全部'"></i>
                <i class="dot-status-1" v-else-if="selectValue == '正常'"></i>
                <i class="dot-status-0" v-else-if="selectValue == '离线'"></i>
                <el-select @change="selectVal" v-model="selectValue" placeholder="全部">
                  <el-option value="全部"><span style="padding-left: 22px;">全部</span></el-option>
                  <el-option value="正常"><i class="dot-status-1"></i><span>在线</span></el-option>
                  <el-option value="离线"><i class="dot-status-0"></i><span>离线</span></el-option>
                </el-select>
              </div>
            </div>
            <div class="equ-ope">
              <ul>
                <li @click="handleGroupList(currentGroupId)" class="equ-reset"><i class="el-icon-refresh-left"></i>刷新</li>
                <li><button @click="groupEncodeAdd">添加成员</button></li>
                <li class="bulk-operation">
                  <el-dropdown>
                    <button>批量操作<i class="el-icon-arrow-down el-icon--right"></i></button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item><p class="" @click="handelBatch($event)">配置导出</p></el-dropdown-item>
                      <el-dropdown-item><p @click="handelBatch($event)">配置导入</p></el-dropdown-item>
                      <el-dropdown-item><p @click="handelBatch($event)">批量升级</p></el-dropdown-item>
                      <el-dropdown-item><p @click="handelBatch($event)">批量重启</p></el-dropdown-item>
                      <el-dropdown-item><p @click="handelBatch($event)">恢复出厂设置</p></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </li>
              </ul>
            </div>
          </div>
          <div style="padding-top:20px;">
            <div class="code-table scroll-bar" style="height: 596px;">
              <el-table ref="multipleTable"
                :data="codeData.filter(data => !inner || data.name.toLowerCase().includes(inner.toLowerCase()) || data.ip.toLowerCase().includes(inner.toLowerCase()) || data.netStatus.toLowerCase().includes(inner.toLowerCase()))" 
                tooltip-effect="dark" 
                style="width: 100%" stripe 
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="44"></el-table-column>
                <el-table-column prop="name" label="编码器名称" width="98">
                  <template slot-scope="scope">
                    <span @click="encoderSetName(scope.row)" class="encoder-name">{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="mac" label="MAC地址" width="158"></el-table-column>
                <el-table-column prop="ip" label="IP" width="148"></el-table-column>
                <el-table-column prop="statistics.cpu" label="CPU状态" width="90">
                  <template slot-scope="scope">
                    <span>{{Math.round(scope.row.statistics.cpu * 100)}}%</span>
                  </template>
                </el-table-column>
                <el-table-column prop="statistics.memory" label="内存状态" width="90">
                  <template slot-scope="scope">
                    <span>{{Math.round(scope.row.statistics.memory * 100)}}%</span>
                  </template>
                </el-table-column>
                <el-table-column prop="statistics.upFlow" label="上行流量(Mbps)" width="118"></el-table-column>
                <el-table-column prop="statistics.downFlow" label="下行流量(Mbps)" width="118"></el-table-column>
                <el-table-column prop="statistics.temperature" label="温度(℃)" width="64"></el-table-column>
                <el-table-column prop="netStatus" label="状态" width="82"></el-table-column>
                <el-table-column label="操作" width="172">
                  <template slot-scope="scope">
                    <el-button class="handle-des" @click.native.prevent="handleExit(scope, codeData)" type="text" size="small">退出分组</el-button>
                    <el-button class="handle-des" @click="handleDetails(scope.row.mac, scope.row.name, scope.row.deviceType)" type="text" size="small">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    </div>
    <!-- 确认选择编码器 -->
    <div class="affirm-encode" v-show="isEncoder">
      <div class="msg-box">
        <div class="msg-title">请选择编码器</div>
        <div style="margin-top: 121px;">
          <button @click="encoderExit" class="btn">确认</button>
        </div>
      </div>
    </div>
    <div class="eqnav-box" v-show="isShow">
      <router-view></router-view>
    </div>
    <footer-content></footer-content>
    <div v-show="isShow" class="reverse-back"><button @click="back" class="btn">返回</button></div>
  </div>
</template>

<script>
import eventBus from '@/eventBus.js'
import TitlePag from '@/components/TitlePag'
import SearchBox from '@/components/SearchBox'
import Tree from '@/components/Tree'
import FooterContent from '@/components/Footer'

export default {
  components: {
    TitlePag,
    SearchBox,
    Tree,
    FooterContent
  },
  data() {
    return {
      activeIndex: '/Home/Equipment/Eqstatus',
      isShow: false,
      isEncoder: false,
      currentGroupId: 0,
      indexOpe: '',
      inputInner: '',
      selectValue: '全部',
      inter: '',
      inner: '',
      codeData: [
        // {name:'编码器1',mac:'56:AF:8J:37:FT:31', ip:'168',netStatus:'在线',statistics:{cpu:'adaw',memory:'1616',upFlow:'32165',downFlow:'216'}},
        // {name:'编码器2',mac:'56:AF:8J:37:FT:31', ip:'172',netStatus:'离线',statistics:{cpu:'adaw',memory:'1616',upFlow:'32165',downFlow:'216'}},
      ],
      multipleSelection: []
    }
  },
  created () {
    this.handleGroupList(0)
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection)
    },
    encoderSetName(row) { //setName encoder
      // console.log(row)
      this.$prompt('修改编码器名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/^(?=[\S\s]{1,6}$)[\S\s]*/,
          inputErrorMessage: '请输入7个字符以内的名称'
        }).then(({value}) => {
          this.axios
            .post('/encoder/set_name', {
              "mac": row.mac,
              "name": value
            })
            .then(res => {
              row.name = value
              this.$message({
                type: 'success',
                message: '修改成功'
              });
            })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '取消输入'
          // });       
        });
    },
    handleExit(scope, rows) {  //退出分组
      this.axios
        .post('/encoder/set_group', {
          "encoder": [scope.row.mac],
          "group": '0'
        })
        .then(res => {
          rows.splice(scope.$index, 1);
        })
    },
    handleDetails(mac, name, type) {
      // console.log(type)
      if (type == 'onvif') {
        this.isShow = true;
        this.$router.push({
          path: '/Home/Equipment/eqnav/Eqnav',
          query: {
            mac: mac
          }
        })
        eventBus.$emit('setName', name)
      } else if (type == 'gb') {
        this.isShow = true;
        this.$router.push({
          path: '/Home/Equipment/eqnav/Nationalnav',
          query: {
            mac: mac
          }
        })
        eventBus.$emit('setName', name)
      }
    },
    search(inner) {
      this.inner = inner;
    },
    selectVal() { //全部-在线-离线
      // console.log(this.selectValue)
      if (this.selectValue == '全部') {
        this.inner = ''
      } else {
        this.inner = this.selectValue;
      }
      
    },
    back() {
      this.isShow = false;
      this.$router.push({path: '/Home/Equipment'})
      eventBus.$emit('setName', null)
    },
    encoderLoad() { //全部编码器
      this.axios
        .get('/encoder/list')
        .then(res => {
          var data = res.data.data;
          for (let item of data) {
            if (item.name == null) item.name = ''
            if (item.ip == null) item.ip = ''
          }
          this.codeData = data;
          // console.log(res.data)
        })
    },
    handleGroupList(i) {
      clearInterval(this.inter);
      this.currentGroupId = i;
      if (i == 0) {
        this.encoderLoad()
      } else if (i == '888888') {
        this.axios
        .get(`encoder/list_by_group/0`)
        .then(res => {
          var data = res.data.data;
          for (let item of data) {
            if (item.name == null) item.name = ''
            if (item.ip == null) item.ip = ''
          }
          this.codeData = data;
          // this.codeData = res.data.data;
        })
      } else{
        this.axios
          .get(`encoder/list_by_group/${i}`)
          .then(res => {
            var data = res.data.data;
            for (let item of data) {
              if (item.name == null) item.name = ''
              if (item.ip == null) item.ip = ''
            }
            this.codeData = data;
            // this.codeData = res.data.data;
          })
      }
      if (!this.inner) clearInterval(this.inter);
      this.inter = setInterval(() => {
        //分组编码查询
        this.currentGroupId = i;
          if (i == 0) {
            this.encoderLoad()
          } else if (i == '888888') {
            this.axios
            .get(`encoder/list_by_group/0`)
            .then(res => {
              var data = res.data.data;
              for (let item of data) {
                if (item.name == null) item.name = ''
                if (item.ip == null) item.ip = ''
              }
              this.codeData = data;
              // this.codeData = res.data.data;
            })
          } else{
            this.axios
              .get(`encoder/list_by_group/${i}`)
              .then(res => {
                var data = res.data.data;
                for (let item of data) {
                  if (item.name == null) item.name = ''
                  if (item.ip == null) item.ip = ''
                }
                this.codeData = data;
                // this.codeData = res.data.data;
              })
          }
      }, 20000);
    },
    groupEncodeAdd() {
      if (!this.currentGroupId || this.currentGroupId == 888888) {
        this.$message({
          showClose: true,
          message: '请选择分组',
          type: 'warning'
        })
        return;
      }
      this.$router.push({
        path: '/Home/Equipment/CodeAdd',
        query: {
          group: this.currentGroupId
        }
      })
    },
    handelBatch(e) {
      // console.log(e.target.innerHTML)
      if (e.target.innerHTML == '配置导出') {
        if (this.multipleSelection.length == 0) {
          this.isEncoder = true;
          return;  
        }
        this.$router.push({
          path: '/Home/Equipment/ResetExportPage',
          query: {
            selected: this.multipleSelection,
            title: '批量导出配置',
            msg: '请确认是否要批量导出配置？'
          }
        })
      }
      if (e.target.innerHTML == '配置导入') {
        this.$router.push({
          path: '/Home/Equipment/ImportPage',
          query: {
            title: '批量导入配置',
            msg: '请确认是否批量导入配置？'
          }
        })
      }
      if (e.target.innerHTML == '批量升级') {
        if (this.multipleSelection.length == 0) {
          this.isEncoder = true;
          return;  
        }
        this.$router.push({
          path: '/Home/Equipment/UpgradePage',
          query: {
            selected: this.multipleSelection,
            title: '批量升级',
            msg: '请确认是否批量升级？'
          }
        })
      }
      if (e.target.innerHTML == '批量重启') {
        if (this.multipleSelection.length == 0) {
          this.isEncoder = true;
          return;  
        }
        this.$router.push({
          path: '/Home/Equipment/ResetExportPage',
          query: {
            selected: this.multipleSelection,
            title: '批量重启',
            msg: '请确认是否要批量重启编码器？'
          }
        })
      }
      if (e.target.innerHTML == '恢复出厂设置') {
        if (this.multipleSelection.length == 0) {
          this.isEncoder = true;
          return;  
        }
        this.$router.push({
          path: '/Home/Equipment/ResetExportPage',
          query: {
            selected: this.multipleSelection,
            title: '批量恢复出厂设置',
            msg: '请确认是否要批量恢复出厂设置？'
          }
        })
      }
    },
    encoderExit() {
      this.isEncoder = false;
    }
  },
  destroyed() {
    clearInterval(this.inter);
  }
}
</script>

<style scoped>
.equipment-box {
  position: relative;
}
.pag-item {
  padding-top: 20px;
  padding-left: 20px;
}
.equipment-box .equipment-box-item {
  height: 726px;
  background-color: #1f3147;
  font-size: 14px;
  box-sizing: border-box;
  /* padding: 20px 30px; */
}
.equipment-item-rt {
  padding: 20px 30px;
}
.el-menu {
  border: 0;
}
.group-box {
  height: 583px;
  overflow-y:auto;
}
.scroll-bar::-webkit-scrollbar {/*滚动条整体样式*/
  width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  /* scrollbar-arrow-color:red; */
}
.scroll-bar::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  /* -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2); */
  background: #25a39b;
  /* scrollbar-arrow-color:red; */
}
.scroll-bar::-webkit-scrollbar-track {/*滚动条里面轨道*/
  /* -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2); */
  border-radius: 5px;
  background: #3c5b77;
}

.nav-equ {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.dot-status-1 {
  display: inline-block;
  width: 12px;
	height: 12px;
  background-color: #28d2be;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: inset 1px 1px 2px 0px rgba(9, 8, 9, 0.12);
}
.dot-status-0 {
  display: inline-block;
  width: 12px;
	height: 12px;
  background-color: #5d5d5d;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: inset 1px 1px 2px 0px rgba(9, 8, 9, 0.12);
}
.status-select {
  border: solid 1px rgba(255, 255, 255, 0.07);
  background-color: #182633;
  display: flex;
  align-items: center;
  width: 130px;
  box-sizing: border-box;
  padding-left: 15px;
  margin-left: 30px;
}
.equ-status {
  display: flex;
  align-items: center;
  padding-left: 50px;
}
.equ-ope ul {
  display: flex;
  align-items: center;
  margin-left: 260px;
}
.equ-ope ul li.equ-reset {
  color: #ffffff;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.equ-ope ul li.equ-reset:hover {
  color: #28d2be;
}
.equ-ope ul li.equ-reset:active {
  color: #ffffff;
}
.equ-ope ul li.equ-reset i {
  font-size: 22px;
  margin-right: 10px;
}
.equ-ope ul li button {
  display: inline-block;
  width: 96px;
	height: 32px;
	background-color: #0fb79c;
  border-radius: 2px;
  white-space: nowrap;
  cursor: pointer;
  border: 0;
  color: #ffffff;
  margin-left: 20px;
  -webkit-appearance: none;
  outline: none;
  transition: .1s;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  font-size: 14px;
  font-family: PingFang-SC-Regular;
}
.equ-ope ul li button:active {
	background-color: #1fd09b;
}
.el-dropdown-menu {
  background-color: #2f3d4b;
  border-radius: 4px;
  border: 0;
}
.el-dropdown-menu__item {
  padding: 0;
  width: 96px;
  text-align: center;
}
.el-dropdown-menu__item:hover {
  background-color: #0fb79c;
}

.reverse-back {
  position: absolute;
  right: 0;
  top: -43px;
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


/* table */
.code-table {
  overflow-y: auto;
}
.el-table__expanded-cell {
  background-color: #1c2c3b;
}
.el-table::before {
  display: none;
}
.el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #182633;
}
.el-checkbox__inner, .el-checkbox__input{
  width: 20px;
  height: 20px;
  background-color: #182633;
  border-radius: 2px;
  border: solid 1px rgba(255, 255, 255, 0.3);
}
.el-table {
  color: #d3d5d7;
  background-color: #1f3147;
}
/* .el-table .cell span {
  color: #28d2be;
  margin: 0 8px;
  cursor: pointer;
}
.el-table .cell span:hover {
  color: #ffffff;
}
.el-table .cell span:active {
  color: #28d2be;
} */
/* 滚动条 */
.scroll-bar::-webkit-scrollbar {/*滚动条整体样式*/
  width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  /* scrollbar-arrow-color:red; */
}
.scroll-bar::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  /* -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2); */
  background: #25a39b;
  /* scrollbar-arrow-color:red; */
}
.scroll-bar::-webkit-scrollbar-track {/*滚动条里面轨道*/
  /* -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2); */
  border-radius: 5px;
  background: #3c5b77;
}

.handle-des {
	font-size: 14px;
	color: #28d2be;
}
.handle-des:hover {
  opacity: 0.9;
}

/* 确认编码器 */
.affirm-encode {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #182633;
  z-index: 1001;
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
.encoder-name {
  display: block;
  width: 100%;
  height: 38px;
  cursor: pointer;
}
</style>