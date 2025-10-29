<template>
  <div id="globalHeader">
    <a-menu mode="horizontal" :default-selected-keys="['1']" @menu-item-click="doClick">
      <a-menu-item key="0" :style="{ padding: 0, marginRight: '14px' }" disabled>
        <div class="title-bar">
          <img class="logo" src="../assets/logo.svg">
          <div class="title">OJ</div>
        </div>
      </a-menu-item>
      <a-menu-item v-for="item in routes" :key="item.path">
        {{ item.name }}
      </a-menu-item>
    </a-menu>
  </div>
</template>
<style scoped>
.logo {
  height: 48px;

}

.title {
  color: black;
  font-weight: bold;
  padding-left: 20px;
}

.title-bar {
  display: flex;
  align-items: center;
}
</style>
<script setup lang="ts">
import {routes} from "../router/routes.ts";
import {useRouter} from "vue-router";
let router = useRouter();
function doClick(key: string) {
  router.push({
    path: key,
  })
}
</script>