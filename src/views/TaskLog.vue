<template>
  <div class="app-container">
    <div class="collapse-container">
      <el-collapse
        v-model="activeName"
        accordion
        v-infinite-scroll="load"
        :infinite-scroll-immediate="false"
        :infinite-scroll-disabled="disabled"
        :infinite-scroll-delay="200"
      >
        <el-collapse-item
          v-for="value in logData"
          :key="value.jobLogId"
          :title="titleText(value)"
          :name="value.jobLogId"
        >
          <el-text>{{ value.jobMessage }}</el-text>
        </el-collapse-item>

        <!-- 加载状态提示 -->
        <div v-if="pageNum < pages" class="loading-text">
          <i class="el-icon-loading"></i> 加载中...
        </div>
        <div v-else-if="logData.length > 0" class="no-more-text">没有更多数据了</div>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { selectJobLogList } from '../api/TaskLog'
import { ElMessage } from 'element-plus'

const route = useRoute()
const jobId = ref(route.params.id)
const activeName = ref('')
const logData = ref([])
const pageNum = ref(1)
const pageSize = ref(15)
const pages = ref(1)
const isLoading = ref(false)

const disabled = computed(() => isLoading.value || pages.value <= pageNum.value)

const titleText = (value) => {
  return `开始时间:${formatDate(value.startTime)} | 停止时间:${formatDate(value.stopTime)} | 状态:${formatStasus(value.status)}`
}

onMounted(() => {
  getData()
})

const getData = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    const { code, msg, data } = await selectJobLogList(jobId.value, pageNum.value, pageSize.value)
    if (code === 200) {
      logData.value.push(...data.list)
      pages.value = data.pages
    } else {
      ElMessage.error(msg)
    }
  } catch (error) {
    ElMessage.error('数据加载失败')
    console.error('加载错误:', error)
  } finally {
    isLoading.value = false
  }
}

const load = () => {
  if (disabled.value) return
  pageNum.value += 1
  console.log(pageNum.value)
  getData()
}

const stasusMap = {
  0: '成功',
  1: '失败',
  2: '执行中',
}

function formatStasus(val) {
  return stasusMap[val] || '未知状态'
}

function formatDate(inputDateStr) {
  if (!inputDateStr) return '未获取到'

  try {
    const date = new Date(inputDateStr)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.log(error)
    return '日期格式错误'
  }
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh; /* 使用视口高度确保容器有固定高度 */
  padding: 10px;
  box-sizing: border-box;
}

.collapse-container {
  height: 100%;
  overflow-y: auto; /* 确保容器可滚动 */
  /* border: 1px solid #e6e6e6; */
  /* border-radius: 4px; */
  padding: 10px;
}

.loading-text,
.no-more-text {
  text-align: center;
  padding: 15px;
  color: #909399;
  font-size: 14px;
}

.el-collapse {
  border: none;
}

.el-collapse-item__header {
  font-weight: bold;
}
</style>
