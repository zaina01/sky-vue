import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
// import TimedTask from '@/views/TimedTask.vue'
// import TestView from '@/views/TestView.vue'
// import TaskLog from '@/views/TaskLogs.vue'
// import TaskAccount from '@/views/TaskAccount.vue'
// import TaskNotify from '@/views/TaskNotify.vue'
// import Login from '@/views/LoginView.vue'

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
          path: '/test/:id',
          name: 'test',
          component: () => import('@/views/TestView.vue'),
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
  // 其他情况正常放行
  else {
    next()
  }
})
export default router
