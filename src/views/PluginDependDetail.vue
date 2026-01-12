<template>
  <div class="app-container">
    <!-- 查询表单区域 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline responsive-form">
      <el-row :gutter="16" class="form-row" justify="space-between">
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
          <el-row :gutter="16">
            <!-- 操作按钮组 -->
            <el-col :xs="3" :sm="5" :md="3" :lg="3">
              <el-form-item>
                <el-button type="primary" @click="onReset" :size="inputSize" class="action-button">
                  <el-icon><Refresh /></el-icon>
                  <span v-if="!isMobile">刷新</span>
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

            <el-col :xs="4" :sm="10" :md="8" :lg="3" class="query-button-col">
              <el-form-item>
                <el-button type="primary" @click="onSubmit" :size="inputSize" class="query-button">
                  <el-icon><Search /></el-icon>
                  <span>查询</span>
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="4" :sm="10" :md="8" :lg="2" class="query-button-col">
              <el-form-item>
                <el-button @click="onReset" :size="inputSize">
                  <el-icon><Refresh /></el-icon>
                  <span v-if="!isMobile">重置</span>
                </el-button>
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
        <el-table-column label="序号" :width="isMobile ? 70 : 80" align="center">
          <template #default="scope">
            {{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="groupId"
          label="Group ID"
          :min-width="isMobile ? 90 : 135"
          align="center"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="artifactId"
          label="Artifact ID"
          :min-width="isMobile ? 100 : 155"
          align="center"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          prop="version"
          label="Version"
          :width="isMobile ? 60 : 75"
          align="center"
        />

        <el-table-column
          prop="extension"
          label="extension"
          :width="isMobile ? 60 : 85"
          align="center"
        />
        <el-table-column prop="deleteFlag" label="状态" min-width="100" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.deleteFlag)" size="small">
              <span v-if="scope.row.deleteFlag != '1'">{{
                getStatusText(scope.row.deleteFlag)
              }}</span>
              <el-tooltip v-else content="删除操作需要重启后才生效" placement="top">
                <span>{{ getStatusText(scope.row.deleteFlag) }}</span>
              </el-tooltip>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="filePath"
          label="路径"
          :width="isMobile ? 100 : 120"
          :show-overflow-tooltip="true"
          align="center"
        />
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
                :disabled="row.deleteFlag != '0'"
                size="small"
                type="danger"
                @click="handleDelete(row)"
                :icon="Delete"
              >
                <span v-if="!isMobile">删除</span>
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

    <!-- 添加依赖对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isMobile ? '添加依赖' : '添加新依赖'"
      :width="dialogWidth"
      :align-center="true"
    >
      <el-form :model="form" :label-width="isMobile ? '80px' : '100px'">
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
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import { pluginDependDetailList, removePluginDependDetail } from '@/api/pluginDependDetail'
import { useRoute } from 'vue-router'
const route = useRoute()
// 响应式数据
const loading = ref(false)
const isMobile = ref(window.innerWidth < 768)
const addDialogVisible = ref(false)

// 查询参数
const queryParams = reactive({
  groupId: '',
  artifactId: '',
  version: '',
  dependId: route.params.id,
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
const getDependDetailList = async () => {
  loading.value = true
  try {
    const { code, data, msg } = await pluginDependDetailList(queryParams)

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

    const { code, msg } = await removePluginDependDetail(row.id)

    if (code === 200) {
      ElMessage.success('删除成功')
      getDependDetailList()
    } else {
      ElMessage.error(msg)
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除依赖错误:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 查询提交
const onSubmit = () => {
  queryParams.pageNum = 1
  getDependDetailList()
}

// 重置查询
const onReset = () => {
  queryParams.groupId = ''
  queryParams.artifactId = ''
  queryParams.version = ''
  queryParams.pageNum = 1
  getDependDetailList()
}

// 分页大小改变
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  queryParams.pageNum = 1
  getDependDetailList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  queryParams.pageNum = val
  getDependDetailList()
}

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '-'
  const date = new Date(dateTimeStr)
  return date.toLocaleString('zh-CN')
}
const getStatusTagType = (status) => {
  return statusMap[status]?.type || 'primary'
}
// 状态映射
const statusMap = {
  0: { text: '正常', type: 'success' },
  1: { text: '等待重启', type: 'danger' },
  3: { text: '锁定', type: 'warning' },
}
const getStatusText = (status) => {
  return statusMap[status]?.text || '未知状态'
}

// 组件挂载时获取数据
onMounted(() => {
  getDependDetailList()
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
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
</style>
