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
        <el-input v-model="queryParams.jobStatus" placeholder="请输入" clearable />
      </el-form-item>
      <!-- <el-form-item label="输入3">
        <el-input v-model="queryParams.user" placeholder="请输入" clearable />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="auto-resizer">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2 :columns="columns" :data="dataList" :width="width" :height="height" fixed />
        </template>
      </el-auto-resizer>
    </div>
    <el-dialog v-model="editFlag" title="修改" width="800" :align-center="true">
      <el-form :model="form" label-width="auto" style="max-width: 600px" class="centered-form">
        <el-row :gutter="24" justify="space-between">
          <el-col :span="12">
            <el-form-item label="id">
              <el-input v-model="form.id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称">
              <el-input v-model="form.jobName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" justify="space-between">
          <el-col :span="12"
            ><el-form-item label="任务组"> <el-input v-model="form.jobGroup" /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="cron表达式">
              <el-input v-model="form.cronExpression" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="24" justify="space-between">
          <el-col :span="12"
            ><el-form-item label="状态"> <el-input v-model="form.jobStatus" /> </el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="错过触发处理策略">
              <el-input v-model="form.misfirePolicy" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="24" justify="space-between">
          <el-col :span="12">
            <el-form-item label="并发执行策略">
              <el-input v-model="form.concurrent" /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item label="调用目标"> <el-input v-model="form.invokeTarget" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="24" justify="space-between">
          <el-col :span="12">
            <el-form-item label="调用类型">
              <el-input v-model="form.invokeType" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" justify="end">
          <el-col :span="4">
            <el-button type="danger">取消</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary">确定</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog v-model="addFlag" title="添加插件" width="390">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="/upload"
        :limit="1"
        accept=".jar"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :before-upload="beforeUpload"
      >
        <template #trigger>
          <el-button type="primary">选择</el-button>
        </template>
        <el-button class="ml-3" type="success" @click="submitUpload"> 安装 </el-button>
        <template #tip>
          <div class="el-upload__tip text-red">提示: 只支持安装jar包</div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script setup lang="jsx">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { genFileId, ElMessage } from 'element-plus'
const router = useRouter()
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  jobName: '',
  jobStatus: undefined,
})
const upload = ref()
const addFlag = ref(false)
const editFlag = ref(false)
const form = ref({})
const dataList = ref([
  {
    jobId: 1,
    jobName: 'ooo',
    jobGroup: 'ooo',
    cronExpression: 'ooo',
    jobStatus: 'ooo',
    misfirePolicy: 'ooo',
    concurrent: 'ooo',
    invokeTarget: 'ooo',
    invokeType: 'ooo',
  },
])
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
const submitUpload = () => {
  upload.value.submit()
}
const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}
const handleUser = (rowData) => {
  console.log(rowData.id)
  router.push('/test/' + rowData.id)
}
const handleDelete = () => {
  console.log('handleDelete')
}
const onAdd = () => {
  addFlag.value = true
}
const onSubmit = () => {}
const handleEdit = () => {
  editFlag.value = true
}
const columns = ref([
  {
    key: 'jobId',
    dataKey: 'jobId',
    title: '任务id',
    width: 80,
    align: 'center',
  },
  {
    key: 'jobName',
    dataKey: 'jobName',
    title: '任务名称',
    width: 100,
    align: 'center',
  },
  {
    key: 'jobGroup',
    dataKey: 'jobGroup',
    title: '任务组',
    width: 80,
    align: 'center',
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
  },
  {
    key: 'misfirePolicy',
    dataKey: 'misfirePolicy',
    title: '错过触发处理策略',
    width: 130,
    align: 'center',
  },
  {
    key: 'concurrent',
    dataKey: 'concurrent',
    title: '并发执行策略',
    width: 100,
    align: 'center',
  },
  {
    key: 'invokeTarget',
    dataKey: 'invokeTarget',
    title: '调用目标',
    width: 100,
    align: 'center',
  },
  {
    key: 'invokeType',
    dataKey: 'invokeType',
    title: '调用类型',
    width: 80,
    align: 'center',
  },
  {
    key: 'action',
    title: '操作',
    width: 250,
    align: 'center',
    cellRenderer: ({ rowData }) => (
      <div class="action-buttons">
        <el-button
          size="small"
          type="primary"
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
            handleDelete(rowData)
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
          删除
        </el-button>
      </div>
    ),
  },
])
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
