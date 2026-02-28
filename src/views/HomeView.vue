<template>
  <div class="common-layout">
    <el-row class="layout-row" :gutter="0">
      <!-- 侧边栏 -->
      <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3" class="aside-col">
        <div class="aside-content">
          <div class="nested-header">
            <div class="logo-area" v-if="!isCollapsed">
              <span class="logo-text">sky</span>
              <span class="logo-subtitle">管理系统</span>
            </div>
            <div class="logo-area" v-else>
              <span class="logo-text">Sky</span>
            </div>
            <el-icon class="collapse-icon" @click="toggleCollapse">
              <Expand />
            </el-icon>
          </div>
          <div class="nested-main" :class="{ collapsed: isCollapsed }">
            <div
              class="menu-item"
              :class="{
                'menu-item-collapsed': isCollapsed,
                'menu-item-active': route.path === '/timedtask',
              }"
              @click="handleMenuClick('/timedtask')"
            >
              <div class="menu-icon">
                <el-icon><House /></el-icon>
              </div>
              <span v-if="!isCollapsed" class="menu-text">定时任务</span>
              <el-tooltip v-else effect="dark" content="定时任务" placement="right">
                <span></span>
              </el-tooltip>
            </div>
            <div
              class="menu-item"
              :class="{
                'menu-item-collapsed': isCollapsed,
                'menu-item-active': route.path === '/notify',
              }"
              @click="handleMenuClick('/notify')"
            >
              <div class="menu-icon">
                <el-icon><Message /></el-icon>
              </div>
              <span v-if="!isCollapsed" class="menu-text">推送管理</span>
              <el-tooltip v-else effect="dark" content="推送管理" placement="right">
                <span></span>
              </el-tooltip>
            </div>
            <div
              class="menu-item"
              :class="{
                'menu-item-collapsed': isCollapsed,
                'menu-item-active': route.path === '/loader',
              }"
              @click="handleMenuClick('/loader')"
            >
              <div class="menu-icon">
                <el-icon><DataAnalysis /></el-icon>
              </div>
              <span v-if="!isCollapsed" class="menu-text">加载器管理</span>
              <el-tooltip v-else effect="dark" content="加载器管理" placement="right">
                <span></span>
              </el-tooltip>
            </div>
            <div
              class="menu-item"
              :class="{
                'menu-item-collapsed': isCollapsed,
                'menu-item-active': route.path === '/user',
              }"
              @click="handleMenuClick('/user')"
            >
              <div class="menu-icon">
                <el-icon><User /></el-icon>
              </div>
              <span v-if="!isCollapsed" class="menu-text">个人中心</span>
              <el-tooltip v-else effect="dark" content="个人中心" placement="right">
                <span></span>
              </el-tooltip>
            </div>

            <div
              class="menu-item"
              :class="{
                'menu-item-collapsed': isCollapsed,
                'menu-item-active': route.path === '/system',
              }"
              @click="handleMenuClick('/system')"
            >
              <div class="menu-icon">
                <el-icon><More /></el-icon>
              </div>
              <span v-if="!isCollapsed" class="menu-text">关于系统</span>
              <el-tooltip v-else effect="dark" content="关于系统" placement="right">
                <span></span>
              </el-tooltip>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 主内容区 -->
      <el-col :xs="24" :sm="16" :md="18" :lg="20" :xl="21" class="main-col">
        <div class="main-content">
          <el-header class="header">
            <!-- 返回按钮和标题区域 -->
            <div class="header-left">
              <el-page-header
                title="返回"
                @back="onBack"
                :disabled="isHomePage"
                class="page-header"
              >
                <template #content>
                  <span class="page-title"> {{ pageTitle }} </span>
                </template>
              </el-page-header>
            </div>

            <!-- 右侧用户信息 -->
            <div class="header-right">
              <div class="user-info" @click="handleMenuClick('/user')">
                <el-avatar :size="32" :src="userStore.userAvatar" class="user-avatar" />
                <span class="username">{{ userStore.displayName }}</span>
              </div>
            </div>
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
import { Expand, House, DataAnalysis, User, More, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const isCollapsed = ref(false)
const screenWidth = ref(window.innerWidth)

const isHomePage = computed(() => route.path === '/timedtask')
const pageTitle = computed(() => route.meta?.title || '首页')

const handleResize = () => {
  screenWidth.value = window.innerWidth
  if (screenWidth.value < 768) {
    isCollapsed.value = true
  } else {
    isCollapsed.value = false
  }
}

const toggleCollapse = () => {
  if (screenWidth.value < 768) {
    isCollapsed.value = !isCollapsed.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}

const handleMenuClick = (path) => {
  router.push(path)
  if (screenWidth.value < 768) {
    isCollapsed.value = true
  }
}

const onBack = () => {
  if (isHomePage.value) {
    ElMessage.error('已经是首页了')
    return
  }
  router.back()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 全局背景为白色 */
.common-layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #badcfc;
}

/* 布局容器 */
.layout-row {
  height: 100%;
  margin: 0 !important;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* ========== 侧边栏样式 ========== */
.aside-col {
  height: 100vh;
  background: #ffffff;
  /* border-right: 1px solid #f0f0f0; */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);
}

.aside-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 2px solid #52afd5;
}

/* 侧边栏头部 - 使用天蓝色渐变 */
.nested-header {
  background: linear-gradient(135deg, #52afd5 0%, #68b2dd 100%);
  color: white;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

/* 添加一些装饰性元素 */
.nested-header::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  transform: translate(30px, -30px);
  border-radius: 50%;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-subtitle {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 2px;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.2);
  z-index: 1;
}

.collapse-icon:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(180deg);
}

/* 菜单区域 */
.nested-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  transition: all 0.3s ease;
  background: #badcfc;
}

/* 自定义滚动条 */
.nested-main::-webkit-scrollbar {
  width: 4px;
}

.nested-main::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 2px;
}

.nested-main::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #52afd5 0%, #6bb1da 100%);
  border-radius: 2px;
}

.nested-main::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #76c4e8 0%, #5a9bc0 100%);
}

/* 菜单项 */
.menu-item {
  margin: 8px 12px;
  padding: 12px 16px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  position: relative;
  overflow: hidden;
}

/* 菜单项悬停效果 */
.menu-item:hover {
  border-color: #52afd5;
  box-shadow: 0 4px 12px rgba(135, 206, 235, 0.15);
  transform: translateY(-1px);
}

.menu-item:hover .menu-icon {
  color: #52afd5;
  transform: scale(1.1);
}

.menu-item:hover .menu-text {
  color: #1890ff;
}

/* 激活菜单项 - 使用天蓝色渐变 */
.menu-item-active {
  background: linear-gradient(135deg, #52afd5 0%, #88c8ee 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(135, 206, 235, 0.3);
}

.menu-item-active .menu-icon {
  color: white;
}

.menu-item-active .menu-text {
  color: white;
  font-weight: 500;
}

/* 菜单折叠状态 */
.menu-item-collapsed {
  justify-content: center;
  padding: 12px;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.3s ease;
}

.menu-text {
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 激活指示器 */
.menu-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: white;
  border-radius: 0 2px 2px 0;
}

.menu-item-collapsed.menu-item-active::before {
  display: none;
}

/* ========== 主内容区样式 ========== */
.main-col {
  height: 100vh;
  transition: all 0.3s ease;
}

.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #52afd5;
  overflow: hidden;
  border: 2px solid #52afd5;
}

/* 头部样式 - 修改为左右布局 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 70px !important;
  padding: 0 24px;
  /* border-bottom: 1px solid #f0f0f0; */
  /* box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03); */
  position: relative;
  color: white;
  /* background: linear-gradient(135deg, #52afd5 0%, #68b2dd 100%); */
  background: linear-gradient(135deg, #52afd5 0%, #68b2dd 100%);
  display: flex;
  overflow: hidden;
}
/* 添加一些装饰性元素 */
.header::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
  height: 100px;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  transform: translate(-30px, -30px);
  border-radius: 0% 0% 30% 155%;
}

/* .header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50;
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  transform: translate(-30px, -30px);
  border-radius: 45% 50% 50% 50%;
} */

/* 左侧区域 - 返回按钮和标题 */
.header-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.page-header {
  display: flex;
  align-items: center;
}

.page-header :deep(.el-page-header__left) {
  margin-right: 16px;
}

.page-header :deep(.el-page-header__title) {
  font-size: 16px;
  color: #666;
}

.page-header :deep(.el-page-header__content) {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #faf5f5;
  position: relative;
  padding-left: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #52afd5 0%, #b0e2ff 100%);
  border-radius: 2px;
}

/* 右侧区域 - 用户信息 */
.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  background: #fafafa;
  border-radius: 20px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: fit-content;
}

.user-info:hover {
  background: #f5f5f5;
  border-color: #52afd5;
  box-shadow: 0 2px 8px rgba(135, 206, 235, 0.1);
  transform: translateY(-1px);
}

.user-avatar {
  transition: transform 0.3s ease;
}

.user-info:hover .user-avatar {
  transform: scale(1.1);
}

.username {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
}

/* 主内容区 */
.main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #fafbfc;
}

/* 自定义主内容区滚动条 */
.main::-webkit-scrollbar {
  width: 8px;
}

.main::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.main::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #52afd5 0%, #9dd8fa 100%);
  border-radius: 4px;
}

.main::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #76c4e8 0%, #93cdfa 100%);
}

/* ========== 响应式调整 ========== */
/* 平板及以下 */
@media screen and (max-width: 991px) {
  .header {
    padding: 0 16px;
  }

  .main {
    padding: 16px;
  }

  .menu-item {
    margin: 6px 8px;
    padding: 10px 12px;
  }

  .page-title {
    font-size: 18px;
  }

  .username {
    font-size: 13px;
  }
}

/* 手机 */
@media screen and (max-width: 767px) {
  .aside-col {
    height: auto;
  }

  .nested-main {
    max-height: 0;
    overflow: hidden;
  }

  .nested-main.collapsed {
    max-height: 0;
  }

  .nested-main:not(.collapsed) {
    max-height: 300px;
  }

  .logo-text {
    font-size: 20px;
  }

  .logo-subtitle {
    font-size: 10px;
  }

  .header {
    padding: 0 12px;
    height: 60px !important;
  }

  .page-header :deep(.el-page-header__left) {
    margin-right: 8px;
  }

  .page-header :deep(.el-page-header__title) {
    font-size: 14px;
  }

  .page-title {
    font-size: 16px;
    padding-left: 8px;
  }

  .page-title::before {
    width: 3px;
    height: 16px;
  }

  .user-info {
    padding: 4px 8px;
    gap: 8px;
  }

  .user-avatar {
    width: 28px !important;
    height: 28px !important;
  }

  .username {
    font-size: 12px;
  }

  .main {
    padding: 12px;
  }

  .menu-item {
    margin: 4px 6px;
    padding: 8px 10px;
  }
}

/* 大屏幕 */
@media screen and (min-width: 1200px) {
  .header {
    padding: 0 32px;
  }

  .page-title {
    font-size: 22px;
  }

  .user-info {
    padding: 8px 16px;
  }

  .username {
    font-size: 15px;
  }

  .menu-item {
    margin: 10px 16px;
    padding: 14px 20px;
  }

  .logo-text {
    font-size: 26px;
  }

  .main {
    padding: 3px;
  }
}

/* 超小屏幕 */
@media screen and (max-width: 480px) {
  .header {
    flex-direction: column;
    height: auto !important;
    padding: 12px;
    gap: 8px;
  }

  .header-left,
  .header-right {
    width: 100%;
  }

  .header-right {
    justify-content: flex-end;
  }

  .user-info {
    padding: 3px 6px;
  }

  .user-avatar {
    width: 24px !important;
    height: 24px !important;
  }

  .username {
    font-size: 11px;
  }

  .page-header {
    width: 100%;
  }

  .page-header :deep(.el-page-header__left) {
    display: none;
  }

  .page-title {
    font-size: 18px;
    padding-left: 0;
  }

  .page-title::before {
    display: none;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-item {
  animation: fadeInUp 0.3s ease-out;
}

.menu-item:nth-child(1) {
  animation-delay: 0.1s;
}
.menu-item:nth-child(2) {
  animation-delay: 0.2s;
}
.menu-item:nth-child(3) {
  animation-delay: 0.3s;
}

.header-right {
  animation: slideInRight 0.5s ease-out;
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

/* 主题色装饰元素 */
.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(117deg, transparent 0%, #0a6ee9 50%, transparent 100%);
  opacity: 0.5;
}
</style>
