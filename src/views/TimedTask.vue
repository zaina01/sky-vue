<template>
  <div class="app-container">
    <!-- 响应式表单区域 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline responsive-form">
      <el-row :gutter="16" class="form-row" justify="space-between">
        <!-- 左侧：添加按钮和搜索条件 -->
        <el-col :xs="24" :sm="18" :md="18" :lg="18">
          <el-row :gutter="16">
            <!-- 操作按钮组 -->
            <el-col :xs="6" :sm="4" :md="4" :lg="5">
              <el-form-item>
                <el-button type="primary" @click="onAdd" :size="inputSize" class="action-button">
                  <el-icon><Plus /></el-icon>
                  <span v-if="!isMobile">添加</span>
                </el-button>
              </el-form-item>
            </el-col>

            <!-- 搜索条件 -->
            <el-col :xs="6" :sm="10" :md="8" :lg="9">
              <el-form-item label="任务名称" class="form-item-compact">
                <el-input
                  v-model="queryParams.jobName"
                  placeholder="请输入"
                  clearable
                  :size="inputSize"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="6" :sm="10" :md="8" :lg="8">
              <el-form-item label="任务状态" class="form-item-compact">
                <el-select
                  v-model="queryParams.jobStatus"
                  placeholder="请选择"
                  clearable
                  :style="{ width: isMobile ? '100px' : '120px' }"
                  :size="inputSize"
                >
                  <el-option
                    v-for="item in statusMaps"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="10" :md="8" :lg="2" class="query-button-col">
              <el-form-item>
                <el-button type="primary" @click="onSubmit" :size="inputSize" class="query-button">
                  <el-icon><Search /></el-icon>
                  <span>查询</span>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 右侧：查询按钮 -->
      </el-row>
    </el-form>

    <!-- 表格区域 -->
    <div class="table-container">
      <el-table
        :data="pagination.data"
        v-loading="loading"
        :height="tableHeight"
        :max-height="tableHeight"
        style="width: 100%"
        :class="{ 'compact-table': isMobile }"
        :size="inputSize"
        stripe
      >
        <!-- 任务ID列 -->
        <!-- <el-table-column
          prop="jobId"
          label="任务ID"
          :width="isMobile ? 50 : 70"
          align="center"
          :show-overflow-tooltip="true"
        /> -->
        <el-table-column label="序号" :width="isMobile ? 50 : 60" align="center">
          <template #default="scope">
            {{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <!-- 任务名称列 -->
        <el-table-column
          prop="jobName"
          label="任务名称"
          :min-width="isMobile ? 80 : 100"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <span :title="row.remark">{{ row.jobName }}</span>
          </template>
        </el-table-column>

        <!-- Cron表达式列 -->
        <el-table-column
          prop="cronExpression"
          label="cron表达式"
          :min-width="isMobile ? 100 : 130"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <span v-if="isMobile && row.cronExpression && row.cronExpression.length > 12">
              {{ row.cronExpression.substring(0, 10) + '...' }}
            </span>
            <span v-else>{{ row.cronExpression }}</span>
          </template>
        </el-table-column>

        <!-- 状态列 -->
        <el-table-column
          prop="jobStatus"
          label="状态"
          :width="isMobile ? 50 : 80"
          align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <el-switch
              :model-value="row.jobStatus"
              :before-change="() => beforeStatusChange(row)"
              :loading="statusLoading"
              inline-prompt
              :active-text="isMobile ? '' : '启用'"
              :inactive-text="isMobile ? '' : '禁用'"
              active-value="0"
              inactive-value="1"
              :size="inputSize"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </template>
        </el-table-column>

        <!-- 错过触发策略列 - 移动端隐藏 -->
        <el-table-column
          v-if="!isMobile"
          prop="misfirePolicy"
          label="错过触发策略"
          :width="110"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            {{ misfirePolicyMap[row.misfirePolicy] || row.misfirePolicy }}
          </template>
        </el-table-column>

        <!-- 并发策略列 - 移动端隐藏 -->
        <el-table-column
          v-if="!isMobile"
          prop="concurrent"
          label="并发策略"
          :width="100"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            {{ concurrentMap[row.concurrent] || row.concurrent }}
          </template>
        </el-table-column>

        <!-- 版本列 - 移动端隐藏 -->
        <el-table-column
          v-if="!isMobile"
          prop="version"
          label="版本"
          :width="70"
          align="center"
          :show-overflow-tooltip="true"
        />

        <!-- 作者列 - 移动端隐藏 -->
        <el-table-column
          v-if="!isMobile"
          prop="author"
          label="作者"
          :width="90"
          align="center"
          :show-overflow-tooltip="true"
        />

        <!-- 操作列 -->
        <el-table-column label="操作" :width="isMobile ? 180 : 370" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons" :class="{ 'compact-actions': isMobile }">
              <!-- 移动端显示图标按钮 -->
              <template v-if="isMobile">
                <el-button
                  :loading="row.executedStatus === '1'"
                  size="small"
                  type="primary"
                  @click="execute(row)"
                  circle
                  :icon="VideoPlay"
                />
                <el-button
                  size="small"
                  type="success"
                  @click="handleUser(row)"
                  circle
                  :icon="User"
                />
                <el-button
                  size="small"
                  type="warning"
                  @click="handleEdit(row)"
                  circle
                  :icon="Edit"
                />
              </template>

              <!-- 桌面端显示文字按钮 -->
              <template v-else>
                <el-button
                  size="small"
                  type="primary"
                  @click="execute(row)"
                  :loading="row.executedStatus === '1'"
                  >{{ row.executedStatus === '1' ? '运行中' : '运行' }}</el-button
                >
                <el-button size="small" type="success" @click="handleUser(row)">账号</el-button>
                <el-button size="small" type="info" @click="handleLog(row)">日志</el-button>
                <el-button size="small" type="danger" @click="handleEdit(row)">修改</el-button>
                <el-button size="small" type="warning" @click="goToPluginManagement(row)"
                  >管理</el-button
                >
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[8, 15, 20, 30]"
        :small="isMobile"
        :background="true"
        :layout="paginationLayout"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editFlag"
      :title="isMobile ? '修改任务' : '修改定时任务配置'"
      :width="dialogWidth"
      :align-center="true"
    >
      <el-form :model="form" :label-width="isMobile ? '80px' : '120px'">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24">
            <el-form-item label="cron表达式">
              <el-button @click="showCronEditor = true" :size="inputSize" :block="isMobile">
                {{ form.cronExpression ? form.cronExpression : '编辑cron表达式' }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="错过触发策略">
              <el-select
                v-model="form.misfirePolicy"
                :size="inputSize"
                :style="{ width: isMobile ? '100%' : '100%' }"
              >
                <el-option
                  v-for="item in misfirePolicyMaps"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="并发执行策略">
              <el-select
                v-model="form.concurrent"
                :size="inputSize"
                :style="{ width: isMobile ? '100%' : '100%' }"
              >
                <el-option
                  v-for="item in concurrentMaps"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" class="dialog-actions">
            <el-button type="danger" @click="editFlag = false" :size="inputSize"> 取消 </el-button>
            <el-button type="primary" @click="submitUpdate" :size="inputSize"> 确定 </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 添加插件对话框 -->
    <!-- <el-dialog
      v-model="addFlag"
      :title="isMobile ? '添加插件' : '安装定时任务插件'"
      :width="addDialogWidth"
    >
      <el-cascader
        v-model="uploadData.pluginLoaderId"
        :options="parentOptions"
        :props="cascaderProps"
        placeholder="请选择父加载器"
        style="width: 100%"
        clearable
        :size="inputSize"
      />
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="uploadUrl"
        :headers="uploadHeaders"
        :limit="1"
        accept=".jar"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :data="uploadData"
      >
        <template #trigger>
          <el-button type="primary" :size="inputSize" :block="isMobile">选择文件</el-button>
        </template>
        <el-button
          class="ml-3"
          type="success"
          @click="submitUpload"
          :size="inputSize"
          :block="isMobile"
        >
          安装
        </el-button>
        <template #tip>
          <div class="el-upload__tip text-red">提示: 只支持安装jar包。请勿安装不明来源的插件。</div>
        </template>
      </el-upload>
    </el-dialog> -->
    <el-dialog
      v-model="addFlag"
      :title="isMobile ? '添加插件' : '安装定时任务插件'"
      :width="addDialogWidth"
    >
      <div class="dialog-content-center">
        <!-- 独立的选择加载器控件 -->
        <div class="loader-selector-container">
          <el-cascader
            v-model="uploadData.pluginLoaderId"
            :options="parentOptions"
            :props="cascaderProps"
            placeholder="请选择类加载器"
            style="width: 100%"
            clearable
            :size="inputSize"
          />
        </div>

        <!-- 文件上传区域 -->
        <el-upload
          ref="upload"
          class="upload-demo"
          :action="uploadUrl"
          :headers="uploadHeaders"
          :limit="1"
          accept=".jar"
          :on-exceed="handleExceed"
          :auto-upload="false"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :data="uploadData"
        >
          <template #trigger>
            <el-button type="primary" :size="inputSize" :block="isMobile"> 选择文件 </el-button>
          </template>
          <el-button
            type="success"
            @click="submitUpload"
            :size="inputSize"
            :block="isMobile"
            style="margin-left: 12px"
          >
            安装
          </el-button>
          <template #tip>
            <div class="el-upload__tip text-red">
              提示: 只支持安装jar包。请勿安装不明来源的插件。
            </div>
          </template>
        </el-upload>
      </div>
    </el-dialog>

    <!-- Cron表达式编辑器 -->
    <el-dialog title="Cron表达式编辑器" v-model="showCronEditor" :width="dialogWidth" top="5vh">
      <cron-editor v-model="form.cronExpression" ref="cronEditorRef" />
      <template #footer>
        <el-button @click="showCronEditor = false" :size="inputSize">取消</el-button>
        <el-button type="primary" @click="validateCron" :size="inputSize">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { genFileId, ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, VideoPlay, Edit, User } from '@element-plus/icons-vue'
import CronEditor from '../components/CronEditor.vue'
import {
  updateJob,
  // deleteJob,
  selectJobById,
  selectJobList,
  updateStatus,
  run,
} from '../api/TimedTask'
import { getTree } from '@/api/pluginLoader'

import jobWebSocketService from '@/api/job-websocket'

const cronEditorRef = ref(null)
const router = useRouter()
const queryParams = ref({
  pageNum: 1,
  pageSize: 8,
  jobName: undefined,
  jobStatus: undefined,
})
const loading = ref(true)
const statusLoading = ref(false)
const pagination = ref({ data: [], total: 0 })
const upload = ref()
const addFlag = ref(false)
const editFlag = ref(false)
const form = ref({})
const showCronEditor = ref(false)

const treeData = ref([])
const uploadData = reactive({
  pluginLoaderId: null,
})

const jobConnected = ref(false)
const jobSubscriptionList = ref([])

// 响应式状态
const screenWidth = ref(window.innerWidth)
const isMobile = computed(() => screenWidth.value < 768)
const isTablet = computed(() => screenWidth.value >= 768 && screenWidth.value < 1024)

// 响应式计算属性
const inputSize = computed(() => (isMobile.value ? 'small' : 'default'))
const dialogWidth = computed(() => {
  if (isMobile.value) return '80%'
  if (isTablet.value) return '80%'
  return '60%'
})
const addDialogWidth = computed(() => {
  if (isMobile.value) return '60%'
  if (isTablet.value) return '50%'
  return '30%'
})

const paginationLayout = computed(() => {
  if (isMobile.value) return 'prev, pager, next, total'
  if (isTablet.value) return 'total, prev, pager, next'
  return 'total, sizes, prev, pager, next, jumper'
})

// 表格高度计算
const tableHeight = computed(() => {
  // 根据屏幕尺寸动态计算表格高度
  const baseHeight = isMobile.value ? 300 : 400
  return Math.max(baseHeight, window.innerHeight * 0.5)
})

// 窗口大小监听
const handleResize = () => {
  screenWidth.value = window.innerWidth
}

const cascaderProps = computed(() => ({
  value: 'id',
  label: 'name',
  children: 'children',
  checkStrictly: true,
  emitPath: false,
}))

const parentOptions = computed(() => {
  return treeData.value
})

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  getJobList()
  getLoaderTree()
  // startPolling()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  unsubscribeTask() // 清理所有订阅
  disconnectJobWebSocket()
})

// API相关函数
const uploadUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_APP_API_BASE_URL
  return `${baseUrl}/job/jar/install`
})

const uploadHeaders = reactive({
  Authorization: localStorage.getItem('userToken') || sessionStorage.getItem('userToken'),
})

const getLoaderTree = async () => {
  // 模拟刷新数据
  const { code, data, msg } = await getTree()
  if (code === 200) {
    treeData.value = data
  } else {
    ElMessage.error(msg)
  }
}

// 业务方法
const handleSizeChange = (newSize) => {
  queryParams.value.pageSize = newSize
  queryParams.value.pageNum = 1
  getJobList()
}

const handleCurrentChange = (newPage) => {
  queryParams.value.pageNum = newPage
  getJobList()
}

const beforeUpload = (file) => {
  if (!uploadData.pluginLoaderId) {
    ElMessage({
      message: '需要选择类加载器',
      type: 'error',
    })
  }
  const isJar = file.name.endsWith('.jar')
  const isLt2M = file.size / 1024 / 1024 < 20
  if (!isJar) {
    ElMessage({
      message: '只能安装jar包插件!',
      type: 'error',
    })
  }
  if (!isLt2M) {
    ElMessage({
      message: '文件大小不能超过 20MB!',
      type: 'error',
    })
  }
  return isJar && isLt2M
}

const validateCron = async () => {
  if (cronEditorRef.value) {
    const isValid = await cronEditorRef.value.localParseExpression(form.value.cronExpression)
    if (isValid != false) {
      showCronEditor.value = false
    }
  }
}

const submitUpload = () => {
  if (uploadData.pluginLoaderId) {
    upload.value.submit()
  } else {
    ElMessage({
      message: '未选择类加载器',
      type: 'error',
    })
  }
}

const uploadSuccess = (res, uploadFile, uploadFiles) => {
  if (res.code == 200) {
    ElMessage({
      message: res.msg,
      type: 'success',
    })
    uploadFiles.length = 0
    addFlag.value = false
    getJobList()
  } else {
    ElMessage({
      message: res.msg,
      type: 'error',
    })
    uploadFiles.length = 0
  }
}

const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

const handleUser = (rowData) => {
  router.push('/account/' + rowData.jobId)
}

const handleLog = (rowData) => {
  router.push('/log/' + rowData.jobId)
}
const setStatus = async (rowData) => {
  const { jobName } = rowData
  try {
    await ElMessageBox.confirm(`确定要变更 ${jobName} 任务状态吗?`, '状态变更', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 显示加载状态[6,7](@ref)
    statusLoading.value = true

    const { code, msg } = await updateStatus(rowData)
    if (code == 200) {
      ElMessage({
        message: msg,
        type: 'success',
      })
      // 请求成功后才实际更新状态
      rowData.jobStatus = rowData.jobStatus === '0' ? '1' : '0'
      return true
    } else {
      ElMessage({
        message: msg,
        type: 'error',
      })
      return false
    }
  } catch (error) {
    // 用户取消操作，不更新状态
    console.log('用户取消操作', error)
    return false
  } finally {
    statusLoading.value = false
  }
}

// before-change 处理函数
const beforeStatusChange = async (row) => {
  try {
    const result = await setStatus(row)
    return result // 返回 true 允许状态改变，false 阻止状态改变
  } catch (error) {
    console.log(error)
    return false
  }
}

// const handleDelete = (rowData) => {
//   const { jobId, jobName } = rowData
//   ElMessageBox.confirm(`确定要卸载 ${jobName} 任务吗?`, '删除', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning',
//   }).then(() => {
//     delJob(jobId)
//   })
// }

// const delJob = async (id) => {
//   const { code, msg } = await deleteJob(id)
//   if (code == 200) {
//     ElMessage({
//       message: msg,
//       type: 'success',
//     })
//   } else {
//     ElMessage({
//       message: msg,
//       type: 'error',
//     })
//   }
//   getJobList()
// }

const onAdd = () => {
  uploadData.pluginLoaderId = null
  addFlag.value = true
}

const submitUpdate = async () => {
  const { code, msg } = await updateJob(form.value)
  if (code == 200) {
    ElMessage({
      message: msg,
      type: 'success',
    })
    editFlag.value = false
    getJobList()
  }
}

const onSubmit = () => {
  getJobList()
}

const handleEdit = (rowData) => {
  editFlag.value = true
  getJob(rowData.jobId)
}

const getJobList = async () => {
  loading.value = true

  const { code, msg, data } = await selectJobList(queryParams.value)
  if (code == 200) {
    pagination.value.data = data.list
    pagination.value.total = data.total
    loading.value = false
    if (!jobConnected.value) {
      await connectJobWebSocket()
    }
    // 先取消所有旧的订阅
    unsubscribeTask()
    //       // 清除订阅列表
    jobSubscriptionList.value = []
    // 为新的数据重新订阅
    pagination.value.data.forEach((item) => {
      subscribeTask(item.jobId)
    })
  } else {
    ElMessage.error(msg)
  }
}

const getJob = async (id) => {
  const { code, msg, data } = await selectJobById(id)
  if (code == 200) {
    form.value = data
  } else {
    ElMessage.error(msg)
  }
}

const statusMaps = [
  { value: '0', label: '启用' },
  { value: '1', label: '禁用' },
]

const concurrentMap = {
  0: '允许并发',
  1: '禁止并发',
}

const concurrentMaps = [
  { value: '0', label: '允许并发' },
  { value: '1', label: '禁止并发' },
]

const misfirePolicyMap = {
  0: '默认策略',
  1: '激进策略',
  2: '立即执行',
  3: '下次执行',
}

const misfirePolicyMaps = [
  { value: '0', label: '默认策略' },
  { value: '1', label: '激进策略' },
  { value: '2', label: '立即执行' },
  { value: '3', label: '下次执行' },
]

const execute = (rowData) => {
  const { jobName } = rowData
  ElMessageBox.confirm(`确定要立即运行 ${jobName} 任务吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await runJob(rowData)
      // getJobList()
    })
    .catch((error) => {
      console.log(error)
    })
}

const runJob = async (job) => {
  const { code, msg } = await run(job)
  if (code == 200) {
    ElMessage({
      message: msg,
      type: 'success',
    })
  } else {
    ElMessage({
      message: msg,
      type: 'error',
    })
  }
}
// const POLLING_INTERVAL = 3000
// let pollTimer = null
// const startPolling = () => {
//   console.log('startPolling')
//   if (pollTimer) return
//   console.log('开始轮询请求数据...')
//   loading.value = true
//   pollTimer = setInterval(() => {
//     getJobList()
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

const goToPluginManagement = (row) => {
  if (row) {
    router.push('/loader/job/' + row.pluginLoaderId)
    // ElMessage.info(`跳转到加载器 ${selectedLoader.value.name} 的插件管理页面`)
    // 实际项目中这里应该进行路由跳转
  }
}
const disconnectJobWebSocket = async () => {
  jobWebSocketService.disconnect()
  jobWebSocketService.ws.off('onConnect')
  jobWebSocketService.ws.off('onDisconnect')
}
const connectJobWebSocket = async () => {
  const success = await jobWebSocketService.connect()
  if (success) {
    jobConnected.value = true
  }
}

//  unsubscribeTask 方法
const unsubscribeTask = () => {
  if (jobSubscriptionList.value && jobSubscriptionList.value.length > 0) {
    jobSubscriptionList.value.forEach((subId) => {
      console.log('取消订阅任务:', subId)
      if (subId) {
        jobWebSocketService.unsubscribeToTask(subId) // 使用 subId 取消订阅
      }
    })
    jobSubscriptionList.value = [] // 清空列表
  }
}

// // 添加监听
// watch(
//   () => [queryParams.value.pageNum, queryParams.value.pageSize, pagination.value.data],
//   (newValues, oldValues) => {
//     const [newCurrentPage, newPageSize, newData] = newValues
//     const [oldCurrentPage, oldPageSize, oldData] = oldValues || []
//     console.log('newCurrentPage', newCurrentPage, 'newPageSize', newPageSize, 'newData', newData)
//     console.log('oldCurrentPage', oldCurrentPage, 'oldPageSize', oldPageSize, 'oldData', oldData)
//     if (newData && newData.length > 0) {
//       // 取消所有旧的订阅
//       if (newCurrentPage == oldCurrentPage || newPageSize == oldPageSize || newData == oldData) {
//         return
//       }
//       unsubscribeTask()
//       // 清除订阅列表
//       jobSubscriptionList.value = []
//       // 为新的数据重新订阅
//       newData.forEach((item) => {
//         subscribeTask(item.jobId)
//       })
//     }
//   },
//   { deep: true, immediate: true }, // deep: true 深度监听，immediate: true 立即执行一次
// )

const subscribeTask = (taskId) => {
  console.log('订阅任务:', taskId)
  if (!taskId) return null

  const subId = jobWebSocketService.subscribeToTask(taskId, (data) => {
    console.log('收到任务更新:', data)
    if (data.code == 200) {
      // 找到对应的任务并更新
      const index = pagination.value.data.findIndex((item) => item.jobId === data.data.jobId)
      if (index !== -1) {
        pagination.value.data[index] = { ...pagination.value.data[index], ...data.data }
      }
    } else {
      console.log('更新失败:', data.msg)
    }
  })

  if (subId) {
    jobSubscriptionList.value.push(subId)
  }
  return subId
}
</script>

<style scoped>
/* 修复高度问题 - 关键修改 */
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

/* 表单区域 */
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

/* 查询按钮列样式 - 关键修改：右侧对齐 */
/* .query-button-col {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
} */

.query-button {
  min-width: 80px;
  margin-left: auto; /* 确保按钮靠右 */
}

/* 操作按钮样式 */
.action-button {
  min-width: 80px;
}

/* 表格容器 - 关键修复 */
.table-container {
  flex: 1;
  min-height: 200px;
  padding: 0 16px;
  overflow: auto;
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

/* 操作按钮组样式 */
.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
}

.compact-actions {
  gap: 2px;
}

.compact-actions .el-button {
  min-width: 28px;
  height: 28px;
}

/* 移动端单元格样式 */
.mobile-cell {
  font-size: 12px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
}

/* 对话框操作按钮 */
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

/* 上传组件样式 */
.upload-demo {
  text-align: center;
}

.ml-3 {
  margin-left: 12px;
}

.text-red {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 8px;
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
