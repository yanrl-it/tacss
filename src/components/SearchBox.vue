<template>
  <div class="search-box">
    <input type="text" class="search-box-inner" v-model="inputInner" :placeholder="placeholder">
    <div class="search-box-append" @click="handelSearch">
      <i class="el-icon-search"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputInner: ''
    }
  },
  props: ['placeholder'],
  methods: {
    handelSearch() {
      this.$emit('searchClick', this.inputInner);
      this.inputInner = '';
    }
  }
}
</script>

<style scoped>
.search-box {
  width: 100%;
  display: inline-table;
  border: solid 1px rgba(255, 255, 255, 0.07);
  /* border: solid 1px rgba(255, 255, 255, 0.07); */
}
.search-box-append {
  display: table-cell;
  background-color: #182633;
  width: 32px;
  text-align: center;
  cursor: pointer;
  color: #b2b7b5;
}
.search-box-append:hover {
  color: #ffffff;
}
.search-box-append:active {
  color: #b2b7b5;
}
.search-box-inner {
  -webkit-appearance: none;
  background-image: none;
  box-sizing: border-box;
  color: #afafaf;
  display: inline-block;
  font-size: inherit;
  height: 32px;
  line-height: 32px;
  outline: none;
  padding: 0 9px;
  /* transition: border-color .2s cubic-bezier(.645,.045,.355,1); */
  width: 100%;
  background-color: #182633;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  border: 0;
}
</style>