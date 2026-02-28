<template>
  <div class="about-container">
    <!-- 页面标题区域 -->
    <!-- <div class="page-header">
      <div class="page-title">
        <el-icon><InfoFilled /></el-icon>
        <h1>关于系统</h1>
      </div>
      <div class="page-subtitle">了解 sky 管理系统的详细信息</div>
    </div> -->

    <el-row :gutter="24">
      <!-- 左侧系统信息卡片 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="6">
        <div class="about-card system-card">
          <div class="system-logo-wrapper">
            <div class="system-logo">
              <el-icon><Platform /></el-icon>
            </div>
            <h2 class="system-name">sky 管理系统</h2>
            <div class="system-version">
              <el-tag type="success">v1.0.1</el-tag>
            </div>
          </div>

          <!-- <div class="system-info">
            <div class="info-item">
              <el-icon><Calendar /></el-icon>
              <div class="info-content">
                <div class="info-label">发布日期</div>
                <div class="info-value">2024-01-15</div>
              </div>
            </div>
            <div class="info-item">
              <el-icon><Timer /></el-icon>
              <div class="info-content">
                <div class="info-label">最后更新</div>
                <div class="info-value">2024-01-20</div>
              </div>
            </div>
            <div class="info-item">
              <el-icon><UserFilled /></el-icon>
              <div class="info-content">
                <div class="info-label">开发者</div>
                <div class="info-value">sky 技术团队</div>
              </div>
            </div>
            <div class="info-item">
              <el-icon><Service /></el-icon>
              <div class="info-content">
                <div class="info-label">技术支持</div>
                <div class="info-value">support@sky.com</div>
              </div>
            </div>
          </div> -->

          <!-- <div class="system-stats">
            <div class="stat-item">
              <div class="stat-number">5,280+</div>
              <div class="stat-label">活跃用户</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">99.8%</div>
              <div class="stat-label">系统可用性</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">在线服务</div>
            </div>
          </div> -->
        </div>
      </el-col>

      <!-- 右侧内容区域 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="18">
        <div class="about-content">
          <!-- 系统介绍卡片 -->
          <el-card class="intro-card">
            <template #header>
              <div class="card-header">
                <el-icon><Document /></el-icon>
                <span>系统介绍</span>
              </div>
            </template>
            <div class="intro-content">
              <p class="intro-text">
                sky
                管理系统是一款动态运行插件的管理平台，提供全面的插件管理、推送服务和加载器配置功能。
                系统采用现代化的技术架构，具备高性能、高可用性和易扩展的特点。
              </p>
              <div class="features">
                <h3>核心功能</h3>
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12" :md="8" v-for="feature in features" :key="feature.id">
                    <div class="feature-item">
                      <div class="feature-icon" :style="{ background: feature.color }">
                        <el-icon><component :is="feature.icon" /></el-icon>
                      </div>
                      <div class="feature-info">
                        <div class="feature-title">{{ feature.title }}</div>
                        <div class="feature-desc">{{ feature.desc }}</div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>

          <!-- 版本历史卡片 -->
          <!-- <el-card class="version-card">
            <template #header>
              <div class="card-header">
                <el-icon><Histogram /></el-icon>
                <span>版本历史</span>
              </div>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="version in versions"
                :key="version.id"
                :timestamp="version.date"
                :type="version.type"
                :hollow="version.type === 'success'"
              >
                <div class="version-item">
                  <div class="version-header">
                    <span class="version-tag">v{{ version.number }}</span>
                    <span class="version-title">{{ version.title }}</span>
                  </div>
                  <div class="version-desc">{{ version.desc }}</div>
                  <div class="version-changes" v-if="version.changes">
                    <div class="change-item" v-for="change in version.changes" :key="change">
                      <el-icon :class="change.type" :size="12">
                        <component :is="change.icon" />
                      </el-icon>
                      <span>{{ change.text }}</span>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-card> -->

          <!-- 技术栈卡片 -->
          <el-card class="tech-card">
            <template #header>
              <div class="card-header">
                <el-icon><Cpu /></el-icon>
                <span>技术栈</span>
              </div>
            </template>
            <div class="tech-stack">
              <div class="tech-category">
                <h3>前端技术</h3>
                <div class="tech-tags">
                  <el-tag type="info">Vue 3</el-tag>
                  <el-tag type="info">Element Plus</el-tag>
                  <el-tag type="info">Vite</el-tag>
                  <!-- <el-tag type="info">TypeScript</el-tag> -->
                  <el-tag type="info">Pinia</el-tag>
                </div>
              </div>
              <div class="tech-category">
                <h3>后端技术</h3>
                <div class="tech-tags">
                  <el-tag type="warning">Spring Boot</el-tag>
                  <el-tag type="warning">MyBatis Plus</el-tag>
                  <el-tag type="warning">MySQL</el-tag>
                  <el-tag type="warning">Redis</el-tag>
                  <el-tag type="warning">WebSocket</el-tag>
                </div>
              </div>
              <div class="tech-category">
                <h3>部署运维</h3>
                <div class="tech-tags">
                  <el-tag type="success">Docker</el-tag>
                  <!-- <el-tag type="success">Nginx</el-tag>
                  <el-tag type="success">Jenkins</el-tag>
                  <el-tag type="success">阿里云</el-tag> -->
                </div>
              </div>
            </div>
          </el-card>

          <!-- 联系支持卡片 -->
          <!-- <el-card class="support-card">
            <template #header>
              <div class="card-header">
                <el-icon><Headset /></el-icon>
                <span>联系支持</span>
              </div>
            </template>
            <div class="support-content">
              <div class="contact-methods">
                <div class="contact-item">
                  <div class="contact-icon">
                    <el-icon><Message /></el-icon>
                  </div>
                  <div class="contact-info">
                    <div class="contact-title">技术支持邮箱</div>
                    <div class="contact-detail">support@sky.com</div>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">
                    <el-icon><Phone /></el-icon>
                  </div>
                  <div class="contact-info">
                    <div class="contact-title">客服热线</div>
                    <div class="contact-detail">400-888-8888</div>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">
                    <el-icon><Clock /></el-icon>
                  </div>
                  <div class="contact-info">
                    <div class="contact-title">服务时间</div>
                    <div class="contact-detail">周一至周五 9:00-18:00</div>
                  </div>
                </div>
              </div>
              <div class="support-actions">
                <el-button type="primary" @click="showFeedbackDialog">
                  <el-icon><ChatDotRound /></el-icon>
                  反馈问题
                </el-button>
                <el-button type="success" @click="checkUpdate">
                  <el-icon><Refresh /></el-icon>
                  检查更新
                </el-button>
                <el-button type="info" @click="viewDocument">
                  <el-icon><Document /></el-icon>
                  查看文档
                </el-button>
              </div>
            </div>
          </el-card> -->
        </div>
      </el-col>
    </el-row>

    <!-- 反馈对话框 -->
    <el-dialog
      v-model="feedbackDialogVisible"
      title="问题反馈"
      width="500px"
      :before-close="handleFeedbackClose"
      :show-close="false"
    >
      <el-form
        ref="feedbackFormRef"
        :model="feedbackForm"
        :rules="feedbackRules"
        label-width="80px"
      >
        <el-form-item label="反馈类型" prop="type">
          <el-select v-model="feedbackForm.type" placeholder="请选择反馈类型">
            <el-option label="功能建议" value="suggestion" />
            <el-option label="问题反馈" value="bug" />
            <el-option label="使用咨询" value="question" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="feedbackForm.contact" placeholder="请输入邮箱或手机号" />
        </el-form-item>
        <el-form-item label="反馈内容" prop="content">
          <el-input
            v-model="feedbackForm.content"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您的问题或建议"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="feedbackDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  InfoFilled,
  Platform,
  Calendar,
  Timer,
  UserFilled,
  Service,
  Document,
  Histogram,
  Cpu,
  Headset,
  Message,
  Phone,
  Clock,
  ChatDotRound,
  Refresh,
  Promotion,
  Setting,
  Monitor,
  Lock,
  CircleCheck,
  CircleClose,
  Tools,
} from '@element-plus/icons-vue'

const feedbackDialogVisible = ref(false)
const feedbackFormRef = ref(null)

// 功能特性数据
const features = reactive([
  {
    id: 1,
    title: '推送管理',
    desc: '高效的消息推送系统，支持多种推送方式',
    icon: Promotion,
    color: 'linear-gradient(135deg, #52afd5 0%, #88c8ee 100%)',
  },
  {
    id: 2,
    title: '加载器管理',
    desc: '灵活的资源加载配置，支持动态调整',
    icon: Setting,
    color: 'linear-gradient(135deg, #f56c6c 0%, #f89898 100%)',
  },
  {
    id: 3,
    title: '实时日志',
    desc: '任务运行日志,实时查看',
    icon: Monitor,
    color: 'linear-gradient(135deg, #67c23a 0%, #95d475 100%)',
  },
  // {
  //   id: 4,
  //   title: '权限管理',
  //   desc: '精细化的权限控制，确保数据安全',
  //   icon: Lock,
  //   color: 'linear-gradient(135deg, #e6a23c 0%, #f0c78a 100%)',
  // },
  // {
  //   id: 5,
  //   title: '数据统计',
  //   desc: '多维度的数据统计与分析',
  //   icon: Histogram,
  //   color: 'linear-gradient(135deg, #909399 0%, #b1b3b8 100%)',
  // },
  // {
  //   id: 6,
  //   title: '系统维护',
  //   desc: '完善的系统维护和管理工具',
  //   icon: Tools,
  //   color: 'linear-gradient(135deg, #8e44ad 0%, #c39bd3 100%)',
  // },
])

// 版本历史数据
const versions = reactive([
  {
    id: 1,
    number: '3.2.1',
    date: '2024-01-20',
    title: '性能优化',
    desc: '系统性能优化和已知问题修复',
    type: 'success',
    changes: [
      { icon: CircleCheck, text: '优化推送管理模块性能', type: 'success' },
      { icon: CircleCheck, text: '修复加载器管理页面显示问题', type: 'success' },
      { icon: CircleCheck, text: '提升系统响应速度', type: 'success' },
    ],
  },
  {
    id: 2,
    number: '3.2.0',
    date: '2024-01-15',
    title: '新增功能',
    desc: '新增用户行为分析模块',
    type: 'primary',
    changes: [
      { icon: CircleCheck, text: '新增用户行为分析功能', type: 'success' },
      { icon: CircleCheck, text: '优化个人中心界面', type: 'success' },
      { icon: CircleClose, text: '修复部分浏览器兼容性问题', type: 'danger' },
    ],
  },
  {
    id: 3,
    number: '3.1.0',
    date: '2024-01-05',
    title: '功能增强',
    desc: '推送管理功能增强',
    type: 'info',
    changes: [
      { icon: CircleCheck, text: '推送管理支持批量操作', type: 'success' },
      { icon: CircleCheck, text: '新增数据导出功能', type: 'success' },
    ],
  },
  {
    id: 4,
    number: '3.0.0',
    date: '2023-12-20',
    title: '重大更新',
    desc: '全新架构升级',
    type: 'warning',
    changes: [
      { icon: CircleCheck, text: '系统架构全面升级', type: 'success' },
      { icon: CircleCheck, text: '引入全新的UI设计', type: 'success' },
      { icon: CircleCheck, text: '性能提升50%', type: 'success' },
    ],
  },
])

// 反馈表单
const feedbackForm = reactive({
  type: '',
  contact: '',
  content: '',
})

// 反馈验证规则
const feedbackRules = {
  type: [{ required: true, message: '请选择反馈类型', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  content: [
    { required: true, message: '请输入反馈内容', trigger: 'blur' },
    { min: 10, message: '反馈内容至少10个字符', trigger: 'blur' },
  ],
}

// 显示反馈对话框
const showFeedbackDialog = () => {
  feedbackForm.type = ''
  feedbackForm.contact = ''
  feedbackForm.content = ''
  feedbackDialogVisible.value = true
}

// 处理反馈对话框关闭
const handleFeedbackClose = (done) => {
  if (feedbackForm.content.trim() !== '') {
    ElMessageBox.confirm('确定要放弃已填写的内容吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        done()
      })
      .catch(() => {})
  } else {
    done()
  }
}

// 提交反馈
const submitFeedback = () => {
  feedbackFormRef.value?.validate((valid) => {
    if (valid) {
      // 这里调用提交反馈的API
      ElMessage.success('感谢您的反馈，我们会尽快处理！')
      feedbackDialogVisible.value = false
    }
  })
}

// 检查更新
const checkUpdate = () => {
  ElMessage.info('当前已是最新版本')
}

// 查看文档
const viewDocument = () => {
  ElMessage.success('正在跳转到文档页面...')
  // window.open('https://docs.sky.com', '_blank')
}
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面标题区域 */
.page-header {
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
  border-radius: 12px;
  border-left: 4px solid #52afd5;
  animation: fadeInUp 0.5s ease-out;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.page-title .el-icon {
  color: #52afd5;
  font-size: 32px;
}

.page-title h1 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin-left: 44px;
}

/* 系统信息卡片 */
.about-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out 0.1s;
  animation-fill-mode: both;
}

.about-card:hover {
  box-shadow: 0 8px 30px rgba(82, 175, 213, 0.15);
  transform: translateY(-2px);
}

.system-logo-wrapper {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.system-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #52afd5 0%, #88c8ee 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.system-logo:hover {
  transform: rotate(15deg) scale(1.1);
}

.system-logo .el-icon {
  color: white;
  font-size: 40px;
}

.system-name {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 10px 0;
}

.system-version {
  margin-top: 8px;
}

.system-info {
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

.system-stats {
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
.intro-card,
.version-card,
.tech-card,
.support-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.intro-card::before,
.version-card::before,
.tech-card::before,
.support-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #52afd5 0%, #88c8ee 100%);
}

.intro-card:hover,
.version-card:hover,
.tech-card:hover,
.support-card:hover {
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

/* 功能介绍样式 */
.intro-content {
  padding: 20px 0;
}

.intro-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 30px;
}

.features {
  margin-top: 30px;
}

.features h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #f9f9f9;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: linear-gradient(90deg, rgba(82, 175, 213, 0.1) 0%, transparent 100%);
  transform: translateX(5px);
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon .el-icon {
  color: white;
  font-size: 20px;
}

.feature-info {
  flex: 1;
}

.feature-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

/* 版本历史样式 */
.version-item {
  padding: 8px 0;
}

.version-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.version-tag {
  background: #52afd5;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.version-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.version-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.version-changes {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
}

.change-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
}

.change-item:last-child {
  margin-bottom: 0;
}

.change-item .el-icon.success {
  color: #67c23a;
}

.change-item .el-icon.danger {
  color: #f56c6c;
}

/* 技术栈样式 */
.tech-stack {
  padding: 20px 0;
}

.tech-category {
  margin-bottom: 24px;
}

.tech-category:last-child {
  margin-bottom: 0;
}

.tech-category h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tags .el-tag {
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 500;
}

/* 联系支持样式 */
.support-content {
  padding: 20px 0;
}

.contact-methods {
  margin-bottom: 30px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background: #f9f9f9;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.contact-item:hover {
  background: linear-gradient(90deg, rgba(82, 175, 213, 0.1) 0%, transparent 100%);
  transform: translateX(5px);
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #52afd5 0%, #88c8ee 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon .el-icon {
  color: white;
  font-size: 20px;
}

.contact-info {
  flex: 1;
}

.contact-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.contact-detail {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.support-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #52afd5 0%, #68b2dd 100%);
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

.intro-card {
  animation: fadeInUp 0.5s ease-out 0.2s;
  animation-fill-mode: both;
}

.version-card {
  animation: fadeInUp 0.5s ease-out 0.3s;
  animation-fill-mode: both;
}

.tech-card {
  animation: fadeInUp 0.5s ease-out 0.4s;
  animation-fill-mode: both;
}

.support-card {
  animation: fadeInUp 0.5s ease-out 0.5s;
  animation-fill-mode: both;
}

/* 响应式调整 */
@media screen and (max-width: 991px) {
  .about-card {
    padding: 20px;
  }

  .system-name {
    font-size: 20px;
  }

  .system-stats {
    flex-direction: column;
    gap: 20px;
  }

  .feature-item {
    margin-bottom: 12px;
  }
}

@media screen and (max-width: 767px) {
  .about-container {
    padding: 12px;
  }

  .page-title h1 {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .about-card {
    padding: 15px;
  }

  .system-logo {
    width: 60px;
    height: 60px;
  }

  .system-logo .el-icon {
    font-size: 30px;
  }

  .system-name {
    font-size: 18px;
  }

  .support-actions {
    flex-direction: column;
  }

  .support-actions .el-button {
    width: 100%;
  }
}
</style>
