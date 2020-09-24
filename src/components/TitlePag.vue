<template>
  <div class="title-pag">
    <i></i><span>{{title}}</span>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style scoped>
.title-pag {
  display: flex;
}
.title-pag>i {
  width: 3px;
	height: 20px;
	background-color: #28d2be;
	border-radius: 2px;
}
.title-pag>span {
  margin-left: 11px;
	height: 20px;
  line-height: 20px;
	font-size: 16px;
	color: #ffffff;
}
</style>