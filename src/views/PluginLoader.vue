<template>
  <div class="app-container" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 响应式表单区域 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-row :gutter="16" class="form-row" justify="space-between">
        <!-- 左侧：添加按钮和搜索条件 -->
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
          <el-row>
            <!-- 操作按钮组 -->
            <el-col :span="12" :xs="12" :sm="12" :md="12" :lg="12">
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleCreate"
                  :size="inputSize"
                  class="action-button"
                >
                  <el-icon><Plus /></el-icon>
                  <span v-if="!isMobile">添加加载器</span>
                </el-button>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              :xs="12"
              :sm="12"
              :md="12"
              :lg="12"
              style="display: flex; justify-content: flex-end"
            >
              <el-form-item>
                <el-button
                  type="danger"
                  @click="handleRestart"
                  :size="inputSize"
                  class="action-button"
                >
                  <el-icon><RefreshLeft /></el-icon>
                  <span v-if="!isMobile">重启</span>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>

    <!-- 主内容区域 -->
    <div class="main-content" :class="{ 'mobile-layout': isMobile }">
      <!-- 左侧树形结构 -->
      <div class="tree-section">
        <el-card class="tree-card" :body-style="{ padding: isMobile ? '10px' : '15px' }">
          <template #header>
            <div class="tree-header">
              <span>加载器列表</span>
              <span class="tree-count">共 {{ filteredLoaders.length }} 个</span>
            </div>
          </template>

          <div class="tree-container">
            <el-tree
              ref="loaderTree"
              :data="treeData"
              :props="treeProps"
              :filter-node-method="filterNode"
              node-key="id"
              highlight-current
              @node-click="handleNodeClick"
              default-expand-all
            >
              <template #default="{ data }">
                <div class="custom-tree-node" :class="{ 'mobile-node': isMobile }">
                  <div class="node-info">
                    <i :class="getNodeIcon(data)"></i>
                    <span class="node-name" :title="data.name">{{ data.name }}</span>
                    <el-tag
                      v-if="data.level === 0"
                      size="small"
                      type="primary"
                      :class="{ 'mobile-tag': isMobile }"
                    >
                      根节点
                    </el-tag>
                    <el-tag v-else size="small" type="info" :class="{ 'mobile-tag': isMobile }">
                      层级 {{ data.level }}
                    </el-tag>
                  </div>
                  <div class="node-actions" :class="{ 'mobile-actions': isMobile }">
                    <el-button
                      v-if="data.level >= 0"
                      :size="isMobile ? 'small' : 'small'"
                      type="text"
                      :icon="Edit"
                      @click.stop="handleEdit(data)"
                      :title="isMobile ? '' : '编辑'"
                      class="edit-btn"
                    ></el-button>
                    <el-button
                      v-if="data.id !== 1"
                      :size="isMobile ? 'small' : 'small'"
                      type="text"
                      :icon="Delete"
                      @click.stop="handleDelete(data)"
                      :title="isMobile ? '' : '删除'"
                      class="delete-btn"
                    ></el-button>
                  </div>
                </div>
              </template>
            </el-tree>
          </div>
        </el-card>
      </div>

      <!-- 右侧详情和操作 -->
      <div class="detail-section">
        <div v-if="selectedLoader" class="loader-detail">
          <el-card class="detail-card" :body-style="{ padding: isMobile ? '10px' : '20px' }">
            <template #header>
              <div class="detail-header">
                <span>加载器详情</span>
                <el-button
                  type="text"
                  :icon="Edit"
                  @click="handleEdit(selectedLoader)"
                  :size="isMobile ? 'small' : 'default'"
                >
                  {{ isMobile ? '' : '编辑' }}
                </el-button>
              </div>
            </template>

            <el-descriptions :column="isMobile ? 1 : 2" border>
              <el-descriptions-item label="加载器名称">
                <span v-if="!isEditing">{{ selectedLoader.name }}</span>
                <el-input
                  v-else
                  v-model="editForm.name"
                  :size="inputSize"
                  placeholder="请输入加载器名称"
                />
              </el-descriptions-item>
              <el-descriptions-item label="加载器ID">
                {{ selectedLoader.id }}
              </el-descriptions-item>
              <el-descriptions-item label="父加载器ID">
                {{ selectedLoader.parentId || '无' }}
              </el-descriptions-item>
              <el-descriptions-item label="节点深度">
                <el-tag
                  :type="getLevelType(selectedLoader.level)"
                  :size="isMobile ? 'small' : 'default'"
                >
                  层级 {{ selectedLoader.level }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item :span="isMobile ? 1 : 2" label="完整路径">
                <el-tooltip :content="selectedLoader.fullPath" placement="top">
                  <span class="path-text">{{ selectedLoader.fullPath }}</span>
                </el-tooltip>
              </el-descriptions-item>
              <el-descriptions-item :span="isMobile ? 1 : 2" label="描述信息">
                <el-tooltip :content="selectedLoader.description" placement="top">
                  <span class="path-text">{{ selectedLoader.description }}</span>
                </el-tooltip>
              </el-descriptions-item>
              <el-descriptions-item :span="isMobile ? 1 : 2" label="Maven镜像">
                <el-tooltip :content="selectedLoader.remoteRepositoryAddress" placement="top">
                  <span class="path-text">{{ selectedLoader.remoteRepositoryAddress }}</span>
                </el-tooltip>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ formatDate(selectedLoader.createTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">
                {{ formatDate(selectedLoader.updateTime) }}
              </el-descriptions-item>
            </el-descriptions>

            <!-- <div v-if="isEditing" class="edit-actions">
              <el-button type="primary" @click="handleSave" :loading="saving" :size="inputSize">
                保存
              </el-button>
              <el-button @click="cancelEdit" :size="inputSize">取消</el-button>
            </div> -->

            <div class="action-buttons" :class="{ 'mobile-action-buttons': isMobile }">
              <el-button
                type="primary"
                :icon="Connection"
                @click="goToDependencyManagement"
                class="action-btn"
                :size="inputSize"
                :block="isMobile"
              >
                {{ isMobile ? '依赖' : '依赖管理' }}
              </el-button>
              <el-button
                type="success"
                :icon="Cpu"
                @click="goToPluginManagement"
                class="action-btn"
                :size="inputSize"
                :block="isMobile"
              >
                {{ isMobile ? '插件' : '插件管理' }}
              </el-button>
            </div>
          </el-card>
        </div>

        <div v-else class="empty-state">
          <el-empty :description="isMobile ? '请选择加载器' : '请选择一个加载器查看详情'">
            <el-button type="primary" @click="handleCreate" :size="inputSize">
              创建加载器
            </el-button>
          </el-empty>
        </div>
      </div>
    </div>

    <!-- 创建/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :width="dialogWidth"
      :align-center="true"
    >
      <el-form
        :model="dialogForm"
        :rules="formRules"
        ref="dialogFormRef"
        :label-width="isMobile ? '80px' : '100px'"
      >
        <el-form-item label="加载器名称" prop="name">
          <el-input
            v-model="dialogForm.name"
            placeholder="请输入加载器名称"
            maxlength="50"
            show-word-limit
            :size="inputSize"
          />
        </el-form-item>
        <el-form-item label="父加载器" v-show="dialogTitle !== '编辑加载器'">
          <el-cascader
            v-model="dialogForm.parentId"
            :options="parentOptions"
            :props="cascaderProps"
            placeholder="请选择父加载器"
            style="width: 100%"
            clearable
            :size="inputSize"
          />
        </el-form-item>
        <el-form-item label="描述信息">
          <el-input
            v-model="dialogForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入加载器描述(可选)"
            maxlength="200"
            show-word-limit
            :size="inputSize"
          />
        </el-form-item>
        <el-form-item label="Maven镜像">
          <el-input
            v-model="dialogForm.remoteRepositoryAddress"
            type="textarea"
            :rows="2"
            placeholder="请输入Maven镜像地址(可选)"
            maxlength="150"
            show-word-limit
            :size="inputSize"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" :size="inputSize">取消</el-button>
          <el-button
            type="primary"
            @click="submitDialogForm"
            :loading="dialogLoading"
            :size="inputSize"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { Plus, Edit, Delete, Connection, Cpu, RefreshLeft } from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'
import {
  getTree,
  addPluginLoader,
  updatePluginLoader,
  deletePluginLoader,
  getPluginLoade,
} from '@/api/pluginLoader'
import { restart } from '@/api/system'
const router = useRouter()
// 响应式窗口大小
const { width } = useWindowSize()

// 计算属性
const isMobile = computed(() => width.value < 768)
const inputSize = computed(() => (isMobile.value ? 'small' : 'default'))
const dialogWidth = computed(() => (isMobile.value ? '90%' : '500px'))

// 模拟数据
// const mockLoaders = [
//   {
//     id: 1,
//     name: '根加载器',
//     parentId: null,
//     level: 0,
//     fullPath: '/根加载器',
//     children: [
//       {
//         id: 2,
//         name: '核心加载器',
//         parentId: 1,
//         level: 1,
//         fullPath: '/根加载器/核心加载器',
//         children: [
//           {
//             id: 3,
//             name: '工具类加载器',
//             parentId: 2,
//             level: 2,
//             fullPath: '/根加载器/核心加载器/工具类加载器',
//             children: [],
//             createTime: '2023-10-15T08:30:00',
//             updateTime: '2024-01-20T14:25:00',
//           },
//         ],
//         createTime: '2023-09-10T10:15:00',
//         updateTime: '2024-02-12T09:45:00',
//       },
//       {
//         id: 4,
//         name: '应用加载器',
//         parentId: 1,
//         level: 1,
//         fullPath: '/根加载器/应用加载器',
//         children: [],
//         createTime: '2023-11-05T16:20:00',
//         updateTime: '2024-01-18T11:30:00',
//       },
//     ],
//     createTime: '2023-08-01T09:00:00',
//     updateTime: '2024-02-15T16:50:00',
//   },
// ]

// 响应式数据
const queryParams = reactive({
  loaderName: '',
})

const treeData = ref([])
const selectedLoader = ref(null)
const isEditing = ref(false)
// const saving = ref(false)
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const dialogMode = ref('create')
const loaderTree = ref()
const selecteId = ref(null)
const fullscreenLoading = ref(false)

// 表单数据
const editForm = reactive({
  name: '',
})

const dialogForm = reactive({
  id: null,
  name: '',
  parentId: null,
  description: '',
  remoteRepositoryAddress: '',
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入加载器名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
}

// 计算属性
const dialogTitle = computed(() => {
  return dialogMode.value === 'create' ? '创建加载器' : '编辑加载器'
})

const treeProps = computed(() => ({
  children: 'children',
  label: 'name',
}))

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

const filteredLoaders = computed(() => {
  const flattenLoaders = (loaderList, result = []) => {
    loaderList.forEach((loader) => {
      result.push(loader)
      if (loader.children && loader.children.length > 0) {
        flattenLoaders(loader.children, result)
      }
    })
    return result
  }

  const allLoaders = flattenLoaders(treeData.value)

  if (!queryParams.loaderName) {
    return allLoaders
  }

  return allLoaders.filter((loader) =>
    loader.name.toLowerCase().includes(queryParams.loaderName.toLowerCase()),
  )
})

// 方法
const getNodeIcon = (data) => {
  if (data.level === 0) return 'el-icon-s-home'
  if (data.children && data.children.length > 0) return 'el-icon-folder'
  return 'el-icon-cpu'
}

const getLevelType = (level) => {
  const types = ['primary', 'success', 'warning', 'info', 'danger']
  return types[level % types.length]
}

const formatDate = (dateString) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleString('zh-CN')
}

// const handleSearch = () => {
//   loaderTree.value?.filter(queryParams.loaderName)
// }

const filterNode = (value, data) => {
  if (!value) return true
  return data.name.toLowerCase().includes(value.toLowerCase())
}

const handleNodeClick = (data) => {
  selectedLoader.value = { ...data }
  selecteId.value = data.id
  isEditing.value = false
  Object.assign(editForm, {
    name: data.name,
  })
}

const handleCreate = () => {
  dialogMode.value = 'create'
  Object.assign(dialogForm, {
    name: '',
    parentId: selectedLoader.value?.id || 1,
    description: '',
  })
  dialogVisible.value = true
}
const handleRestart = async () => {
  try {
    await ElMessageBox.confirm(`确定要重启应用吗？此操作不可撤销。`, '重启应用', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const { code, msg } = await restart()
    if (code === 200) {
      ElMessage.success(msg)
    } else {
      ElMessage.error(msg)
    }
  } catch (error) {
    console.log(error)
  }
}
const handleEdit = async (val) => {
  if (val.id === 1) {
    ElMessage.warning('根加载器不能编辑')
    return
  }
  const { code, data, msg } = await getPluginLoade(val.id)
  if (code === 200) {
    dialogMode.value = 'edit'
    Object.assign(dialogForm, {
      id: data.id,
      name: data.name,
      parentId: data.parentId,
      description: data.description || '',
    })
    dialogVisible.value = true
  } else {
    ElMessage.error(msg)
  }
}

// const handleSave = async () => {
//   if (!editForm.name.trim()) {
//     ElMessage.error('加载器名称不能为空')
//     return
//   }

//   saving.value = true
//   try {
//     // 模拟API调用
//     const { code, msg } = await updatePluginLoader(treeData.value)
//     if (code === 200) {
//       ElMessage.success(msg)
//       // 更新数据
//       const loader = findLoaderById(treeData.value, selectedLoader.value.id)
//       if (loader) {
//         loader.name = editForm.name
//         loader.updateTime = new Date().toISOString()
//         selectedLoader.value.name = editForm.name
//         selectedLoader.value.updateTime = loader.updateTime
//       }
//     } else {
//       ElMessage.error(msg)
//     }
//     isEditing.value = false
//   } catch (error) {
//     console.log(error)
//     ElMessage.error('更新失败')
//   } finally {
//     saving.value = false
//   }
// }

// const cancelEdit = () => {
//   isEditing.value = false
//   Object.assign(editForm, {
//     name: selectedLoader.value.name,
//   })
// }

const handleDelete = async (data) => {
  if (data.id === 1) {
    ElMessage.warning('根加载器不能删除')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要删除加载器 "${data.name}" 吗？此操作不可撤销。`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 模拟删除操作

    // removeLoader(treeData.value, data.id)
    fullscreenLoading.value = true
    const { code, msg } = await deletePluginLoader(data.id)
    if (code === 200) {
      ElMessage.success(msg)
      if (selectedLoader.value && selectedLoader.value.id === data.id) {
        selectedLoader.value = null
      }
    } else {
      ElMessage.error(msg)
    }
    refreshData()
    fullscreenLoading.value = false
  } catch (error) {
    console.log(error)
    refreshData()
    fullscreenLoading.value = false
    // 用户取消删除
  }
}

const submitDialogForm = async () => {
  // 表单验证
  const valid = await nextTick(() => {
    return new Promise((resolve) => {
      if (!dialogForm.name.trim()) {
        ElMessage.error('请输入加载器名称')
        resolve(false)
        return
      }
      resolve(true)
    })
  })

  if (!valid) return

  dialogLoading.value = true
  try {
    if (dialogMode.value === 'create') {
      // 创建新加载器
      const newLoader = {
        // id: Math.max(...getAllLoaderIds(treeData.value)) + 1,
        name: dialogForm.name,
        parentId: dialogForm.parentId || 1,
        description: dialogForm.description,
        remoteRepositoryAddress: dialogForm.remoteRepositoryAddress,
      }
      const { code, msg } = await addPluginLoader(newLoader)
      if (code === 200) {
        ElMessage.success(msg)
      } else {
        ElMessage.error(msg)
      }
      // 添加到父加载器
      // if (dialogForm.parentId) {
      //   const parent = findLoaderById(treeData.value, dialogForm.parentId)
      //   if (parent) {
      //     if (!parent.children) parent.children = []
      //     parent.children.push(newLoader)
      //   }
      // } else {
      //   treeData.value[0].children.push(newLoader)
      // }
    } else {
      const { code, msg } = await updatePluginLoader(dialogForm)
      if (code === 200) {
        ElMessage.success(msg)
      } else {
        ElMessage.error(msg)
      }
      // selectedLoader.value = null
      // 编辑加载器
      // const loader = findLoaderById(treeData.value, selectedLoader.value.id)
      // if (loader) {
      //   loader.name = dialogForm.name
      //   loader.description = dialogForm.description
      //   loader.updateTime = new Date().toISOString()
      //   selectedLoader.value.name = dialogForm.name
      //   selectedLoader.value.description = dialogForm.description
      //   selectedLoader.value.updateTime = loader.updateTime
      // }
    }

    dialogVisible.value = false
    refreshData()
  } catch (error) {
    console.log(error)
    // ElMessage.error('操作失败')
  } finally {
    dialogLoading.value = false
  }
}

const refreshData = async () => {
  // 模拟刷新数据
  const { code, data, msg } = await getTree()
  if (code === 200) {
    treeData.value = data
    if (selecteId.value) {
      const loader = findLoaderById(treeData.value, selecteId.value)
      handleNodeClick(loader)
    }
  } else {
    ElMessage.error(msg)
  }
}

const goToDependencyManagement = () => {
  if (selectedLoader.value) {
    router.push('/loader/depend/' + selectedLoader.value.id)
    // 实际项目中这里应该进行路由跳转
  }
}

const goToPluginManagement = () => {
  if (selectedLoader.value) {
    router.push('/loader/job/' + selectedLoader.value.id)
    // ElMessage.info(`跳转到加载器 ${selectedLoader.value.name} 的插件管理页面`)
    // 实际项目中这里应该进行路由跳转
  }
}

// 工具函数
const findLoaderById = (loaders, id) => {
  for (const loader of loaders) {
    if (loader.id === id) return loader
    if (loader.children && loader.children.length > 0) {
      const found = findLoaderById(loader.children, id)
      if (found) return found
    }
  }
  return null
}

// const removeLoader = (loaders, id) => {
//   for (let i = 0; i < loaders.length; i++) {
//     if (loaders[i].id === id) {
//       loaders.splice(i, 1)
//       return true
//     }
//     if (loaders[i].children && loaders[i].children.length > 0) {
//       if (removeLoader(loaders[i].children, id)) {
//         return true
//       }
//     }
//   }
//   return false
// }

// const getAllLoaderIds = (loaders) => {
//   const ids = []
//   const traverse = (loaderList) => {
//     loaderList.forEach((loader) => {
//       ids.push(loader.id)
//       if (loader.children && loader.children.length > 0) {
//         traverse(loader.children)
//       }
//     })
//   }
//   traverse(loaders)
//   return ids.length > 0 ? ids : [0]
// }

// const getLoaderLevel = (loaders, parentId) => {
//   if (!parentId) return 0
//   const parent = findLoaderById(loaders, parentId)
//   return parent ? parent.level : 0
// }

// const getParentFullPath = (loaders, parentId) => {
//   if (!parentId) return ''
//   const parent = findLoaderById(loaders, parentId)
//   return parent ? parent.fullPath : ''
// }

// 初始化
onMounted(() => {
  refreshData()
})
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
  background: #fff;
  margin-bottom: 0;
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
  font-size: 14px;
}

/* 查询按钮列样式 */
.query-button-col {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.query-button,
.refresh-button {
  min-width: 80px;
}

/* 操作按钮样式 */
.action-button {
  min-width: 80px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: auto;
  min-height: 200px;
}

/* 移动端布局 */
.mobile-layout {
  flex-direction: column;
}

/* 树形结构区域 */
.tree-section {
  flex: 0 0 350px;
  display: flex;
  flex-direction: column;
}

.tree-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.tree-count {
  font-size: 12px;
  color: #909399;
}

.tree-container {
  flex: 1;
  overflow: auto;
  margin-top: 10px;
}

/* 自定义树节点 */
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding: 5px 0;
}

.mobile-node {
  padding: 8px 0;
}

.node-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow: hidden;
}

.node-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.mobile-tag {
  font-size: 10px;
  padding: 0 4px;
  height: 18px;
  line-height: 18px;
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.mobile-actions {
  opacity: 1; /* 移动端始终显示操作按钮 */
}

.custom-tree-node:hover .node-actions {
  opacity: 1;
}

.edit-btn,
.delete-btn {
  padding: 4px;
  min-width: auto;
}

.delete-btn {
  color: #f56c6c;
}

/* 详情区域 */
.detail-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.detail-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.path-text {
  display: inline-block;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.mobile-action-buttons {
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  flex: 1;
  max-width: 200px;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 4px;
}

/* 响应式媒体查询 */
@media (max-width: 768px) {
  .app-container {
    padding: 0;
  }

  .demo-form-inline {
    padding: 12px;
  }

  .main-content {
    padding: 12px;
    gap: 12px;
  }

  .tree-section {
    flex: 0 0 auto;
    width: 100%;
  }

  .form-row .el-col {
    margin-bottom: 8px;
  }

  .action-buttons .el-button {
    min-width: auto;
    padding: 6px 8px;
  }

  .node-name {
    max-width: 100px;
  }

  .path-text {
    max-width: 150px;
  }
}

@media (max-width: 480px) {
  .demo-form-inline {
    padding: 8px;
  }

  .main-content {
    padding: 8px;
    gap: 8px;
  }

  .action-buttons {
    gap: 2px;
  }

  .action-buttons .el-button {
    padding: 4px 6px;
    font-size: 12px;
  }

  .node-name {
    max-width: 80px;
  }

  .path-text {
    max-width: 120px;
  }
}

/* 确保表格在移动端正确显示 */
:deep(.el-tree) {
  font-size: 14px;
}

:deep(.el-tree-node__content) {
  height: 40px;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
}

:deep(.el-descriptions__content) {
  word-break: break-all;
}

/* 移动端优化 */
@media (max-width: 768px) {
  :deep(.el-tree-node__content) {
    height: 44px;
  }

  :deep(.el-descriptions) {
    font-size: 12px;
  }

  :deep(.el-descriptions__label) {
    width: 80px;
  }
}
</style>
