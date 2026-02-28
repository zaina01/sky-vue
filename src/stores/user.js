import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { loginApi, changePasswordApi } from '@/api/User'
export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref({
    userId: '',
    username: '',
    avatar: '',
    registerTime: '',
  })

  const token = ref('')
  const isLoggedIn = ref(false)
  // const twoFactorEnabled = ref(false)

  // Getter（计算属性）
  // const isAdmin = computed(() => userInfo.value.role === '超级管理员')
  const displayName = computed(() => userInfo.value.username || '用户')
  const userAvatar = computed(
    () =>
      userInfo.value.avatar ||
      'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  )
  // const userStats = computed(() => userInfo.value.stats)

  // Actions（方法）
  const login = async (loginData) => {
    try {
      // 调用登录API
      // const response = await api.login(loginData)
      const { code, data } = await loginApi(loginData)
      if (code === 200) {
        console.log(data)
        // 更新状态
        userInfo.value = data.user
        token.value = 'Bearer ' + data.token
        console.log(userInfo.value)
        isLoggedIn.value = true
        // 保存到本地存储
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        localStorage.setItem('userToken', token.value)

        ElMessage.success('登录成功')
        return true
      }
      return false
    } catch (error) {
      ElMessage.error(error.message || '登录失败')
      return false
    }
  }

  const logout = () => {
    // 清空状态
    userInfo.value = {
      userId: '',
      username: '',
      avatar: '',
      registerTime: '',
    }
    token.value = ''
    isLoggedIn.value = false

    // 清除本地存储
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userToken')

    ElMessage.success('已退出登录')
  }

  const updateUserInfo = async (updateData) => {
    try {
      // 调用更新用户信息API
      // await api.updateUserInfo(updateData)

      // 更新状态
      userInfo.value = { ...userInfo.value, ...updateData }

      // 更新本地存储
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))

      ElMessage.success('用户信息更新成功')
      return true
    } catch (error) {
      ElMessage.error(error.message || '更新失败')
      return false
    }
  }

  const updateAvatar = async (avatarUrl) => {
    try {
      // 调用更新头像API
      // await api.updateAvatar({ avatar: avatarUrl })

      userInfo.value.avatar = avatarUrl
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))

      ElMessage.success('头像更新成功')
      return true
    } catch (error) {
      ElMessage.error(error.message || '头像更新失败')
      return false
    }
  }

  const changePassword = async (passwordData) => {
    try {
      // 调用修改密码API
      // await api.changePassword(passwordData)
      const { code, msg } = await changePasswordApi(passwordData)
      if (code == 200) {
        ElMessage.success('密码修改成功')
        return true
      } else {
        ElMessage.error(msg)
        return false
      }
    } catch (error) {
      ElMessage.error(error.message || '密码修改失败')
      return false
    }
  }

  // const toggleTwoFactor = async (enabled) => {
  //   try {
  //     // 调用两步验证API
  //     // await api.toggleTwoFactor({ enabled })

  //     twoFactorEnabled.value = enabled
  //     ElMessage.success(`两步验证已${enabled ? '开启' : '关闭'}`)
  //     return true
  //   } catch (error) {
  //     ElMessage.error(error.message || '操作失败')
  //     return false
  //   }
  // }

  const loadUserFromStorage = () => {
    const storedUserInfo = localStorage.getItem('userInfo')
    const storedToken = localStorage.getItem('userToken')

    if (storedUserInfo && storedToken) {
      userInfo.value = JSON.parse(storedUserInfo)
      token.value = storedToken
      isLoggedIn.value = true
    }
  }

  // 初始化时从本地存储加载用户信息
  loadUserFromStorage()

  return {
    // State
    userInfo,
    token,
    isLoggedIn,
    // twoFactorEnabled,

    // Getters
    // isAdmin,
    displayName,
    userAvatar,
    // userStats,

    // Actions
    login,
    logout,
    updateUserInfo,
    updateAvatar,
    changePassword,
    // toggleTwoFactor,
    loadUserFromStorage,
  }
})
