<template>
  <div class="login-content">
    <header-content></header-content>
    <div class="login-box">
      <div class="title">
        <p>图鸭集群管理服务器系统</p>
        <span>Tucodec Cluster Administration Server System</span>
      </div>
      <ul class="user-info">
        <li class="form-in">
          <span class="user-des">账 号</span>
          <div><input type="text" v-model="uname"></div>
        </li>
        <li class="form-in">
          <span class="user-des">密 码</span>
          <div><input type="password" v-model="upwd"></div>
        </li>
      </ul>
      <ul class="btn-group">
        <li><button class="btn" @click="submitForm">登录</button></li>
        <li><button class="btn" @click="resetForm">重置</button></li>
      </ul>
    </div>
    <footer-content></footer-content> 
  </div>
</template>

<script>
import HeaderContent from '@/components/Header.vue'
import FooterContent from '@/components/Footer.vue'

export default {
  components: {
    HeaderContent,
    FooterContent
  },
  data() {
    return {
        uname: '',
        upwd: '',
    }
  },
  methods: {
    submitForm() {
      var uname = this.uname, upwd = this.upwd, reg = /^[a-z0-9_]{3,12}$/i;
      if(!reg.test(uname)){
        this.$message({
          showClose: true,
          message: '请正确输入用户名',
          type: 'error'
        })
        return
      }
      if(!upwd){
        this.$message({
          showClose: true,
          message: '请输入密码',
          type: 'error'
        })
        return
      }
      let param = new URLSearchParams();
      param.append("loginName", uname);
      param.append("password", upwd);
      this.axios
        .post('/login', {
          "loginName": uname,
          "password": upwd
        })
        .then(res => {
          // console.log(res.data)
          if (res.data.code == '0') {
            //ElementUi的友好提示
            this.$message({
              showClose: true,
              message: '登录成功',
              type: 'success'
            })
            sessionStorage.setItem('userName', uname)
            this.$store.dispatch('setUser', uname)
            //登录成功后跳转到指定页面
            // console.log(this.$store.state.isLogin)
            this.$router.push("/Home")
          } else {
            this.$message({
              showClose: true,
              message: '用户名或密码不正确',
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    resetForm() {
      this.uname = '';
      this.upwd = '';
    }
  }
}
</script>

<style scoped>
.login-box {
  width: 638px;
	height: 391px;
  background-color: #1e3246;
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.title {
  padding-top: 68px;
  text-align: center;
  color: #ffffff;
}
.title p {
	font-size: 30px;
}
.title span {
	font-size: 16px;
}
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 48px;
}
.user-info li {
  width: 340px;
  margin-bottom: 20px;
}
.user-info input {
	width: 260px;
	height: 40px;
  color: #afafaf;
	background-color: #182633;
	border-radius: 2px;
  border: solid 1px rgba(255, 255, 255, 0.07);
  font-size: 14px;
  padding-left: 10px;
  box-sizing: border-box;
}
.form-in {
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-des {
	font-size: 16px;
  color: #afafaf;
  width: 65px;
}
.btn {
	width: 90px;
	height: 32px;
	background-color: #0fb79c;
  border-radius: 2px;
	font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  border: 0;
}
.btn:active {
	background-color: #1fd09b;
}
.btn-group{
  margin-left: 222px;
  display: flex;
  width: 260px;
  justify-content: space-between;
}
</style>