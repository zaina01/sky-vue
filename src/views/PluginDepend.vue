<template>
  <div class="app-container">
    <!-- 查询表单区域 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline responsive-form">
      <el-row :gutter="16" class="form-row" justify="space-between">
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
          <el-row :gutter="16">
            <!-- 操作按钮组 -->
            <el-col :xs="3" :sm="5" :md="3" :lg="2">
              <el-form-item>
                <el-button
                  type="primary"
                  @click="onAdd"
                  :size="inputSize"
                  :disabled="disabledButton"
                  class="action-button"
                >
                  <el-icon><Plus /></el-icon>
                  <span v-if="!isMobile">添加</span>
                </el-button>
              </el-form-item>
            </el-col>

            <!-- 搜索条件 -->
            <el-col :xs="10" :sm="10" :md="8" :lg="5">
              <el-form-item label="Group ID" class="form-item-compact">
                <el-input
                  v-model="queryParams.groupId"
                  placeholder="请输入Group ID"
                  clearable
                  :size="inputSize"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="10" :sm="10" :md="8" :lg="5">
              <el-form-item label="Artifact ID" class="form-item-compact">
                <el-input
                  v-model="queryParams.artifactId"
                  placeholder="请输入Artifact ID"
                  clearable
                  :size="inputSize"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="10" :sm="10" :md="8" :lg="5">
              <el-form-item label="Version" class="form-item-compact">
                <el-input
                  v-model="queryParams.version"
                  placeholder="请输入Version"
                  clearable
                  :size="inputSize"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="4" :sm="10" :md="8" :lg="2" class="query-button-col">
              <el-form-item>
                <el-button type="primary" @click="onSubmit" :size="inputSize" class="query-button">
                  <el-icon><Search /></el-icon>
                  <span>查询</span>
                </el-button>
              </el-form-item>
            </el-col>
            <!-- <el-col :xs="4" :sm="10" :md="8" :lg="2" class="query-button-col">
              <el-form-item>
                <el-button @click="onReset" :size="inputSize">
                  <el-icon><Refresh /></el-icon>
                  <span v-if="!isMobile">刷新</span>
                </el-button>
              </el-form-item>
            </el-col> -->
            <el-col :xs="10" :sm="8" :md="8" :lg="3">
              <el-form-item label="路径" class="form-item-compact">
                <el-tooltip
                  v-if="targetObject?.fullPath"
                  :content="targetObject.fullPath"
                  placement="top-start"
                  :disabled="!shouldShowTooltip"
                >
                  <el-tag type="info" effect="dark" class="path-tag">
                    {{ displayText }}
                  </el-tag>
                </el-tooltip>
                <el-tag v-else type="info" effect="dark"> 无路径 </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
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
        <el-table-column label="序号" :width="isMobile ? 80 : 100" align="center">
          <template #default="scope">
            {{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="groupId"
          label="Group ID"
          :min-width="isMobile ? 120 : 180"
          align="center"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="artifactId"
          label="Artifact ID"
          :min-width="isMobile ? 120 : 180"
          align="center"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="version"
          label="Version"
          :width="isMobile ? 60 : 75"
          align="center"
        />

        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.deleteFlag == '1' ? 'danger' : getStatusTagType(scope.row.status)"
              size="small"
            >
              <el-tooltip
                v-if="scope.row.deleteFlag == '1'"
                content="删除操作需要重启后才生效"
                placement="top"
              >
                {{ '等待重启' }}
              </el-tooltip>
              <span v-else> {{ getStatusText(scope.row.status) }}</span>
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="message" label="日志" :width="isMobile ? 60 : 75" align="center">
          <template #default="scope">
            <!-- 如果message为空，显示"-" -->
            <div v-if="!scope.row.message || scope.row.message.trim() === ''">-</div>
            <div v-else class="log-icon-wrapper">
              <el-tooltip content="点击查看详情" placement="top">
                <el-icon
                  :size="isMobile ? 16 : 20"
                  class="log-icon"
                  @click="showLogDetail(scope.row)"
                >
                  <Document />
                </el-icon>
              </el-tooltip>

              <!-- 如果消息很长，显示省略号提示 -->
              <!-- <span v-if="scope.row.message.length > 50" class="message-length">
                {{ scope.row.message.length }}字
              </span> -->
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="创建时间"
          :width="isMobile ? 140 : 180"
          align="center"
        >
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="pluginLoaderId"
          label="加载器ID"
          :width="isMobile ? 100 : 120"
          align="center"
        /> -->

        <el-table-column label="操作" :width="isMobile ? 120 : 180" align="center" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons" :class="{ 'compact-actions': isMobile }">
              <el-button
                :disabled="row.deleteFlag == '1' || disabledButton"
                size="small"
                type="danger"
                @click="handleDelete(row)"
                :icon="Delete"
              >
                <span v-if="!isMobile">删除</span>
              </el-button>
              <el-button size="small" type="primary" @click="goToDependDetail(row)" :icon="Files">
                <span v-if="!isMobile">查看依赖</span>
              </el-button>
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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="dialogWidth"
      :fullscreen="isMobile"
      align-center
      center
      :show-close="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <div class="log-dialog-content" :class="{ mobile: isMobile }">
        <!-- 日志元信息 -->
        <div v-if="currentLog.createTime || currentLog.type" class="log-meta">
          <span class="log-time">
            {{ `${currentLog.groupId}:${currentLog.artifactId}:${currentLog.version}` }}
          </span>
          <br />
          <el-tag v-if="currentLog.status" :type="getStatusTagType(currentLog.status)" size="small">
            {{ getStatusText(currentLog.status) }}
          </el-tag>
          <span v-if="currentLog.createTime" class="log-time">
            {{ formatTime(currentLog.createTime) }}
          </span>
        </div>

        <!-- 日志内容区域 -->
        <div class="log-content-wrapper">
          <pre class="log-text" ref="logContentRef">{{ currentLog.message }}</pre>
        </div>

        <!-- 操作按钮 -->
        <div class="log-actions">
          <el-button type="primary" size="small" @click="copyMessage(currentLog.message)">
            <el-icon><CopyDocument /></el-icon>
            复制
          </el-button>
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    <!-- 添加依赖对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isMobile ? '添加依赖' : '添加新依赖'"
      :width="dialogWidth"
      :align-center="true"
    >
      <template #header="{ titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass">{{ isMobile ? '添加依赖' : '添加新依赖' }}</h4>
          <el-switch
            v-model="addType"
            class="mb-2"
            active-text="maven依赖"
            inactive-text="本地jar包"
            @change="addTypeChange"
          />
        </div>
      </template>
      <el-form v-if="addType" :model="form" :label-width="isMobile ? '80px' : '100px'">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="Group ID">
              <el-input v-model="form.groupId" placeholder="请输入Group ID" :size="inputSize" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Artifact ID">
              <el-input
                v-model="form.artifactId"
                placeholder="请输入Artifact ID"
                :size="inputSize"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="Version">
              <el-input v-model="form.version" placeholder="请输入Version" :size="inputSize" />
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="12">
            <el-form-item label="加载器ID">
              <el-input
                v-model="form.pluginLoaderId"
                placeholder="请输入加载器ID"
                :size="inputSize"
              />
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" class="dialog-actions">
            <el-button type="danger" @click="addDialogVisible = false" :size="inputSize">
              取消
            </el-button>
            <el-button type="primary" @click="submitAdd" :size="inputSize"> 确定 </el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-upload
        v-else
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
          <div class="el-upload__tip text-red">提示: 只支持jar包。请勿安装不明来源的jar包。</div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox, genFileId } from 'element-plus'
import { Plus, Search, Delete, Document, Files } from '@element-plus/icons-vue'
import { pluginDependList, removePluginDepend, installPluginDepend } from '@/api/pluginDepend'
import { useRoute, useRouter } from 'vue-router'
import { getTree } from '@/api/pluginLoader'

const route = useRoute()
const router = useRouter()
// 响应式数据
const loading = ref(false)
const isMobile = ref(window.innerWidth < 768)
const addDialogVisible = ref(false)

const dialogVisible = ref(false)
const currentLog = ref({})
const logContentRef = ref(null)

const treeData = ref([])

const addType = ref(true)
const upload = ref()
const uploadData = reactive({
  pluginLoaderId: route.params.id,
})

const showLogDetail = (log) => {
  currentLog.value = { ...log }
  dialogVisible.value = true

  // 确保DOM更新后，如果有高亮需求可以在这里处理
  nextTick(() => {
    if (logContentRef.value) {
      // 自动滚动到顶部
      logContentRef.value.scrollTop = 0
    }
  })
}

const maxLength = 25
const shouldShowTooltip = computed(() => {
  return targetObject.value?.fullPath?.length > maxLength
})
const displayText = computed(() => {
  const text = targetObject.value?.fullPath
  if (!text) return '无路径'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
})
const disabledButton = computed(() => {
  const parentId = targetObject.value?.parentId
  if (!parentId) return true
  if (parentId === 0) return true
  return false
})
const targetObject = computed(() => {
  return findObjectById(treeData.value, Number(route.params.id))
})
const findObjectById = (arr, targetId) => {
  for (const item of arr) {
    // 如果当前对象就是目标
    if (item.id === targetId) {
      return item
    }
    // 如果有子节点，递归查找
    if (item.children && item.children.length > 0) {
      const found = findObjectById(item.children, targetId)
      if (found) {
        return found
      }
    }
  }
  return null
}

const getLoaderTree = async () => {
  const { code, data, msg } = await getTree()
  if (code === 200) {
    treeData.value = data
  } else {
    ElMessage.error(msg)
  }
}

const formatTime = (time) => {
  if (!time) return ''
  try {
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch (e) {
    console.log(e)
    return time
  }
}
const copyMessage = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    console.log(err)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('已复制到剪贴板')
  }
}

// 查询参数
const queryParams = reactive({
  groupId: '',
  artifactId: '',
  version: '',
  pluginLoaderId: route.params.id,
  pageNum: 1,
  pageSize: 15,
})

// 分页数据
const pagination = reactive({
  data: [],
  total: 0,
})

// 表单数据
const form = reactive({
  groupId: '',
  artifactId: '',
  version: '',
  pluginLoaderId: null,
})

// 计算属性
const inputSize = computed(() => (isMobile.value ? 'small' : 'default'))
const paginationLayout = computed(() =>
  isMobile.value ? 'prev, pager, next, total' : 'total, sizes, prev, pager, next, jumper',
)
// 表格高度计算
const tableHeight = computed(() => {
  // 根据屏幕尺寸动态计算表格高度
  const baseHeight = isMobile.value ? 300 : 400
  return Math.max(baseHeight, window.innerHeight * 0.5)
})
const dialogWidth = computed(() => (isMobile.value ? '90%' : '600px'))

// 监听窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

// 获取依赖列表
const getDependList = async () => {
  loading.value = true
  try {
    const { code, data, msg } = await pluginDependList(queryParams)

    if (code === 200) {
      pagination.data = data.list || []
      pagination.total = data.total || 0
    } else {
      ElMessage.error(msg)
    }
  } catch (error) {
    console.error('获取依赖列表错误:', error)
    ElMessage.error('获取依赖列表失败')
  } finally {
    loading.value = false
  }
}

// 删除依赖
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      // `确定要删除依赖 ${row.groupId}:${row.artifactId}:${row.version} 吗？\n注意:删除操作可能需要重启后才会生效!`,
      `<div>
    确定要删除依赖 ${row.groupId}:${row.artifactId}:${row.version} 吗？<br>
    <span style="color: #e6a23c; font-weight: 500;">注意:删除操作可能需要重启后才会生效!</span>
  </div>`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true,
      },
    )

    // 模拟API调用 - 实际使用时替换为真实API
    const { code, msg } = await removePluginDepend(row.id)

    if (code === 200) {
      ElMessage.success('删除成功')
      getDependList()
    } else {
      ElMessage.error(msg)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除依赖错误:', error)
      // ElMessage.error('删除失败')
    }
  }
}
const goToDependDetail = (row) => {
  if (row.id) {
    router.push('/loader/depend/dependDetail/' + row.id)
    // 实际项目中这里应该进行路由跳转
  }
}
// 查询提交
const onSubmit = () => {
  queryParams.pageNum = 1
  getDependList()
}

// 重置查询
// const onReset = () => {
//   queryParams.groupId = ''
//   queryParams.artifactId = ''
//   queryParams.version = ''
//   queryParams.pageNum = 1
//   getDependList()
// }

// 添加依赖
const onAdd = () => {
  // 重置表单
  Object.keys(form).forEach((key) => {
    form[key] = ''
  })
  form.pluginLoaderId = route.params.id
  addDialogVisible.value = true
}

// 提交添加
const submitAdd = async () => {
  try {
    // 模拟API调用 - 实际使用时替换为真实API

    const { code, msg } = await installPluginDepend(form)

    if (code === 200) {
      ElMessage.success(msg)
      addDialogVisible.value = false
      getDependList()
    } else {
      ElMessage.error(msg)
    }
  } catch (error) {
    console.error('添加依赖错误:', error)
    // ElMessage.error('添加失败')
  }
}

// 分页大小改变
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  queryParams.pageNum = 1
  getDependList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  queryParams.pageNum = val
  getDependList()
}

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '-'
  const date = new Date(dateTimeStr)
  return date.toLocaleString('zh-CN')
}

// 组件挂载时获取数据
onMounted(() => {
  getDependList()
  getLoaderTree()
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
const getStatusTagType = (status) => {
  return statusMap[status]?.type || 'primary'
}
// 状态映射
const statusMap = {
  1: { text: '成功', type: 'success' },
  2: { text: '失败', type: 'danger' },
  3: { text: '锁定', type: 'warning' },
  0: { text: '执行中', type: 'info' },
}
const getStatusText = (status) => {
  return statusMap[status]?.text || '未知状态'
}

const uploadUrl = computed(() => {
  const baseUrl = import.meta.env.VITE_APP_API_BASE_URL
  return `${baseUrl}/plugin/depend/lib`
})

const uploadHeaders = reactive({
  Authorization: localStorage.getItem('userToken') || sessionStorage.getItem('userToken'),
})

const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
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
const uploadSuccess = (res, uploadFile, uploadFiles) => {
  if (res.code == 200) {
    ElMessage({
      message: res.msg,
      type: 'success',
    })
    uploadFiles.length = 0
    addDialogVisible.value = false
    getDependList()
  } else {
    ElMessage({
      message: res.msg,
      type: 'error',
    })
    uploadFiles.length = 0
  }
}
const submitUpload = () => {
  upload.value.submit()
}

const addTypeChange = (val) => {
  if (val) {
    // 重置表单
    Object.keys(form).forEach((key) => {
      form[key] = ''
    })
    form.pluginLoaderId = route.params.id
  } else {
    upload.value.clearFiles()
  }
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
  background: #fff;
  margin-bottom: 0;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
}

.table-container {
  /* flex: 1;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  flex: 1;
  min-height: 200px;
  padding: 0 16px;
  overflow: auto;
}

.pagination-container {
  padding: 16px 0;
  display: flex;
  justify-content: center;
  background: #fff;
  border-radius: 0 0 4px 4px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.compact-actions .el-button {
  min-width: auto;
  padding: 6px 8px;
}

@media (max-width: 768px) {
  .app-container {
    padding: 8px;
  }

  .demo-form-inline {
    padding: 12px;
  }

  .form-row {
    gap: 8px;
  }

  .action-buttons {
    gap: 4px;
  }
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .dialog-actions {
    flex-direction: column;
  }

  .dialog-actions .el-button {
    width: 100%;
  }
}

.form-item-compact :deep(.el-form-item__label) {
  padding-right: 8px;
}

.query-button-col {
  display: flex;
  justify-content: flex-end;
}

log-icon-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.log-icon {
  transition: all 0.3s ease;
  color: #606266;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  background: #f5f7fa;
}

.log-icon:hover {
  color: #409eff;
  background: #ecf5ff;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.message-length {
  font-size: 10px;
  color: #909399;
  background: #f5f7fa;
  padding: 1px 4px;
  border-radius: 8px;
  line-height: 1;
}

/* 弹窗内容样式 */
.log-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-dialog-content.mobile {
  padding: 8px;
}

.log-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.log-time {
  font-size: 12px;
  color: #909399;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.log-content-wrapper {
  flex: 1;
  min-height: 200px;
  max-height: 500px; /* 最大高度，超出显示滚动条 */
  overflow: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #f8f9fa;
  padding: 12px;
}

.log-text {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
}

/* 滚动条样式 */
.log-content-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.log-content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.log-content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.log-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.log-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .log-content-wrapper {
    max-height: 400px;
  }

  .log-icon-wrapper {
    transform: scale(0.9);
  }
}
/* 上传组件样式 */
.upload-demo {
  text-align: center;
}
.ml-3 {
  margin-left: 13px;
}
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
