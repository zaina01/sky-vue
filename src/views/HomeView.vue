<script setup>
// import TimedTask from './TimedTask.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-header class="aside-header">Header</el-header> -->
      <el-aside>
        <el-container direction="vertical">
          <el-header height="60px" class="nested-header"> 朱雀 </el-header>
          <el-main class="nested-main">
            <!-- Aside 内容 -->
            <div class="menu-item">定时任务</div>
            <div class="menu-item">日志管理</div>
            <div class="menu-item">系统设置</div>
          </el-main>
        </el-container>
      </el-aside>

      <el-container>
        <el-header class="header">定时任务调度</el-header>
        <el-main class="main">
          <!-- <component :is="TimedTask"></component> -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style scoped>
.common-layout {
  height: 100vh;
  width: 100vw;
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
  justify-content: center;
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
