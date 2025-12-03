<template>
  <div class="register-page" @mousemove="handleMouseMove">
    <div class="register-container">
      <!-- 浮动背景元素 -->
      <div class="floating-elements">
        <span
          v-for="(element, index) in floatingElements"
          :key="index"
          :style="{
            left: element.left + 'px',
            top: element.top + 'px',
            width: element.size + 'px',
            height: element.size + 'px',
            animationDuration: 10 + Math.random() * 20 + 's',
            animationDelay: Math.random() * 5 + 's',
          }"
        ></span>
      </div>

      <!-- 注册表单 -->
      <div class="form-wrapper">
        <h2 class="register-title">用户注册</h2>

        <el-form
          :model="registerForm"
          :rules="registerRules"
          ref="registerFormRef"
          @submit.prevent="handleRegister"
          class="register-form"
        >
          <el-form-item prop="username">
            <div class="input-group">
              <el-input v-model="registerForm.username" placeholder="请输入用户名" size="large" />
              <span class="input-icon">🧙‍♂️</span>
            </div>
          </el-form-item>

          <el-form-item prop="password">
            <div class="input-group">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                size="large"
              />
              <span class="input-icon">🔒</span>
            </div>
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <div class="input-group">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                show-password
                size="large"
                @keyup.enter="handleRegister"
              />
              <span class="input-icon">🔒</span>
            </div>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="agreeTerms"
              >我已阅读并同意<a href="#" class="terms-link">用户协议</a></el-checkbox
            >
          </el-form-item>

          <el-button
            type="primary"
            size="large"
            class="register-btn"
            :loading="loading"
            native-type="submit"
          >
            {{ loading ? '注册中...' : '立即注册' }}
          </el-button>

          <div class="login-link">
            已有账号？<a href="#" @click.prevent="switchToLogin">立即登录</a>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { register } from '../api/User'

// 路由实例
const router = useRouter()

// 响应式数据
const registerFormRef = ref()
const loading = ref(false)
const agreeTerms = ref(false)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

// 浮动背景元素
const floatingElements = ref([])

// 自定义验证规则 - 确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '用户名长度在 3 到 16 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/,
      message: '密码必须包含大小写字母和数字',
      trigger: 'blur',
    },
  ],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
}

const handleMouseMove = (e) => {
  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight
  const moveX = (x - 0.5) * 10
  const moveY = (y - 0.5) * 10

  const registerContainer = document.querySelector('.register-container')
  if (registerContainer) {
    registerContainer.style.transform = `translate(${moveX}px, ${moveY}px)`
  }
}

const generateFloatingElements = () => {
  const elements = []
  for (let i = 0; i < 8; i++) {
    elements.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 60 + 20,
    })
  }
  floatingElements.value = elements
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  // 检查是否同意用户协议
  if (!agreeTerms.value) {
    ElMessage.warning('请阅读并同意用户协议')
    return
  }

  const valid = await registerFormRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    // 模拟API调用 - 实际项目中替换为真实的注册接口
    const { code, msg } = await register(registerForm)

    if (code == 200) {
      ElMessage.success('注册成功！')
    } else {
      ElMessage.error(msg)
    }

    // 可以在这里添加自动登录逻辑，或者跳转到登录页面
    await ElMessageBox.confirm('注册成功，是否立即登录？', '提示', {
      confirmButtonText: '立即登录',
      cancelButtonText: '稍后登录',
      type: 'success',
    })

    // 跳转到登录页面
    router.push('/login')
  } catch (error) {
    if (error !== 'cancel') {
      console.log(error)
      // ElMessage.error('注册失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

const switchToLogin = () => {
  router.push('/login')
}

// 生命周期
onMounted(() => {
  generateFloatingElements()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* 天蓝色渐变 */
  background: linear-gradient(135deg, #87ceeb 0%, #b0e2ff 100%); /* 天蓝色渐变 */
  /* 柔和浅天蓝*/
  /* background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%); */
  /* 明亮蔚蓝*/
  /* background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); */
  /* 清爽湖蓝*/
  /* background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); */
  /* 淡雅粉蓝*/
  /* background: linear-gradient(135deg, #d6eaf8 0%, #ebf5fb 100%); */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
  position: relative;
}

.register-container {
  position: relative;
  width: 450px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.1),
    0 3px 10px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  z-index: 2;
}

.register-container:hover {
  transform: translateY(-5px);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 5px 15px rgba(0, 0, 0, 0.1);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-elements span {
  position: absolute;
  display: block;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 15s linear infinite;
  opacity: 0.7;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

/* 修改：去掉浮动标签，使用标准的placeholder */
.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
:deep(.el-input__wrapper) {
  padding-left: 45px !important;
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 12px !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease !important;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 10px rgba(102, 159, 234, 0.3) !important;
  border-color: #667eea !important;
}

:deep(.el-input__inner::placeholder) {
  color: #999;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
  margin-left: 5px;
}

.terms-link:hover {
  text-decoration: underline;
}

:deep(.el-checkbox) {
  width: 100%;
}

.register-btn {
  width: 100%;
  height: 45px;
  background: linear-gradient(135deg, #63c4eb, #4db8f7); /* 天蓝色渐变 */
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  margin-left: 5px;
}

.login-link a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-container {
    width: 90%;
    padding: 30px 20px;
  }

  .register-title {
    font-size: 24px;
  }
}
</style>
