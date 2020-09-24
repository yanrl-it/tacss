<template>
  <div class="header-content">
    <div class="header-box">
      <div class="header-item">
        <div>
          <img src="../assets/image/logo.png">
        </div>
        <div>
          <span class="logo-title">TCASS</span>
        </div>
      </div>
      <div v-show="name==null?false:true" class="encoderName">编码器名称：{{name}}</div>
      <div v-if="show" class="header-item">
        <ul class="user-adm">
          <li>
            <div>
              <img src="../assets/image/user_icon.png">
            </div>
            <div class="user-adm-des">{{user}}</div>
          </li>
          <li class="user-adm-exit" @click="logOut">
            <div>
              <img src="../assets/image/exit_icon.png">
            </div>
            <div class="user-adm-des">注销</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/eventBus.js'

export default {
  data() {
    return {
      show: false,
      user: '',
      name: null
    }
  },
  created () {
    eventBus.$on('setName', (name) => {
      this.name = name
    })
    if (sessionStorage.getItem('userName')) {
      this.show = true;
      this.user = sessionStorage.getItem('userName');
      this.$store.commit('userStatus', sessionStorage.getItem('userName'))
    } else {
      // this.$store.commit('userStatus', null);
    }
  },
  methods: {
    logOut () {
      sessionStorage.removeItem("userName");
      //  this.$store.dispatch('setUser', '')
      // sessionStorage.setItem("userName", null);
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.header-content {
	background-color: #1c2d3f;
	box-shadow: 0px 0px 4px 0px rgba(9, 8, 9, 0.12);
}
.header-box {
  height: 70px;
  width: 1520px;
  margin: 0 auto;
  line-height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-item {
  display: flex;
  align-items: center;
}
.logo-title {
  /* font-weight: 100%; */
  font-size: 20px;
  color: #fff;
  margin-left: 10px;
}
ul.user-adm {
  display: flex;
  align-items: center;
}
ul.user-adm li {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  width: 100px;
  font-size: 15px;
}
.user-adm-des {
  margin-left: 4px;
}
li.user-adm-exit {
  cursor: pointer;
}
li.user-adm-exit:hover {
  color: #0fb89c;
}
.encoderName {
	font-size: 16px;
	color: #2fd6bb;
}
</style>
