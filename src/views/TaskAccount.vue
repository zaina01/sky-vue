<template>
  <div class="app-container">
    <!-- 响应式表单区域 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline responsive-form">
      <el-row :gutter="16" class="form-row" justify="space-between">
        <!-- 左侧：添加按钮和搜索条件 -->
        <el-col :xs="24" :sm="18" :md="18" :lg="18">
          <el-row :gutter="16">
            <!-- 操作按钮组 -->
            <el-col :xs="6" :sm="4" :md="4" :lg="3">
              <el-form-item>
                <el-button type="primary" @click="onAdd" :size="inputSize" class="action-button">
                  <el-icon><Plus /></el-icon>
                  <span v-if="!isMobile">添加</span>
                </el-button>
              </el-form-item>
            </el-col>

            <el-col :xs="6" :sm="10" :md="8" :lg="2">
              <el-form-item>
                <el-button
                  type="primary"
                  @click="configEdit"
                  :size="inputSize"
                  class="action-button"
                >
                  <el-icon><Setting /></el-icon>
                  <span v-if="!isMobile">配置</span>
                  <!-- <span>配置</span> -->
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <!-- 右侧：查询按钮 -->
      </el-row>
    </el-form>
    <div class="table-container">
      <el-table :data="dataList" v-loading="loading" style="width: 100%" highlight-current-row>
        <el-table-column
          v-for="(row, index) in columns"
          :key="index"
          :prop="row.dataKey"
          :min-width="row.width"
          :label="row.title"
          :align="row.align"
        />
        <el-table-column label="操作" min-width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" type="warning" @click.stop="handleEdit(scope.row)">
              修改
            </el-button>
            <el-button size="small" type="danger" @click.stop="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加 -->

    <el-dialog v-model="editFlag" :title="dialogTitle" width="800" :align-center="true">
      <el-form :model="form" label-width="auto" style="max-width: 600px" class="centered-form">
        <el-row
          :gutter="24"
          justify="space-between"
          v-for="(row, index) in formConfig"
          :key="index"
        >
          <el-col :span="12" v-for="col in row" :key="col.key">
            <el-form-item :label="col.title">
              <el-input v-model="form[col.dataKey]" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" justify="end">
          <el-col :span="4">
            <el-button type="danger" @click="editFlag = false">取消</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="submitUpdate">确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 配置 -->
    <el-dialog v-model="configFlage" :title="dialogTitle" width="800" :align-center="true">
      <el-form :model="form" label-width="auto" style="max-width: 600px" class="centered-form">
        <el-row
          :gutter="24"
          justify="space-between"
          v-for="(row, index) in formConfig"
          :key="index"
        >
          <el-col :span="12" v-for="col in row" :key="col.key">
            <el-form-item :label="col.title">
              <el-input v-model="form[col.dataKey]" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" justify="end">
          <el-col :span="4">
            <el-button type="danger" @click="editFlag = false">取消</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="submitUpdate">确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Setting } from '@element-plus/icons-vue'
import {
  getAccountColumn,
  getAccounts,
  getAccount,
  addAccount,
  deleteAccount,
  updateAccount,
} from '../api/TaskAccount'

// 响应式数据
const route = useRoute()
const jobId = ref(route.params.id)
const columns = ref([])
const dataList = ref([])
const primaryKey = ref('')
const loading = ref(true)
const dialogTitle = ref('')
const editFlag = ref(false)
const configFlage = ref(false)
const formConfigEdit = ref([])
const formConfigAdd = ref([])
const formConfig = ref([])
const queryParams = ref({})
const form = ref({})
const formConfigbuild = (columns) => {
  columns = columns.filter((item) => item.key !== 'action')
  console.log(columns)
  const columnsLength = columns.length
  const count = Math.ceil(columnsLength / 2)
  console.log(count)
  const list = []
  let index = 0
  for (let i = 0; i < count; i++) {
    list.push([])
    for (let j = 0; j < 2; j++) {
      list[i].push(columns[index])
      index++
      if (index == columns.length) {
        break
      }
    }
  }
  console.log(list)
  return list
}

const getColumns = async () => {
  const { code, msg, data } = await getAccountColumn(jobId.value)
  if (code == 200) {
    columns.value = data
    primaryKey.value = columns.value.find((column) => column.primaryKey)
    console.log('primaryKey: ' + primaryKey.value.dataKey)
    formConfigEdit.value = formConfigbuild(columns.value)
    // for (let index = 0; index < formConfigEdit.value.length; index++) {
    //   const item = formConfigEdit.value[index].filter((col) => !col.primaryKey)
    //   if (item.length > 0) {
    //     formConfigAdd.value.push(item)
    //   }
    // }
    formConfigAdd.value = formConfigbuild(columns.value.filter((item) => !item.primaryKey.dataKey))
    console.log(formConfigAdd.value)
    // columns.value.push({
    //   key: 'action',
    //   title: '操作',
    //   width: 300,
    //   align: 'center',
    //   cellRenderer: ({ rowData }) => (
    //     <div class="action-buttons">
    //       <el-button
    //         size="small"
    //         type="warning"
    //         onClick={() => {
    //           handleEdit(rowData)
    //         }}
    //       >
    //         修改
    //       </el-button>
    //       <el-button
    //         size="small"
    //         type="danger"
    //         onClick={() => {
    //           handleDelete(rowData)
    //         }}
    //       >
    //         删除
    //       </el-button>
    //     </div>
    //   ),
    // })
  } else {
    ElMessage.error(msg)
  }
}
// 模拟获取列配置API
const submitUpdate = () => {
  if (
    Object.values(form.value).every(
      (value) => value === null || value === undefined || value === '',
    )
  ) {
    ElMessage({
      message: '请填写表单',
      type: 'error',
    })
    return
  }
  if (dialogTitle.value === '添加') {
    accountAdd()
  } else {
    putAccount()
  }
}
// 模拟获取表格数据API
const getDataList = async () => {
  loading.value = true
  const { code, msg, data } = await getAccounts(jobId.value)
  if (code == 200) {
    dataList.value = data
    loading.value = false
  } else {
    ElMessage.error(msg)
  }
}
const delAccount = async (id) => {
  const { code, msg } = await deleteAccount(jobId.value, id)
  if (code == 200) {
    ElMessage({
      message: msg,
      type: 'success',
    })
    getDataList()
  } else {
    ElMessage.error(msg)
  }
}
const handleEdit = (rowData) => {
  const id = rowData[primaryKey.value.dataKey]
  selectAccount(id)
  editFlag.value = true
  dialogTitle.value = '修改'
  formConfig.value = formConfigEdit.value
}
const selectAccount = async (id) => {
  const { code, msg, data } = await getAccount(jobId.value, id)
  if (code == 200) {
    form.value = data
  } else {
    ElMessage.error(msg)
  }
}
const handleDelete = (rowData) => {
  console.log(rowData)
  const id = rowData[primaryKey.value.dataKey]
  ElMessageBox.confirm(`确定要删除 ${primaryKey.value.title} 为 ${id} 的值吗?`, '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    delAccount(id)
    // ElMessage({
    //   message: '功能开发中',
    //   type: 'info',
    // })
  })
}

const onAdd = () => {
  form.value = {}
  formConfig.value = formConfigEdit.value
  editFlag.value = true
  dialogTitle.value = '添加'
}
const configEdit = () => {
  configFlage.value = true
  dialogTitle.value = '配置'
}
const accountAdd = async () => {
  const { code, msg } = await addAccount(jobId.value, form.value)
  if (code == 200) {
    ElMessage({
      message: msg,
      type: 'success',
    })
    editFlag.value = false
    getDataList()
  } else {
    ElMessage({
      message: msg,
      type: 'error',
    })
  }
}
const putAccount = async () => {
  const { code, msg } = await updateAccount(jobId.value, form.value)
  if (code == 200) {
    ElMessage({
      message: msg,
      type: 'success',
    })
    editFlag.value = false
    getDataList()
  }
}
// const onSubmit = () => {
//   ElMessage({
//     message: '功能开发中',
//     type: 'info',
//   })
// }
// 组件挂载时加载数据
onMounted(() => {
  getColumns()
  getDataList()
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
