<template>
  <div class="job-log-container">
    <!-- 任务基本信息卡片 -->
    <el-card class="log-info-card" shadow="hover" body-style="padding:5px 10px">
      <template #header>
        <div class="card-header">
          <span class="job-title">任务日志详情</span>
          <el-tag :type="statusTagType" class="status-tag">
            {{ statusText }}
          </el-tag>
        </div>
      </template>
      <div class="card-body">
        <el-descriptions :column="2" border>
          <!-- <el-descriptions-item label="任务ID">{{ jobLogData.jobId }}</el-descriptions-item> -->
          <el-descriptions-item label="任务名称">{{ jobLogData.jobName }}</el-descriptions-item>
          <!-- <el-descriptions-item label="创建时间">{{
          formatTime(jobLogData.createTime)
        }}</el-descriptions-item> -->
          <el-descriptions-item label="开始时间">{{
            formatTime(jobLogData.startTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{
            formatTime(jobLogData.stopTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="执行时长">{{ calculateDuration }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <!-- 日志内容展示区域 -->
    <el-card class="log-content-card" shadow="never">
      <template #header>
        <div class="log-header">
          <span class="log-title">执行日志</span>
          <el-button type="primary" link @click="copyLogContent" :icon="DocumentCopy">
            复制日志
          </el-button>
        </div>
      </template>

      <!-- 日志内容展示 -->
      <!-- <div class="log-content-wrapper"> -->
      <pre class="log-content">{{ jobMessage }}</pre>
      <div v-loading="loading"></div>
      <!-- </div> -->
    </el-card>
  </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'
import { selectJobLog } from '../api/TaskLog'

import jobLogWebSocketService from '@/api/jobLog-websocket'

// 接收props
const props = defineProps({
  jobLogId: {
    type: Number,
  },
})
const loading = ref(false)
const jobLogData = ref({})
// onMounted(() => {
//   getJobLog(props.jobLogId)
// })
const jobLogDetailSubscriptionList = ref([])

watch(
  () => props.jobLogId,
  (newId) => {
    if (newId) {
      getJobLog(newId)
    }
  },
)
const start = () => {
  console.log('getJobLog')
  jobLogData.value = {}
  getJobLog(props.jobLogId)
}
const getJobLog = async (id) => {
  if (!id) {
    ElMessage.error('未获取到日志id')
    console.log(id)
    return
  }
  const { code, msg, data } = await selectJobLog(id)
  if (code == 200) {
    jobLogData.value = data
    if (jobLogData.value.status === '2') {
      loading.value = true
      subscribeTask(props.jobLogId)
    }
  } else {
    ElMessage.error(msg)
  }
}
// 状态标签计算
const statusTagType = computed(() => {
  const statusMap = {
    0: 'success',
    1: 'danger',
    2: 'info',
    3: 'warning',
    4: 'primary',
  }
  return statusMap[jobLogData.value.status] || 'info'
})

// const POLLING_INTERVAL = 3000
// let pollTimer = null
// const startPolling = () => {
//   console.log('startPolling')
//   if (pollTimer) return
//   console.log('开始轮询请求数据...')
//   loading.value = true
//   pollTimer = setInterval(() => {
//     getJobLog(props.jobLogId)
//   }, POLLING_INTERVAL)
// }

// const stopPolling = () => {
//   if (pollTimer) {
//     clearInterval(pollTimer)
//     pollTimer = null
//     console.log('停止轮询')
//     loading.value = false
//   }
// }
// 监听状态变化
watch(
  () => jobLogData.value.status,
  (newStatus) => {
    console.log('newStatus:' + newStatus)
    if (newStatus !== '2') {
      unsubscribeTask()
      loading.value = false
    }
    // stopPolling()
  },
  // { immediate: true },
)
// 清理
onUnmounted(() => {
  console.log('onUnmounted')
  // stopPolling()
  unsubscribeTask()
})

const statusText = computed(() => {
  const statusMap = {
    0: '执行成功',
    1: '执行失败',
    2: '执行中',
    3: '系统退出',
    4: '等待执行',
  }
  return statusMap[jobLogData.value.status] || '未知状态'
})
// 执行时长计算
const calculateDuration = computed(() => {
  if (!jobLogData.value.startTime || !jobLogData.value.stopTime) {
    return ''
  }

  const start = new Date(jobLogData.value.startTime)
  const stop = new Date(jobLogData.value.stopTime)
  const duration = stop - start
  const second = duration / 1000
  return `${Math.floor(second / 60)}分 ${Math.floor(second % 60)}秒 ${duration % 1000} 毫秒`
})

// 时间格式化方法
const formatTime = (timeString) => {
  if (!timeString) return ''

  const date = new Date(timeString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 复制日志内容
const copyLogContent = async () => {
  try {
    await navigator.clipboard.writeText(jobLogData.value.jobMessage)
    ElMessage.success('日志内容已复制到剪贴板')
  } catch (err) {
    console.log(err)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = jobLogData.value.jobMessage
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('日志内容已复制')
  }
}

//  unsubscribeTask 方法
const unsubscribeTask = () => {
  console.log('unsubscribeTask')
  if (jobLogDetailSubscriptionList.value && jobLogDetailSubscriptionList.value.length > 0) {
    jobLogDetailSubscriptionList.value.forEach((subId) => {
      if (subId) {
        console.log('取消订阅任务:', subId)
        jobLogWebSocketService.unsubscribeToTask(subId) // 使用 subId 取消订阅
      }
    })
    jobLogDetailSubscriptionList.value = [] // 清空列表
  }
}
const subscribeTask = (taskId) => {
  console.log('订阅任务:', taskId)
  if (!taskId) return null

  const subId = jobLogWebSocketService.subscribeToTask(taskId, (data) => {
    console.log('收到任务更新1111:')
    if (data.code == 200) {
      if (data.type === 'update') {
        jobLogData.value = data.data
      }
    } else {
      console.log('更新失败:', data.msg)
    }
  })

  if (subId) {
    jobLogDetailSubscriptionList.value.push(subId)
  }
  return subId
}
defineExpose({
  // stopPolling,
  unsubscribeTask,
  start,
})
// 日志消息（直接使用props中的数据）
const jobMessage = computed(() => jobLogData.value.jobMessage)
</script>

<style scoped>
.job-log-container {
  padding: 2px;
  /* max-width: 1200px; */
  max-height: 95vh;
  margin: 0 auto;
}

.log-info-card {
  margin-bottom: 5px;
}

.card-header {
  height: 0.5vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.job-title {
  font-size: 15px;
  font-weight: 600;
}

.status-tag {
  font-size: 15px;
}
.log-header {
  height: 0.3vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
}

.log-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.log-content-wrapper {
  background: #f8f9fa;
  /* border: 1px solid #e0e0e0; */
  /* border-radius: 4px; */
  padding: 0px;
  max-height: 500px;
  overflow-y: auto;
}

.log-content {
  overflow: auto;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 55vh;
}
.el-descriptions {
  padding: 0;
}
/* 响应式设计 */
@media (max-width: 768px) {
  .job-log-container {
    padding: 10px;
  }

  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .log-content-wrapper {
    max-height: 300px;
  }
}

/* 滚动条样式 */
.log-content-wrapper::-webkit-scrollbar {
  width: 6px;
}

.log-content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.log-content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.log-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
