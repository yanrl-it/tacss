<template>
  <div class="home">
    <header-content></header-content>
    <div class="home-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Dashboard" name="/Home/Dashboard">
          <!-- <dashboard></dashboard> -->
        </el-tab-pane>
        <el-tab-pane label="设备管理" name="/Home/Equipment">
          <!-- <equipment></equipment> -->
        </el-tab-pane>
        <el-tab-pane label="系统设置" name="/Home/System">
          <!-- <system></system> -->
        </el-tab-pane>
      </el-tabs>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import eventBus from '@/eventBus.js'
import HeaderContent from '@/components/Header.vue'

export default {
  data() {
    return {
      activeName: '/Home/Dashboard'
    };
  },
  components: {
    HeaderContent,
  },
  created() {
    // if (this.$route.path == '/Home') {
    //   this.$router.push({path: '/Home/Dashboard'});
    // } else if (this.$route.path == '/Home/Dashboard') {
    //   this.activeName = '/Home/Dashboard';
    // } else if (this.$route.path == '/Home/System') {
    //   this.activeName = '/Home/System';
    // } else {
    //   this.activeName = '/Home/Equipment';
    // }
    if (this.$route.path == '/Home') {
      this.$router.push({path: '/Home/Dashboard'});
    } else if (this.$route.path == '/Home/Dashboard' || this.$route.path == '/Home/Equipment' || this.$route.path == '/Home/System'){
      this.activeName = this.$route.path;
    } else {
      this.$router.push({path: '/Home/Equipment'});
      this.activeName = this.$route.path;
    }
  },
  methods: {
    handleClick(tab, event) {
      if (this.$route.path == tab.name) return;
      if (tab.name == '/Home/Equipment') {
        if (this.$route.path.indexOf('/Home/Equipment/') != -1) return;
      }
      this.$router.push({
        path: tab.name
      });
      eventBus.$emit('setName', null)
    }
  }
}
</script>

<style scoped>
.home-box {
  width: 1520px;
  margin: 0 auto;
  color: #b2b7b5;
}
.wrap-progress {
  width: 300px;
}
</style>