<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" @click="onAdd">添加</el-button>
      </el-form-item>
      <!-- <el-form-item label="任务名称">
        <el-input v-model="queryParams.jobName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="任务状态">
        <el-input v-model="queryParams.jobStatus" placeholder="请输入" clearable />
      </el-form-item> -->
      <!-- <el-form-item label="输入3">
        <el-input v-model="queryParams.user" placeholder="请输入" clearable />
      </el-form-item> -->
      <el-form-item>
        <!-- <el-button type="primary" @click="onSubmit">变更</el-button> -->
      </el-form-item>
    </el-form>
    <el-divider />
    <!-- <div class="auto-resizer">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2 :columns="columns" :data="dataList" :width="width" :height="height" fixed />
        </template>
      </el-auto-resizer>
    </div> -->
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
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
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
    primaryKey.value = columns.value.find((column) => column.primaryKey).dataKey
    console.log('primaryKey: ' + primaryKey.value)
    formConfigEdit.value = formConfigbuild(columns.value)
    // for (let index = 0; index < formConfigEdit.value.length; index++) {
    //   const item = formConfigEdit.value[index].filter((col) => !col.primaryKey)
    //   if (item.length > 0) {
    //     formConfigAdd.value.push(item)
    //   }
    // }
    formConfigAdd.value = formConfigbuild(columns.value.filter((item) => !item.primaryKey))
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
  const id = rowData[primaryKey.value]
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
  const id = rowData[primaryKey.value]
  ElMessageBox.confirm(`确定要删除${primaryKey.value} 为 ${id} 的值吗?`, '删除', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
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
  } else {
    ElMessage({
      message: msg,
      type: 'error',
    })
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
.app-container {
  width: 100%;
  height: 90%;
}
.auto-resizer {
  width: 100%;
  height: 90%;
}
.demo-form-inline {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}
.el-form-item {
  margin: 0;
}
.ml-3 {
  margin-left: 10px;
}
.el-row {
  margin-bottom: 20px;
}
.centered-form {
  margin: 0 auto;
  padding: 10px;
}
</style>
