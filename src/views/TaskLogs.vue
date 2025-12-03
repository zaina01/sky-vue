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
    <el-divider />
    <!-- 日志表格 -->
    <el-table
      v-loading="loading"
      :data="logList"
      style="width: 100%"
      highlight-current-row
      @row-click="handleRowClick"
    >
      <el-table-column prop="jobLogId" min-width="80" label="序号" align="center" />
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import JobLogDetail from './JobLogDetail.vue' // 之前创建的日志详情组件
import { selectJobLogList } from '../api/TaskLog'
const jobLogDetailRef = ref(null)
const route = useRoute()
const jobId = ref(route.params.id)
// 模拟数据 - 在实际应用中应从API获取

// 响应式数据
const loading = ref(true)
const logList = ref([])
const detailDialogVisible = ref(false)
const currentLog = ref(null)

// 分页配置
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 状态映射
const statusMap = {
  0: { text: '执行成功', type: 'success' },
  1: { text: '执行失败', type: 'danger' },
  2: { text: '执行中', type: 'warning' },
  3: { text: '等待执行', type: 'info' },
}

// 计算属性 - 当前页数据
// const currentPageData = computed(() => {
//   const start = (pagination.currentPage - 1) * pagination.pageSize
//   const end = start + pagination.pageSize
//   return logList.value.slice(start, end)
// })

// 生命周期
onMounted(() => {
  fetchLogs()
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
      logList.value = data.list
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
  jobLogDetailRef.value.stopPolling()
}
const openDetail = () => {
  jobLogDetailRef.value.start()
}
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 90%;
}
.demo-form-inline {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}

.list-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 10px 0;
}
.el-form-item {
  margin: 0;
}

/* 表格行悬停效果 */
:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .job-log-container {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .job-log-container {
    padding: 10px;
  }

  .list-title {
    font-size: 16px;
  }

  /* 移动端对话框全屏 */
  :deep(.log-detail-dialog) {
    width: 95% !important;
    max-height: 90vh;
  }
}

/* 分页组件响应式 */
@media (max-width: 640px) {
  .pagination-container {
    justify-content: center;
  }

  :deep(.el-pagination) {
    justify-content: center;
  }
}
</style>
