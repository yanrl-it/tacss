<template>
  <div id="app">
    <div class="main">
      <router-view/>
    </div>
  </div>
</template>

<style>
  .main {
    position: absolute;
    background-color: #182633;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    min-height: 860px;
    min-width: 1520px;
  }
</style>
