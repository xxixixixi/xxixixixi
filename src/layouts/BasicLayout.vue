<script setup lang="ts">

import GlobalHeader from "../components/GlobalHeader.vue";
</script>

<template>
  <div id="basicLayout">
    <a-layout>
      <a-layout-header class="header">
        <global-header/>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view/>
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://baidu.com" target="_blank">baidu</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>

#basicLayout .header {

}

#basicLayout .content {

}

#basicLayout .footer {
  font-size: 20px;
  background: #efefef;
  padding: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>