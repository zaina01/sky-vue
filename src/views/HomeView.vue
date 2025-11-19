<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-header class="aside-header">Header</el-header> -->
      <el-aside>
        <el-container direction="vertical">
          <el-header height="60px" class="nested-header"> sky </el-header>
          <el-main class="nested-main">
            <!-- Aside 内容 -->
            <div class="menu-item" @click="router.push('/')">首页</div>
            <div class="menu-item" @click="router.push('/notify')">推送管理</div>
            <div class="menu-item">数据管理(功能开发中)</div>
          </el-main>
        </el-container>
      </el-aside>

      <el-container>
        <el-header class="header"
          ><el-page-header title="返回" @back="onBack" :disabled="isHomePage">
            <template #content>
              <span class="text-large font-600 mr-3"> {{ pageTitle }} </span>
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
import { ElMessage } from 'element-plus'
const router = useRouter()
const route = useRoute()
const isHomePage = computed(() => route.path === '/')
const pageTitle = computed(() => route.meta?.title || '')
const onBack = () => {
  if (isHomePage.value) {
    ElMessage.error('已经是首页了')
    return
  }
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
.menu-item {
  cursor: pointer; /* 鼠标悬停时显示手型指针 */
  transition: all 0.3s ease; /* 添加平滑过渡效果 */
}

/* 悬停状态样式 */
.menu-item:hover {
  transform: translateY(-2px); /* 轻微上浮效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影提升立体感 */
  opacity: 0.9; /* 轻微透明度变化 */
}

/* 或者使用背景色变化 */
.menu-item:hover {
  background-color: #5d656b !important; /* 悬停时加深背景色 */
  border-color: #5d656b !important;
}
</style>
