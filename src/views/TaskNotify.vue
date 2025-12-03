<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" @click="onAdd">添加服务</el-button>
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
    <el-table :data="notifys" v-loading="loading" style="width: 100%" highlight-current-row>
      <el-table-column prop="id" min-width="80" label="序号" align="center" />
      <el-table-column prop="notifyName" min-width="80" label="服务名称" align="center" />
      <el-table-column prop="createTime" min-width="150" label="创建时间" align="center">
        <template #default="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" min-width="150" label="更新时间" align="center">
        <template #default="scope">
          {{ formatTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" min-width="80" label="状态" align="center">
        <template #default="scope">
          <el-switch
            v-if="scope.row.status !== '0'"
            v-model="scope.row.status"
            class="ml-2"
            inline-prompt
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="启用"
            inactive-text="禁用"
            active-value="1"
            inactive-value="2"
            :before-change="
              async () => {
                return await setStatus(scope.row)
              }
            "
          >
          </el-switch>
          <el-popover
            v-else
            title="提示"
            content="需要点击修改，配置必填项后才可启用。"
            placement="top"
          >
            <template #reference>
              <el-switch
                v-model="scope.row.status"
                disabled
                class="ml-2"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                active-text="启用"
                inactive-text="未配置"
                active-value="1"
                inactive-value="0"
              >
              </el-switch>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="remark" min-width="80" label="备注" align="center" />
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
    <el-dialog v-model="AddFlag" title="添加推送服务" width="500" :align-center="true">
      <div class="tags" v-if="serviceList.length !== 0">
        <el-tag
          class="tags-item"
          type="primary"
          effect="dark"
          round
          v-for="(value, index) in serviceList"
          :key="index"
          @click="submitAdd(value)"
          >{{ value }}</el-tag
        >
      </div>
      <div class="tags" v-else>
        <span>无可用服务</span>
      </div>
    </el-dialog>
    <el-dialog v-model="editFlag" :title="dialogTitle" width="800" :align-center="true">
      <el-form
        :model="form"
        label-width="auto"
        :rules="dynamicRules"
        ref="dynamicFormRef"
        style="max-width: 600px"
        class="centered-form"
      >
        <el-row
          :gutter="24"
          justify="space-between"
          v-for="(row, index) in formConfig"
          :key="index"
        >
          <el-col :span="12" v-for="col in row" :key="col.key">
            <el-form-item :label="col.title" :prop="col.dataKey">
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
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getServices,
  getNotifyList,
  getNotifyData,
  addNotify,
  deleteNotif,
  updateNotifyData,
  getNotifyDataColumn,
  updateStatus,
} from '../api/TaskNotify'

// 响应式数据
const columns = ref([])
const notifys = ref([])
// const primaryKey = ref('')
const loading = ref(true)
const switchLoading = ref(true)
const dialogTitle = ref('')
const AddFlag = ref(false)
const editFlag = ref(false)
const formConfig = ref([])
const dynamicRules = ref({})
const dynamicFormRef = ref()
const queryParams = ref({})
const form = ref({})
const editId = ref(undefined)
const serviceList = ref([])
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
const setStatus = async (rowData) => {
  switchLoading.value = true
  console.log('setStatus' + rowData)
  const { notifyName } = rowData
  await ElMessageBox.confirm(`确定要变更 ${notifyName} 任务状态吗?`, '状态变更', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  const { code, msg } = await updateStatus(rowData.id)
  if (code == 200) {
    ElMessage({
      message: msg,
      type: 'success',
    })
    console.log('success')
    switchLoading.value = false
    return true
  } else {
    ElMessage({
      message: msg,
      type: 'error',
    })
  }
  switchLoading.value = false
  return false
}
const getColumns = async (notifyId) => {
  const { code, msg, data } = await getNotifyDataColumn(notifyId)
  if (code == 200) {
    columns.value = data
    formConfig.value = formConfigbuild(columns.value)
    columns.value.forEach((field) => {
      form.value[field.dataKey] = form.value[field.dataKey] || ''
      dynamicRules.value[field.dataKey] = [] // 同上
      if (field.required) {
        dynamicRules.value[field.dataKey].push({
          required: true,
          message: `请输入${field.title}`,
          trigger: 'blur',
        })
      }
    })
  } else {
    ElMessage.error(msg)
  }
}
// 模拟获取列配置API
const submitUpdate = () => {
  if (!dynamicFormRef.value) return

  dynamicFormRef.value.validate((valid) => {
    if (valid) {
      // 验证通过，可以提交数据
      console.log('表单数据:', form.value)
      putNotifyData()
      // 此处添加您的提交逻辑，例如调用API
      // yourApiSubmit(formModel)
    } else {
      console.log('表单验证失败，请检查输入')
      return false
    }
  })
}
// 模拟获取表格数据API
const getNotifys = async () => {
  loading.value = true
  const { code, msg, data } = await getNotifyList()
  if (code == 200) {
    notifys.value = data
    loading.value = false
  } else {
    ElMessage.error(msg)
  }
}
const submitAdd = (val) => {
  notifyAdd(val)
}
const delNotif = async (id) => {
  const { code, msg } = await deleteNotif(id)
  if (code == 200) {
    ElMessage({
      message: msg,
      type: 'success',
    })
    getNotifys()
  } else {
    ElMessage.error(msg)
  }
}
const handleEdit = (rowData) => {
  const id = rowData.id

  getColumns(id)
  selectNotifyData(id)
  editFlag.value = true
  dialogTitle.value = rowData.notifyName + '修改'
  editId.value = id
}
const selectNotifyData = async (id) => {
  const { code, msg, data } = await getNotifyData(id)
  if (code == 200) {
    form.value = data
  } else {
    ElMessage.error(msg)
  }
}
const handleDelete = (rowData) => {
  const id = rowData.id
  const notifyName = rowData.notifyName
  ElMessageBox.confirm(`确定要删除${notifyName}推送服务吗?`, '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    delNotif(id)
    // ElMessage({
    //   message: '功能开发中',
    //   type: 'info',
    // })
  })
}
const onAdd = () => {
  serviceList.value = []
  AddFlag.value = true
  getServiceList()
}
const getServiceList = async () => {
  const { code, msg, data } = await getServices()
  if (code == 200) {
    serviceList.value = data
    // serviceList.value = [
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    //   // 'PushPlus',
    // ]
  } else {
    ElMessage.error(msg)
  }
}
const notifyAdd = async (val) => {
  const { code, msg } = await addNotify(val)
  if (code == 200) {
    ElMessage({
      message: msg,
      type: 'success',
    })
    AddFlag.value = false
    getNotifys()
  } else {
    ElMessage({
      message: msg,
      type: 'error',
    })
  }
}
const putNotifyData = async () => {
  const { code, msg } = await updateNotifyData(editId.value, form.value)
  if (code == 200) {
    ElMessage({
      message: msg,
      type: 'success',
    })
    editFlag.value = false
    getNotifys()
  } else {
    ElMessage({
      message: msg,
      type: 'error',
    })
  }
}

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
// const onSubmit = () => {
//   ElMessage({
//     message: '功能开发中',
//     type: 'info',
//   })
// }
// 组件挂载时加载数据
onMounted(() => {
  getNotifys()
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
.tags {
  /* display: flex;
  justify-content: space-between; */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  justify-content: center; /* 整个网格在容器内水平均匀分布 */
  gap: 20px;
}
.tags-item {
  max-width: 100px; /* 设置你期望的最大宽度 */
  box-sizing: border-box; /* 可选，但推荐使用 */
}
.tags-item {
  cursor: pointer; /* 鼠标悬停时显示手型指针 */
  transition: all 0.3s ease; /* 添加平滑过渡效果 */
}

/* 悬停状态样式 */
.tags-item:hover {
  transform: translateY(-2px); /* 轻微上浮效果 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影提升立体感 */
  opacity: 0.9; /* 轻微透明度变化 */
}

/* 或者使用背景色变化 */
.tags-item:hover {
  background-color: #409eff !important; /* 悬停时加深背景色 */
  border-color: #409eff !important;
}
</style>
