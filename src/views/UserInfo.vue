<template>
  <div class="profile-container">
    <el-row :gutter="24">
      <!-- 左侧个人信息卡片 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="6">
        <div class="profile-card">
          <div class="profile-header">
            <div class="profile-avatar-wrapper">
              <el-avatar :size="100" :src="userStore.userAvatar" class="profile-avatar" />
              <div class="avatar-upload" @click="triggerAvatarUpload">
                <el-icon><Camera /></el-icon>
              </div>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleAvatarChange"
              />
            </div>
            <h2 class="profile-name">{{ userStore.displayName }}</h2>
            <!-- <div class="profile-role">
              <el-tag type="primary">{{ userInfo.role }}</el-tag>
            </div> -->
            <!-- <div class="profile-status">
              <el-icon class="status-icon"><CircleCheck /></el-icon>
              <span>在线状态</span>
            </div> -->
          </div>

          <div class="profile-info">
            <div class="info-item">
              <el-icon><User /></el-icon>
              <div class="info-content">
                <div class="info-label">用户ID</div>
                <div class="info-value">{{ userStore.userInfo.userId }}</div>
              </div>
            </div>
            <!-- <div class="info-item">
              <el-icon><Message /></el-icon>
              <div class="info-content">
                <div class="info-label">邮箱</div>
                <div class="info-value">{{ userInfo.email }}</div>
              </div>
            </div> -->
            <!-- <div class="info-item">
              <el-icon><Phone /></el-icon>
              <div class="info-content">
                <div class="info-label">手机</div>
                <div class="info-value">{{ userInfo.phone }}</div>
              </div>
            </div> -->
            <div class="info-item">
              <el-icon><Calendar /></el-icon>
              <div class="info-content">
                <div class="info-label">注册时间</div>
                <div class="info-value">{{ formatDateTime(userStore.userInfo.registerTime) }}</div>
              </div>
            </div>
          </div>
          <div class="logout-section">
            <el-button
              class="logout-btn"
              type="danger"
              plain
              :icon="SwitchButton"
              @click="handleLogout"
            >
              退出登录
            </el-button>
          </div>
          <!-- <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-number">{{ userInfo.stats.loginDays }}</div>
              <div class="stat-label">登录天数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ userInfo.stats.completedTasks }}</div>
              <div class="stat-label">完成数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ userInfo.stats.onlineHours }}h</div>
              <div class="stat-label">在线时长</div>
            </div>
          </div> -->
        </div>
      </el-col>

      <!-- 右侧内容区域 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="18">
        <div class="profile-content">
          <!-- 基本信息卡片 -->
          <!-- <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <el-icon><UserFilled /></el-icon>
                <span>基本信息</span>
              </div>
            </template>
            <el-form
              ref="profileFormRef"
              :model="profileForm"
              label-width="100px"
              class="profile-form"
            >
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="profileForm.username" placeholder="请输入用户名" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="部门" prop="department">
                    <el-input v-model="profileForm.department" placeholder="请输入部门" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="个人简介" prop="bio">
                    <el-input
                      v-model="profileForm.bio"
                      type="textarea"
                      :rows="3"
                      placeholder="请输入个人简介"
                      maxlength="200"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="form-actions">
                <el-button type="primary" @click="saveProfile">保存信息</el-button>
                <el-button @click="resetForm">重置</el-button>
              </div>
            </el-form>
          </el-card> -->

          <!-- 安全设置卡片 -->
          <el-card class="security-card">
            <template #header>
              <div class="card-header">
                <el-icon><Lock /></el-icon>
                <span>安全设置</span>
              </div>
            </template>
            <div class="security-list">
              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">登录密码</div>
                  <div class="security-desc">定期修改密码可提高账户安全性</div>
                </div>
                <el-button type="primary" link @click="showPasswordDialog">修改</el-button>
              </div>
              <el-divider />
              <!-- <div class="security-item">
                <div class="security-info">
                  <div class="security-title">两步验证</div>
                  <div class="security-desc">为您的账户增加一层额外的安全保障</div>
                </div>
                <el-switch v-model="twoFactorEnabled" />
              </div>
              <el-divider /> -->
              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">登录设备</div>
                  <div class="security-desc">查看您的账户在哪些设备上登录过</div>
                </div>
                <el-button type="primary" link @click="showDevices">查看</el-button>
              </div>
            </div>
          </el-card>

          <!-- 最近活动卡片 -->
          <!-- <el-card class="activity-card">
            <template #header>
              <div class="card-header">
                <el-icon><Clock /></el-icon>
                <span>最近活动</span>
              </div>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in recentActivities"
                :key="index"
                :timestamp="activity.time"
                :type="activity.type"
              >
                <div class="activity-item">
                  <div class="activity-icon">
                    <el-icon v-if="activity.type === 'success'"><CircleCheck /></el-icon>
                    <el-icon v-if="activity.type === 'info'"><InfoFilled /></el-icon>
                    <el-icon v-if="activity.type === 'warning'"><Warning /></el-icon>
                  </div>
                  <div class="activity-content">
                    <div class="activity-title">{{ activity.title }}</div>
                    <div class="activity-desc">{{ activity.description }}</div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-card> -->
        </div>
      </el-col>
    </el-row>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="400px"
      :before-close="handlePasswordDialogClose"
      :show-close="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请确认新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="changePassword">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import {
  Camera,
  User,
  // Message,
  // Phone,
  Calendar,
  // UserFilled,
  Lock,
  // Clock,
  // CircleCheck,
  // InfoFilled,
  // Warning,
  SwitchButton,
} from '@element-plus/icons-vue'
const router = useRouter()
const passwordDialogVisible = ref(false)
// const twoFactorEnabled = ref(false)
const avatarInput = ref(null)
// const profileFormRef = ref(null)
const passwordFormRef = ref(null)
const userStore = useUserStore()
// 用户信息
// const userInfo = reactive({
//   userId: 'SKY2024001',
//   username: '管理员',
//   email: 'admin@sky.com',
//   phone: '13800138000',
//   role: '超级管理员',
//   avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
//   registerTime: '2024-01-01',
//   stats: {
//     loginDays: 365,
//     completedTasks: 128,
//     onlineHours: 2084,
//   },
// })

// 个人资料表单
// const profileForm = reactive({
//   username: '管理员',
//   email: 'admin@sky.com',
//   phone: '13800138000',
//   department: '技术部',
//   bio: '热爱技术，专注于系统管理与优化',
// })
// const profileForm = reactive({
//   username: userStore.userInfo.username,
// })
// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 密码验证规则
const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '-'
  const date = new Date(dateTimeStr)
  return date.toLocaleString('zh-CN')
}
// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      // 调用用户仓库的退出登录方法
      await userStore.logout()
      // ElMessage.success('已成功退出登录')
      // 跳转到登录页
      router.push('/login')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 最近活动数据
// const recentActivities = [
//   {
//     time: '2024-01-13 09:30',
//     title: '修改个人信息',
//     description: '更新了个人简介信息',
//     type: 'success',
//   },
//   {
//     time: '2024-01-12 16:20',
//     title: '系统登录',
//     description: '从新设备登录系统',
//     type: 'info',
//   },
//   {
//     time: '2024-01-12 10:15',
//     title: '密码修改提醒',
//     description: '距离上次修改密码已超过90天',
//     type: 'warning',
//   },
//   {
//     time: '2024-01-11 14:00',
//     title: '完成推送任务',
//     description: '成功推送了1000条消息',
//     type: 'success',
//   },
//   {
//     time: '2024-01-10 11:30',
//     title: '系统通知',
//     description: '系统维护通知，预计1小时后恢复正常',
//     type: 'info',
//   },
// ]

const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      ElMessage.error('图片大小不能超过2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      userStore.userInfo.avatar = e.target.result
      ElMessage.success('头像上传成功')
    }
    reader.readAsDataURL(file)
  }
  event.target.value = '' // 重置input
}

const showPasswordDialog = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordDialogVisible.value = true
}

const handlePasswordDialogClose = (done) => {
  ElMessageBox.confirm('确定要放弃修改密码吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      done()
    })
    .catch(() => {})
}

const changePassword = () => {
  passwordFormRef.value?.validate(async (valid) => {
    if (valid) {
      // 这里调用修改密码的API
      const flag = await userStore.changePassword(passwordForm)
      if (flag) {
        passwordDialogVisible.value = false
      }
    }
  })
}

// const saveProfile = () => {
//   profileFormRef.value?.validate((valid) => {
//     if (valid) {
//       // 这里调用保存个人资料的API
//       userInfo.username = profileForm.username
//       userInfo.email = profileForm.email
//       userInfo.phone = profileForm.phone
//       ElMessage.success('个人信息保存成功')
//     }
//   })
// }

// const resetForm = () => {
//   Object.assign(profileForm, {
//     username: '管理员',
//     email: 'admin@sky.com',
//     phone: '13800138000',
//     department: '技术部',
//     bio: '热爱技术，专注于系统管理与优化',
//   })
//   ElMessage.info('表单已重置')
// }

const showDevices = () => {
  ElMessage.info('查看登录设备功能开发中')
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 个人信息卡片 */
.profile-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.profile-card:hover {
  box-shadow: 0 8px 30px rgba(82, 175, 213, 0.15);
  transform: translateY(-2px);
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.profile-avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  transform: scale(1.05);
  border-color: #52afd5;
}

.avatar-upload {
  position: absolute;
  right: 0;
  bottom: 0;
  background: #52afd5;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid white;
}

.avatar-upload:hover {
  background: #4096ff;
  transform: scale(1.1);
}

.profile-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 10px 0;
}

.profile-role {
  margin: 10px 0;
}

.profile-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #52afd5 0%, #88c8ee 100%);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  margin-top: 10px;
}

.status-icon {
  font-size: 16px;
  animation: pulse 2s infinite;
}

/* 退出登录按钮样式 */
.logout-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.logout-btn {
  width: 100%;
  border-radius: 8px;
  height: 40px;
  transition: all 0.3s ease;
  border-width: 2px;
  font-weight: 500;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

.profile-info {
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 0;
  margin: 20px 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: linear-gradient(90deg, rgba(82, 175, 213, 0.1) 0%, transparent 100%);
  padding-left: 12px;
  border-radius: 6px;
}

.info-item .el-icon {
  color: #52afd5;
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #52afd5;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

/* 内容区域卡片 */
.info-card,
.security-card,
.activity-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-card::before,
.security-card::before,
.activity-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #52afd5 0%, #88c8ee 100%);
}

.info-card:hover,
.security-card:hover,
.activity-card:hover {
  box-shadow: 0 8px 30px rgba(82, 175, 213, 0.15);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 0 10px 0;
  border-bottom: 2px solid #f0f0f0;
}

.card-header .el-icon {
  color: #52afd5;
  font-size: 20px;
}

.card-header span {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 表单样式 */
.profile-form {
  margin-top: 20px;
}

.profile-form .el-form-item {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 安全设置 */
.security-list {
  padding: 10px 0;
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.security-info {
  flex: 1;
}

.security-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.security-desc {
  font-size: 13px;
  color: #666;
}

/* 活动时间线 */
.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon .el-icon {
  color: white;
  font-size: 16px;
}

:deep(.el-timeline-item__node--success) .activity-icon {
  background: #67c23a;
}

:deep(.el-timeline-item__node--info) .activity-icon {
  background: #909399;
}

:deep(.el-timeline-item__node--warning) .activity-icon {
  background: #e6a23c;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.activity-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #52afd5 0%, #68b2dd 100%);
  /* margin: 5px 15px 0px; */
  padding: 20px;
  border-radius: 12px;
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #333;
}

:deep(.el-dialog__body) {
  padding: 30px 20px 20px;
}

:deep(.el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式调整 */
@media screen and (max-width: 991px) {
  .profile-card {
    padding: 20px;
  }

  .profile-name {
    font-size: 20px;
  }

  .profile-stats {
    flex-direction: column;
    gap: 20px;
  }
}

@media screen and (max-width: 767px) {
  .profile-container {
    padding: 12px;
  }

  .profile-card {
    padding: 15px;
  }

  .profile-avatar {
    width: 80px !important;
    height: 80px !important;
  }

  .profile-name {
    font-size: 18px;
  }

  .profile-content {
    margin-top: 20px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-card {
  animation: fadeInUp 0.5s ease-out;
}

.info-card {
  animation: fadeInUp 0.5s ease-out 0.1s;
  animation-fill-mode: both;
}

.security-card {
  animation: fadeInUp 0.5s ease-out 0.2s;
  animation-fill-mode: both;
}

.activity-card {
  animation: fadeInUp 0.5s ease-out 0.3s;
  animation-fill-mode: both;
}
</style>
