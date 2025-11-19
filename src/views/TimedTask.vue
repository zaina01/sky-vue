<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item>
        <el-button type="primary" @click="onAdd">添加</el-button>
      </el-form-item>
      <el-form-item label="任务名称">
        <el-input v-model="queryParams.jobName" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select
          v-model="queryParams.jobStatus"
          placeholder="请选择"
          clearable
          style="width: 100px"
          ><el-option
            v-for="item in statusMaps"
            :key="item.key"
            :label="item.label"
            :value="item.value"
        /></el-select>
      </el-form-item>
      <!-- <el-form-item label="输入3">
        <el-input v-model="queryParams.user" placeholder="请输入" clearable />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <div style="height: 80%">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            :columns="columns"
            :data="pagination.data"
            :width="width"
            :height="height"
            fixed
            v-loading="loading"
          />
        </template>
      </el-auto-resizer>
    </div>
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[8, 15, 20, 30]"
        :small="true"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="editFlag" title="修改" width="800" :align-center="true">
      <el-form :model="form" label-width="auto" style="max-width: 600px" class="centered-form">
        <!-- <el-row :gutter="24" justify="space-between">
          <el-col :span="12">
            <el-form-item label="id">
              <el-input v-model="form.jobId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称">
              <el-input v-model="form.jobName" />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="24" justify="space-between">
          <el-col :span="12"
            ><el-form-item label="cron表达式">
              <!-- <el-input v-model="form.cronExpression" />  -->
              <el-button @click="showCronEditor = true">{{
                form.cronExpression ? form.cronExpression : '编辑cron表达式'
              }}</el-button>
            </el-form-item></el-col
          >
        </el-row>
        <el-row :gutter="24" justify="space-between">
          <el-col :span="12"
            ><el-form-item label="错过触发处理策略">
              <el-select v-model="form.misfirePolicy"
                ><el-option
                  v-for="item in misfirePolicyMaps"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                /> </el-select></el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="并发执行策略">
              <el-select v-model="form.concurrent"
                ><el-option
                  v-for="item in concurrentMaps"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> </el-form-item
          ></el-col>
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
    <el-dialog v-model="addFlag" title="添加插件" width="390">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="http://localhost:8080/job/install"
        :limit="1"
        accept=".jar"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
      >
        <template #trigger>
          <el-button type="primary">选择</el-button>
        </template>
        <el-button class="ml-3" type="success" @click="submitUpload"> 安装 </el-button>
        <template #tip>
          <div class="el-upload__tip text-red">
            提示: 只支持安装jar包。请勿安装不明来源的插件，不明来源的插件可能包含后门或恶意脚本。
          </div>
        </template>
      </el-upload>
    </el-dialog>
    <!-- Cron表达式编辑器 -->
    <el-dialog title="Cron表达式编辑器" v-model="showCronEditor" width="800px" top="5vh">
      <cron-editor v-model="form.cronExpression" ref="cronEditorRef" />
      <template #footer>
        <el-button @click="showCronEditor = false">取消</el-button>
        <el-button type="primary" @click="validateCron">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { h, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { genFileId, ElMessage, ElMessageBox } from 'element-plus'
import CronEditor from '../components/CronEditor.vue'
import {
  updateJob,
  deleteJob,
  selectJobById,
  selectJobList,
  updateStatus,
  run,
} from '../api/TimedTask'
import { ElTooltip } from 'element-plus'

const cronEditorRef = ref(null)
const router = useRouter()
const queryParams = ref({
  pageNum: 1,
  pageSize: 8,
  jobName: undefined,
  jobStatus: undefined,
})
const loading = ref(true)
const pagination = ref({ data: [], total: 0 })
const upload = ref()
const addFlag = ref(false)
const editFlag = ref(false)
const form = ref({})
// const dataList = ref([])
const handleSizeChange = (newSize) => {
  queryParams.value.pageSize = newSize
  queryParams.value.pageNum = 1
  getJobList()
}
const handleCurrentChange = (newPage) => {
  queryParams.value.pageNum = newPage
  getJobList()
}
// const dataList = ref([
//   {
//     jobId: 1,
//     jobName: 'ooo',
//     jobGroup: 'ooo',
//     cronExpression: 'ooo',
//     jobStatus: 'ooo',
//     misfirePolicy: 'ooo',
//     concurrent: 'ooo',
//     invokeTarget: 'ooo',
//     invokeType: 'ooo',
//   },
// ])
const showCronEditor = ref(false)
const beforeUpload = (file) => {
  const isJar = file.name.endsWith('.jar')
  const isLt2M = file.size / 1024 / 1024 < 20
  if (!isJar) {
    ElMessage({
      message: '只能安装jar包插件!',
      type: 'error',
    })
    return false
  }
  if (!isLt2M) {
    console.log('上传大小不能超过 20MB!')
    ElMessage({
      message: '文件大小不能超过 20MB!',
      type: 'error',
    })
    return false
  }
  return true
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
  upload.value.submit()
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
  console.log(rowData)
  const { jobName } = rowData
  await ElMessageBox.confirm(`确定要变更 ${jobName} 任务状态吗?`, '状态变更', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  //    delJob(jobId)
  const { data } = await updateStatus(rowData)
  if (data.code == 200) {
    ElMessage({
      message: data.msg,
      type: 'success',
    })
    console.log('success')
    return true
  } else {
    ElMessage({
      message: data.msg,
      type: 'error',
    })
  }
  return false
}
const handleDelete = (rowData) => {
  console.log(rowData)
  const { jobId, jobName } = rowData
  ElMessageBox.confirm(`确定要卸载 ${jobName} 任务吗?`, '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    delJob(jobId)
    // ElMessage({
    //   message: '功能开发中',
    //   type: 'info',
    // })
  })
}
const delJob = async (id) => {
  const { data } = await deleteJob(id)
  if (data.code == 200) {
    ElMessage({
      message: data.msg,
      type: 'success',
    })
  } else {
    ElMessage({
      message: data.msg,
      type: 'error',
    })
  }
  getJobList()
}
const onAdd = () => {
  addFlag.value = true
}
const submitUpdate = async () => {
  const { data } = await updateJob(form.value)
  if (data.code == 200) {
    ElMessage({
      message: data.msg,
      type: 'success',
    })
    editFlag.value = false
    getJobList()
  }
}
const onSubmit = () => {
  // ElMessage({
  //   message: '功能开发中',
  //   type: 'info',
  // })
  getJobList()
}
const handleEdit = (rowData) => {
  editFlag.value = true
  console.log(rowData)
  getJob(rowData.jobId)
}
onMounted(() => {
  console.log(111)
  getJobList()
})
const getJobList = async () => {
  loading.value = true
  const { data } = await selectJobList(queryParams.value)
  if (data.code == 200) {
    pagination.value.data = data.data.list
    pagination.value.total = data.data.total
    loading.value = false
  } else {
    ElMessage.error(data.msg)
  }
}
const getJob = async (id) => {
  const { data } = await selectJobById(id)
  if (data.code == 200) {
    form.value = data.data
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
  }).then(() => {
    runJob(rowData)
    // ElMessage({
    //   message: '功能开发中',
    //   type: 'info',
    // })
  })
}
const runJob = async (job) => {
  const { data } = await run(job)
  if (data.code == 200) {
    ElMessage({
      message: data.msg,
      type: 'success',
    })
  } else {
    ElMessage({
      message: data.msg,
      type: 'error',
    })
  }
}
const columns = ref([
  {
    key: 'jobId',
    dataKey: 'jobId',
    title: '任务id',
    width: 60,
    align: 'center',
  },
  {
    key: 'jobName',
    dataKey: 'jobName',
    title: '任务名称',
    width: 130,
    align: 'center',
    cellRenderer: ({ rowData }) => {
      return h(
        ElTooltip,
        {
          placement: 'top',
          effect: 'light',
          content: rowData.remark, // 提示内容
        },
        {
          // default 插槽：触发提示的元素
          default: () => h('span', { class: 'cell-text' }, rowData.jobName),
        },
      )
    },
  },
  {
    key: 'cronExpression',
    dataKey: 'cronExpression',
    title: 'cron表达式',
    width: 180,
    align: 'center',
  },
  {
    key: 'jobStatus',
    dataKey: 'jobStatus',
    title: '状态',
    width: 80,
    align: 'center',
    cellRenderer: ({ rowData }) => (
      <div class="action-buttons">
        <el-switch
          v-model={[rowData.jobStatus, 'modelValue']}
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="启用"
          inactive-text="禁用"
          active-value="0"
          inactive-value="1"
          beforeChange={async () => {
            return await setStatus(rowData)
          }}
        />
      </div>
    ),
  },
  {
    key: 'misfirePolicy',
    dataKey: 'misfirePolicy',
    title: '错过触发处理策略',
    width: 130,
    align: 'center',
    cellRenderer: ({ cellData }) => {
      return misfirePolicyMap[cellData] || cellData
    },
  },
  {
    key: 'concurrent',
    dataKey: 'concurrent',
    title: '并发执行策略',
    width: 100,
    align: 'center',
    cellRenderer: ({ cellData }) => {
      return concurrentMap[cellData] || cellData
    },
  },
  {
    key: 'version',
    dataKey: 'version',
    title: '版本',
    width: 90,
    align: 'center',
  },
  {
    key: 'author',
    dataKey: 'author',
    title: '作者',
    width: 100,
    align: 'center',
  },
  {
    key: 'action',
    title: '操作',
    width: 305,
    align: 'center',
    cellRenderer: ({ rowData }) => (
      <div class="action-buttons">
        <el-button
          size="small"
          type="primary"
          onClick={() => {
            execute(rowData)
          }}
        >
          运行
        </el-button>
        <el-button
          size="small"
          type="success"
          onClick={() => {
            handleUser(rowData)
          }}
        >
          账号
        </el-button>
        <el-button
          size="small"
          type="info"
          onClick={() => {
            handleLog(rowData)
          }}
        >
          日志
        </el-button>
        <el-button
          size="small"
          type="warning"
          onClick={() => {
            handleEdit(rowData)
          }}
        >
          修改
        </el-button>
        <el-button
          size="small"
          type="danger"
          onClick={() => {
            handleDelete(rowData)
          }}
        >
          卸载
        </el-button>
      </div>
    ),
  },
])
</script>
<style scoped>
.text-red {
  color: red;
}
.app-container {
  width: 100%;
  height: 95%;
  /* overflow: auto; */
}
/* .auto-resizer {
  width: 100%;
  max-height: 80%;
} */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 10px 0;
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
