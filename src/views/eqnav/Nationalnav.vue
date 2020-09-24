<template>
  <div class="eq-nav">
      <el-menu :default-active="activeIndex" 
      background-color="#1f3147"
      text-color="#afafaf"
      active-text-color="#28d2be"
      class="el-menu-demo el-menu" 
      mode="horizontal" 
      @select="navSelect">
        <el-menu-item index="/Home/Equipment/eqnav/Nationalstatus">设备状态</el-menu-item>
        <el-menu-item index="/Home/Equipment/eqnav/Nationalconfig">国标配置</el-menu-item>
        <el-menu-item index="/Home/Equipment/eqnav/Nationalaisle">通道管理</el-menu-item>
        <el-menu-item index="/Home/Equipment/eqnav/Nationaledit">编码设置</el-menu-item>
        <el-menu-item index="/Home/Equipment/eqnav/Nationalsystem">系统设置</el-menu-item>
      </el-menu>
      <div style="padding-top: 20px;">
        <router-view></router-view>
      </div>
      <!-- <div class="reverse-back"><button @click="back" class="btn">返回</button></div> -->
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
    if (this.$route.path != '/Home/Equipment/eqnav/Nationalstatus') {
      this.$router.push({
        path: '/Home/Equipment/eqnav/Nationalstatus',
        query: {
          mac: this.mac
        }
      });
      this.activeIndex = '/Home/Equipment/eqnav/Nationalstatus';
    }
  },
  methods: {
    navSelect(key, keyPath) {
      if (this.$route.path == key) return;
      // if (this.$route.path != key) {
        this.$router.push({
          path: key,
        query: {
          mac: this.mac
        }  
        });
      // }
      // console.log(key, keyPath);
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