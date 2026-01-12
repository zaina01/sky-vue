<template>
  <div class="common-layout">
    <!-- 使用 el-row 和 el-col 替代原有的 el-container 实现更精细的响应式控制 -->
    <el-row class="layout-row" :gutter="0">
      <!-- 侧边栏：在不同屏幕尺寸下设置不同的占用份数 -->
      <!-- 超小屏幕（手机）：占满整行（侧边栏在上方） -->
      <!-- 小屏幕（平板）：占1/3 -->
      <!-- 中等屏幕：占1/4 -->
      <!-- 大屏幕：占1/6 -->
      <!-- 超大屏幕：占1/8 -->
      <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3" class="aside-col">
        <div class="aside-content">
          <div class="nested-header">
            <span v-if="!isCollapsed">sky</span>
            <!-- 汉堡菜单图标，小屏幕下可点击折叠侧边栏 -->
            <el-icon @click="toggleCollapse"><Expand /></el-icon>
          </div>
          <div class="nested-main" :class="{ collapsed: isCollapsed }">
            <div
              class="menu-item"
              :class="{ 'menu-item-collapsed': isCollapsed }"
              @click="handleMenuClick('/')"
            >
              <el-icon><House /></el-icon>
              <span v-if="!isCollapsed">首页</span>
              <el-tooltip v-else effect="dark" content="首页" placement="right">
                <span></span>
              </el-tooltip>
            </div>
            <div
              class="menu-item"
              :class="{ 'menu-item-collapsed': isCollapsed }"
              @click="handleMenuClick('/notify')"
            >
              <el-icon><Promotion /></el-icon>
              <span v-if="!isCollapsed">推送管理</span>
              <el-tooltip v-else effect="dark" content="推送管理" placement="right">
                <span></span>
              </el-tooltip>
            </div>
            <div
              class="menu-item"
              :class="{ 'menu-item-collapsed': isCollapsed }"
              @click="handleMenuClick('/loader')"
            >
              <el-icon><DataAnalysis /></el-icon>
              <span v-if="!isCollapsed">加载器管理</span>
              <el-tooltip v-else effect="dark" content="加载器管理" placement="right">
                <span></span>
              </el-tooltip>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 主内容区 -->
      <!-- 超小屏幕：占满整行（在主内容区下方） -->
      <!-- 小屏幕：占2/3 -->
      <!-- 中等屏幕：占3/4 -->
      <!-- 大屏幕：占5/6 -->
      <!-- 超大屏幕：占7/8 -->
      <el-col :xs="24" :sm="16" :md="18" :lg="20" :xl="21" class="main-col">
        <div class="main-content">
          <el-header class="header">
            <el-page-header title="返回" @back="onBack" :disabled="isHomePage">
              <template #content>
                <span class="text-large font-600 mr-3"> {{ pageTitle }} </span>
              </template>
            </el-page-header>
          </el-header>
          <el-main class="main">
            <router-view></router-view>
          </el-main>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
// 引入所需图标
import { Expand, House, Promotion, DataAnalysis } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式状态：侧边栏是否折叠
const isCollapsed = ref(false)
// 响应式状态：当前屏幕宽度
const screenWidth = ref(window.innerWidth)

// 计算属性：判断是否是首页
const isHomePage = computed(() => route.path === '/timedtask')
// 计算属性：获取页面标题
const pageTitle = computed(() => route.meta?.title || '')

// 监听窗口大小变化
const handleResize = () => {
  screenWidth.value = window.innerWidth
  // 根据屏幕宽度自动决定是否折叠菜单
  // 在小屏幕下（小于768px）自动折叠菜单，只显示图标
  if (screenWidth.value < 768) {
    isCollapsed.value = true
  } else {
    isCollapsed.value = false
  }
}

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  // 在小屏幕下，点击汉堡菜单可以展开/收起完整菜单
  if (screenWidth.value < 768) {
    isCollapsed.value = !isCollapsed.value
  }
  // 在大屏幕上，可以保留手动折叠功能（可选）
  // else {
  //   isCollapsed.value = !isCollapsed.value
  // }
}

// 菜单点击处理
const handleMenuClick = (path) => {
  router.push(path)
  // 在小屏幕下点击菜单后自动折叠侧边栏，提升体验
  if (screenWidth.value < 768) {
    isCollapsed.value = true
  }
}

// 返回按钮处理
const onBack = () => {
  if (isHomePage.value) {
    ElMessage.error('已经是首页了')
    return
  }
  router.back()
}

// 组件挂载时添加窗口大小监听
onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始化时执行一次
  handleResize()
})

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.common-layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 布局行样式 */
.layout-row {
  height: 100%;
  margin: 0 !important; /* 去除默认边距 */
}

/* 侧边栏样式 */
.aside-col {
  height: 100vh;
  background-color: #d3dce6;
  color: #333;
  transition: all 0.3s ease; /* 添加过渡动画 */
}

.aside-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nested-header {
  background-color: #6c6f74;
  color: white;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 使标题和图标分居两侧 */
  padding: 0 20px;
  font-weight: bold;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.nested-main {
  flex: 1; /* 填充剩余空间 */
  overflow-y: auto; /* 允许垂直滚动 */
  padding: 0;
  transition: all 0.3s ease;
}

/* 菜单项基础样式 */
.menu-item {
  padding: 15px 20px;
  text-align: left;
  background-color: #787b81;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px; /* 图标和文字间距 */
  transition: all 0.3s ease;
  border-bottom: 1px solid #6c6f74;
}

/* 菜单项折叠状态样式 */
.menu-item-collapsed {
  justify-content: center; /* 内容居中 */
  padding: 15px 12px;
}

.menu-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: 0.9;
  background-color: #5d656b !important;
  border-color: #5d656b !important;
}

/* 主内容区样式 */
.main-col {
  height: 100vh;
  transition: all 0.3s ease;
}

.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #b3c0d1;
  color: #333;
  display: flex;
  align-items: center;
  flex-shrink: 0; /* 防止头部被压缩 */
  height: 60px !important;
}

.main {
  flex: 1; /* 填充剩余空间 */
  padding: 20px;
  overflow-y: auto; /* 允许垂直滚动 */
}

/* 响应式调整 */
/* 小屏幕（平板）及以下 */
@media screen and (max-width: 991px) {
  .aside-col {
    height: auto; /* 高度自适应 */
    max-height: 70vh; /* 限制最大高度 */
  }

  .main {
    padding: 15px;
  }
}

/* 超小屏幕（手机） */
@media screen and (max-width: 767px) {
  .aside-col {
    position: relative; /* 为可能的绝对定位子元素做准备 */
    height: auto;
    max-height: none;
  }

  .nested-main {
    max-height: 0; /* 默认折叠 */
    overflow: hidden;
  }

  .nested-main.collapsed {
    max-height: 0;
  }

  /* 当不折叠时显示菜单内容 */
  .nested-main:not(.collapsed) {
    max-height: 300px; /* 设置一个合适的最大高度 */
  }

  .main {
    padding: 10px;
  }

  .menu-item {
    padding: 12px 15px;
  }
}

/* 大屏幕及以上 */
@media screen and (min-width: 1200px) {
  .menu-item {
    padding: 15px 20px;
  }
}
</style>
