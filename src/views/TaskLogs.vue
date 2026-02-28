<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" @click="refreshLogs" :icon="Refresh">刷新</el-button>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="refreshLogs">刷新</el-button> -->
      </el-form-item>
    </el-form>
    <!-- <el-divider /> -->
    <!-- 日志表格 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="pagination.data"
        style="width: 100%"
        highlight-current-row
        @row-click="handleRowClick"
      >
        <!-- <el-table-column prop="jobLogId" min-width="80" label="序号" align="center" /> -->
        <el-table-column label="序号" :min-width="isMobile ? 50 : 70" align="center">
          <template #default="scope">
            {{ (pagination.currentPage - 1) * pagination.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="jobName" label="任务名称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createTime" label="创建时间" min-width="180" align="center">
        <template #default="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column> -->
        <el-table-column prop="startTime" label="开始时间" min-width="180" align="center">
          <template #default="scope">
            {{ formatTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="stopTime" label="结束时间" min-width="180" align="center">
          <template #default="scope">
            {{ formatTime(scope.row.stopTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click.stop="viewLogDetail(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :small="true"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- </el-card> -->

    <!-- 日志详情对话框 -->

    <el-dialog
      v-model="detailDialogVisible"
      width="65%"
      :close-on-click-modal="false"
      align-center
      @close="closeDetail"
      @open="openDetail"
    >
      <job-log-detail ref="jobLogDetailRef" v-if="currentLog" :job-log-id="currentLog.jobLogId" />
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import JobLogDetail from './JobLogDetail.vue' // 之前创建的日志详情组件
import { selectJobLogList } from '../api/TaskLog'

import jobLogWebSocketService from '@/api/jobLog-websocket'

const jobLogDetailRef = ref(null)
const route = useRoute()
const jobId = ref(route.params.id)
// 模拟数据 - 在实际应用中应从API获取

const queryParams = ref({
  status: undefined,
})

// 响应式数据
const loading = ref(true)
const detailDialogVisible = ref(false)
const currentLog = ref(null)

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  data: [],
})
const screenWidth = ref(window.innerWidth)
const isMobile = computed(() => screenWidth.value < 768)
// 状态映射
const statusMap = {
  0: { text: '执行成功', type: 'success' },
  1: { text: '执行失败', type: 'danger' },
  2: { text: '执行中', type: 'info' },
  3: { text: '系统退出', type: 'warning' },
  4: { text: '等待执行', type: 'primary' },
}

const jobLogConnected = ref(false)
const jobLogSubscriptionList = ref([])

// 计算属性 - 当前页数据
// const currentPageData = computed(() => {
//   const start = (pagination.currentPage - 1) * pagination.pageSize
//   const end = start + pagination.pageSize
//   return logList.value.slice(start, end)
// })

// 生命周期
onMounted(async () => {
  fetchLogs()
  await connectJobLogWebSocket()
  subscribeTask(jobId.value)
})
onUnmounted(() => {
  unsubscribeTask() // 清理所有订阅
  disconnectJobLogWebSocket()
})
// 方法
const fetchLogs = async () => {
  loading.value = true
  try {
    // 模拟API调用
    const { code, msg, data } = await selectJobLogList(
      jobId.value,
      pagination.currentPage,
      pagination.pageSize,
    )
    if (code == 200) {
      pagination.data = data.list
      pagination.total = data.total
    } else {
      ElMessage.error(msg)
    }
    // 在实际应用中，这里应该是API调用
    // const response = await axios.get('/api/job-logs', {
    //   params: {
    //     page: pagination.currentPage,
    //     size: pagination.pageSize
    //   }
    // })

    // 使用模拟数据
  } catch (error) {
    ElMessage.error('获取日志列表失败')
    console.error('Error fetching logs:', error)
  } finally {
    loading.value = false
  }
}

const refreshLogs = () => {
  pagination.currentPage = 1
  fetchLogs()
}

const handleSizeChange = (newSize) => {
  pagination.pageSize = newSize
  pagination.currentPage = 1
  fetchLogs()
}

const handleCurrentChange = (newPage) => {
  pagination.currentPage = newPage
  fetchLogs()
}

const getStatusTagType = (status) => {
  return statusMap[status]?.type || 'info'
}

const getStatusText = (status) => {
  return statusMap[status]?.text || '未知状态'
}

const formatTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return date.toLocaleString('zh-CN')
}

const handleRowClick = (row) => {
  currentLog.value = row
  detailDialogVisible.value = true
}

const viewLogDetail = (row) => {
  currentLog.value = row
  detailDialogVisible.value = true
}
const closeDetail = () => {
  console.log(jobLogDetailRef)
  // jobLogDetailRef.value.stopPolling()
  jobLogDetailRef.value.unsubscribeTask()
}
const openDetail = () => {
  jobLogDetailRef.value.start()
}

const disconnectJobLogWebSocket = async () => {
  jobLogWebSocketService.disconnect()
  jobLogWebSocketService.ws.off('onConnect')
  jobLogWebSocketService.ws.off('onDisconnect')
}
const connectJobLogWebSocket = async () => {
  const success = await jobLogWebSocketService.connect()
  if (success) {
    jobLogConnected.value = true
  }
}
//  unsubscribeTask 方法
const unsubscribeTask = () => {
  if (jobLogSubscriptionList.value && jobLogSubscriptionList.value.length > 0) {
    jobLogSubscriptionList.value.forEach((subId) => {
      if (subId) {
        console.log('取消订阅任务:', subId)
        jobLogWebSocketService.unsubscribeToTask(subId) // 使用 subId 取消订阅
      }
    })
    jobLogSubscriptionList.value = [] // 清空列表
  }
}
const subscribeTask = (taskId) => {
  console.log('订阅任务:', taskId)
  if (!taskId) return null

  const subId = jobLogWebSocketService.subscribeToTask(taskId, (data) => {
    console.log('收到任务更新:', data)
    if (data.code == 200) {
      if (data.type === 'insert') {
        pagination.data.unshift(data.data)
        pagination.data.pop()
      } else {
        // 找到对应的任务并更新
        const index = pagination.data.findIndex((item) => item.jobLogId === data.data.jobLogId)
        if (index !== -1) {
          pagination.data[index] = { ...pagination.data[index], ...data.data }
        }
      }
    } else {
      console.log('更新失败:', data.msg)
    }
  })

  if (subId) {
    jobLogSubscriptionList.value.push(subId)
  }
  return subId
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}
.demo-form-inline {
  padding: 16px;
  flex-shrink: 0;
}
.form-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
}
/* 表单项紧凑样式 */
.form-item-compact :deep(.el-form-item__label) {
  padding-right: 8px;
}
.list-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
/* 分页容器 - 关键修改：确保完全居中 */
.pagination-container {
  padding: 16px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.el-form-item {
  margin: 0;
}
/* 表格容器 - 关键修复 */
.table-container {
  flex: 1;
  min-height: 200px;
  padding: 0 16px;
  overflow: auto;
}
/* 表格行悬停效果 */
:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 响应式媒体查询 */
@media (max-width: 768px) {
  .app-container {
    padding: 0;
  }

  .demo-form-inline {
    padding: 12px;
  }

  .table-container {
    padding: 0 12px;
  }

  .pagination-container {
    padding: 12px;
    justify-content: center;
  }

  .form-row .el-col {
    margin-bottom: 8px;
  }

  .action-buttons .el-button {
    min-width: auto;
    padding: 6px 8px;
  }

  .dialog-actions {
    flex-direction: column;
    gap: 8px;
  }

  .dialog-actions .el-button {
    width: 100%;
  }

  /* 移动端查询按钮样式 */
  .query-button-col {
    justify-content: flex-end !important;
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .demo-form-inline {
    padding: 8px;
  }

  .table-container {
    padding: 0 8px;
  }

  .action-buttons {
    gap: 2px;
  }

  .action-buttons .el-button {
    padding: 4px 6px;
    font-size: 12px;
  }

  .query-button-col {
    margin-top: 8px;
  }
}

/* 确保表格在移动端正确显示 */
:deep(.el-table) {
  font-size: 14px;
}

.compact-table :deep(.el-table__row) {
  height: 40px;
}

/* 表格滚动条优化 */
:deep(.el-table__body-wrapper) {
  scrollbar-width: thin;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 6px;
  height: 6px;
}

:deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  background-color: #c0c4cc;
  border-radius: 3px;
}

/* 方法1：弹性布局居中 */
.dialog-content-center {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
  width: 100%;
}

/* 控制选择器宽度，使其在居中时不会太宽 */
.loader-selector-container {
  width: 60%; /* 调整这个值来匹配图片中的宽度 */
  max-width: 400px; /* 最大宽度限制 */
  margin-bottom: 20px;
  text-align: center; /* 文本也居中（如果需要） */
}
</style>
