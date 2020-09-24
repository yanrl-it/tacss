<template>
  <div class="eq-nav">
      <el-menu :default-active="activeIndex" 
      background-color="#1f3147"
      text-color="#afafaf"
      active-text-color="#28d2be"
      class="el-menu-demo el-menu" 
      mode="horizontal" 
      @select="navSelect">
        <el-menu-item index="/Home/Equipment/eqnav/Eqstatus">设备状态</el-menu-item>
        <el-menu-item index="/Home/Equipment/eqnav/Eqinsetting">输入设置</el-menu-item>
        <el-menu-item index="/Home/Equipment/eqnav/Eqeditsetting">编码设置</el-menu-item>
        <el-menu-item index="/Home/Equipment/eqnav/Eqexportsetting">输出设置</el-menu-item>
        <el-menu-item index="/Home/Equipment/eqnav/Eqsystem">系统设置</el-menu-item>
      </el-menu>
      <div style="padding-top: 20px;">
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '',
      mac: ''
    }
  },
  created() {
    this.mac = this.$route.query.mac;
    if (this.$route.path != '/Home/Equipment/eqnav/Eqstatus') {
      this.$router.push({
        path: '/Home/Equipment/eqnav/Eqstatus',
        query: {
          mac: this.mac
        }
      });
      this.activeIndex = '/Home/Equipment/eqnav/Eqstatus';
    }
  },
  methods: {
    navSelect(key, keyPath) {
      if (this.$route.path == key) return;
      this.$router.push({
        path: key,
        query: {
          mac: this.mac
        }
      });
    }
  }
}
</script>

<style scoped>
.el-menu.el-menu-demo {
  box-sizing: border-box;
	height: 40px;
	background-color: #1f3147;
  border-radius: 4px;
  border: 0;
}
.el-menu-demo .el-menu-item {
  height: 40px;
  line-height: 40px;
  padding: 0;
  margin: 0 30px;
}
</style>