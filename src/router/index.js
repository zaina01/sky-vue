import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import ErrorPage from '@/views/ErrorPage.vue'
// import TimedTask from '@/views/TimedTask.vue'
// import TestView from '@/views/TestView.vue'
// import TaskAccount from '@/views/TaskAccount.vue'
// import TaskNotify from '@/views/TaskNotify.vue'
// import Login from '@/views/LoginView.vue'
import { getOriginalStatusCode, clearStatusCode } from '@/utils/httpStatus'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. 独立路由：登录页
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { title: '登录' },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { title: '注册' },
    },
    {
      path: '/error/:code',
      name: 'ErrorPage',
      component: ErrorPage,
      props: true,
    },
    // 404 页面 - 捕获所有未匹配的路由
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: ErrorPage,
      redirect: '/error/404',
      // props: { code: '404' },
    },
    // 2. 主布局路由：将HomeView作为布局容器，其下的页面作为它的子路由
    {
      path: '/', // 根路径也会使用HomeView布局
      name: 'Home',
      component: HomeView,
      // 设置重定向，让访问根路径'/'时默认显示某个子页面（比如定时任务）
      redirect: '/timedtask',
      // 子路由，这些组件将在HomeView的<router-view>中渲染
      children: [
        {
          path: '/timedtask', // 建议使用全路径，避免混淆
          name: 'TimedTask',
          component: () => import('@/views/TimedTask.vue'), // 建议使用懒加载
          meta: { title: '定时任务' },
        },
        {
          path: '/log/:id',
          name: 'TaskLog',
          component: () => import('@/views/TaskLogs.vue'),
          meta: { title: '任务日志' },
        },
        {
          path: '/account/:id',
          name: 'TaskAccount',
          component: () => import('@/views/TaskAccount.vue'),
          meta: { title: '账号管理' },
        },
        {
          path: '/notify',
          name: 'Notify',
          component: () => import('@/views/TaskNotify.vue'),
          meta: { title: '推送管理' },
        },
        {
          path: '/loader',
          name: 'Loader',
          component: () => import('@/views/PluginLoader.vue'),
          meta: { title: '加载器管理' },
        },
        {
          path: '/loader/depend/:id',
          name: 'Depend',
          component: () => import('@/views/PluginDepend.vue'),
          meta: { title: '依赖管理' },
        },
        {
          path: '/loader/depend/dependDetail/:id',
          name: 'DependDetail',
          component: () => import('@/views/PluginDependDetail.vue'),
          meta: { title: '依赖详情' },
        },
        {
          path: '/loader/job/:id',
          name: 'Job',
          component: () => import('@/views/PluginJob.vue'),
          meta: { title: '插件管理' },
        },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {
  // 判断用户是否已登录（例如检查本地存储的token）
  const isLoggedIn = localStorage.getItem('userToken') // 或使用Vuex/Pinia状态管理

  // 如果用户访问的不是登录页且未登录
  if (!(to.path === '/login' || to.path === '/register') && !isLoggedIn) {
    next('/login') // 重定向到登录页
  }
  // 如果用户已经登录却又访问登录页，可以重定向到首页
  else if (to.path === '/login' && isLoggedIn) {
    next('/') // 或 next(from.path) 返回原页面
  }
  const originalStatus = getOriginalStatusCode()
  if (originalStatus && originalStatus >= 500) {
    // 如果是 5xx 错误，重定向到错误页面
    next({
      name: 'ErrorPage',
      params: { code: originalStatus.toString() },
      query: {
        from: from.fullPath,
        timestamp: new Date().getTime(),
      },
    })
    clearStatusCode()
    return
  }
  // 其他情况正常放行
  else {
    next()
  }
})
// 全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  // 跳转到错误页面
  // 根据错误类型跳转到不同页面
  let errorCode = '500'
  if (error.message.includes('404') || error.message.includes('not found')) {
    errorCode = '404'
  } else if (error.message.includes('network') || error.message.includes('Network')) {
    errorCode = '503'
  } else if (error.message.includes('timeout')) {
    errorCode = '504'
  }

  router.push({
    name: 'ErrorPage',
    params: { code: errorCode },
    query: {
      error: encodeURIComponent(
        JSON.stringify({
          message: error.message,
          type: 'router_error',
        }),
      ),
    },
  })
})
export default router
