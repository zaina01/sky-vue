<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-header class="aside-header">Header</el-header> -->
      <el-aside>
        <el-container direction="vertical">
          <el-header height="60px" class="nested-header"> sky </el-header>
          <el-main class="nested-main">
            <!-- Aside 内容 -->
            <div class="menu-item">功能开发中</div>
            <div class="menu-item">功能开发中</div>
            <div class="menu-item">功能开发中</div>
          </el-main>
        </el-container>
      </el-aside>

      <el-container>
        <el-header class="header"
          ><el-page-header :icon="ArrowLeft" @back="onBack" :disabled="isHomePage">
            <template #content>
              <span class="text-large font-600 mr-3"> sky </span>
            </template>
          </el-page-header></el-header
        >
        <el-main class="main">
          <!-- <component :is="TimedTask"></component> -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
const router = useRouter()
const route = useRoute()
const isHomePage = computed(() => route.path === '/')
const onBack = () => {
  if (isHomePage.value) return
  router.back()
}
</script>
<style scoped>
.common-layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.menu-item {
  padding: 15px 12px;
  /* margin: 5px 0; */
  text-align: center;
  background-color: #787b81;
  /* border-radius: 4px; */
  /* cursor: pointer; */
}
.nested-main {
  /* background-color: #b4b7bb; */
  padding: 0;
  /* display: flex; */
}
.nested-header {
  background-color: #6c6f74;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.header {
  background-color: #b3c0d1;
  color: #333;
  display: flex;
  align-items: center;
  /* justify-content: center; */
}

.el-aside {
  height: 100vh;
  width: 15%;
  background-color: #d3dce6;
  color: #333;
  /* display: flex; */
  /* align-items: center;
  justify-content: center; */
}

.main {
  height: 100%;
  /* padding: 0; */
  padding: 20px;
  /* background-color: #e9eef3;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center; */
}

.aside-content,
.header-content,
.main-content {
  font-size: 18px;
  font-weight: bold;
}
</style>
