<template>
  <div>
    <div class="" style="margin: 20px 0 10px 20px;width: 82%;">
      <search-box :placeholder="'请输入内容'" @searchClick="search"></search-box>
    </div>
    <el-tree
      class="filter-tree"
      :data="data"
      accordion
      :props="defaultProps"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span :class="data.id == activeThree ? 'active-bg':''">{{ node.label }}</span>
        <p class="three-point" @mouseenter="enter(node.id)" @mouseleave="leave" :class="data.id==activeThree?'active':'reactive'">
          <img src="@/assets/image/three_point.png">
          <span :class="node.id == activeClass ? 'active':'reactive'">
            <span class="amend-group" style="z-index: 10000;">
              <i @click="() => appendGroup(data)" class="el-icon-circle-plus-outline"></i>
              <i @click="() => removeGroup(node, data)" class="el-icon-remove-outline"></i>
              <i @click="() =>setNameGroup(node, data)" class="el-icon-edit-outline"></i>
            </span>
          </span>
        </p>
      </span>
    </el-tree>
    <div class="group-ope">
      <div class="mask-layer" v-show="maskLayer"></div>
      <div class="ope-box" v-show="opeBox==0 || opeBox==1 ||opeBox==2">
        <div class="del" v-show="opeBox==1">
          <div class="des" style="margin-top: 112px;">是否确认删除分组？</div>
          <ul class="ope-btn">
            <li @click="handleRemoveGroup">确定</li>
            <li @click="cancel" class="ope-btn-rt">取消</li>
          </ul>
        </div>
        <div v-show="opeBox==0">
          <div class="des" style="margin-top: 29px;">添加分组</div>
          <div style="margin-top: 95px; text-align: center;">
            <input type="text" v-model="addInner">
          </div>
          <ul class="ope-btn" style="margin-top: 77px;">
            <li @click="handleAddGroup">确定</li>
            <li @click="cancel" class="ope-btn-rt">取消</li>
          </ul>
        </div>
        <div v-show="opeBox==2">
          <div class="des" style="margin-top: 29px;">编辑分组</div>
          <div style="margin-top: 95px; text-align: center;">
            <input type="text" v-model="editInner">
          </div>
          <ul class="ope-btn" style="margin-top: 77px;">
            <li @click="handleEditGroup">确定</li>
            <li @click="cancel" class="ope-btn-rt">取消</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/SearchBox'

export default {
  components: {
    SearchBox
  },
  data() {
    return {
      maskLayer: false,
      opeBox: 3,
      activeClass: '',
      activeThree: '',
      editInner: '',
      addInner: '',
      node: '',
      parent: '',
      data: [
        {
          name: '全部',
          children:[],
          id: 0
        },
        {
          name: '未分组',
          id: 888888
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name',
        id: 'id'
      }
    };
  },
  created() {
    this.getGroup();
  },
  methods: {
    handleNodeClick(data) {
      // console.log(data.id);
      this.activeThree = data.id;
      this.$emit('groupList', data.id);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    search(inner) {
      this.$refs.tree.filter(inner);
    },
    enter(i){
      this.activeClass = i;
      // console.log(id)
    },
    leave(){
      this.activeClass = '';
    },
    cancel() {
      this.maskLayer = false;
      this.opeBox = 3;
      this.editInner = '';
      this.addInner = '';
      // this.node = '';
      // this.data = '';
    },
    getGroup() {
      this.axios
      .get('/group/list')
      .then(res => {
        this.data[0].children = res.data.data.roots;
        // console.log(res)
      })
    },
    handleAddGroup() { //add group
      var data = this.parent;
      if (data.id == 888888) return;
      this.axios
        .post('/group/add', {
          "name": this.addInner,
          "parent": data.id
        })
        .then(res => {
          this.getGroup();
          this.cancel();
        })
    },
    handleRemoveGroup() { // remove group
      var node = this.node, data = this.parent;
      if (data.id == 0 || data.id == 888888) return;
      this.axios
      .delete(`/group/${data.id}`)
      .then(res => {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        // console.log(children[index].name)
        children.splice(index, 1); 
        this.cancel();
      })
    },
    handleEditGroup() { // edit group
      var node = this.node, data = this.parent;
      if (data.id == 0 || data.id == 888888) return;
      this.axios
        .put('/group/set_name', {
          "id": this.activeThree,
          "name": this.editInner
        })
        .then(res => {
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === data.id);
          children[index].name = this.editInner;
          this.cancel();
        })
    },
    setNameGroup(node, data) {
      this.maskLayer = true;
      this.opeBox = 2;
      this.parent = data;
      this.node = node;
    },
    removeGroup(node, data) {
      this.maskLayer = true;
      this.opeBox = 1;
      this.parent = data;
      this.node = node;
    },
    appendGroup(data) {
      this.maskLayer = true;
      this.opeBox = 0;
      this.parent = data;
    }
  },
  watch: {
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #afafaf;
}
.el-tree {
  background-color: transparent;
}
.three-point {
  padding: 12px 5px;
  position: relative;
}
.amend-group {
  position: absolute;
  display: flex;
  top: -5px;
  right: -168px;
  z-index: 1000;
  width: 167px;
	height: 38px;
	background-color: #2f3d4b;
  border-radius: 4px;
  align-items: center;
  justify-content: space-around;
}
.amend-group i {
  font-size: 24px;
  color: #ffffff;
}
.amend-group i:hover {
  color: #28d2be;
}
.reactive {
  display: none;
}
.active {
  display: block;
}

/* 分组操作 */
.mask-layer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: #182633;
}
.ope-box {
  width: 524px;
	height: 320px;
	background-color: #1f3147;
  border-radius: 4px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin:auto;
  z-index: 999;
}
.des {
  font-size: 16px;
  color: #ffffff;
  text-align: center;
}
ul.ope-btn {
  display: flex;
  justify-content: center;
}
ul.ope-btn li{
  width: 90px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background-color: #0fb79c;
  border-radius: 2px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}
ul.ope-btn .ope-btn-rt {
  margin-left: 84px;
  background-color: #5d5d5d;
}
.del ul.ope-btn {
  margin-top: 121px;
}
.ope-box input {
	width: 337px;
	height: 32px;
	background-color: #182633;
	border-radius: 2px;
  border: solid 1px rgba(255, 255, 255, 0.07);
  font-size: 14px;
  color: #ffffff;
  padding-left: 9px;
  box-sizing: border-box;
}
.active-bg {
  color: #0fb79c;
}
</style>