import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import TimedTask from '@/views/TimedTask.vue'
import TestView from '@/views/TestView.vue'
import TaskLog from '@/views/TaskLogs.vue'
import TaskAccount from '@/views/TaskAccount.vue'
import TaskNotify from '@/views/TaskNotify.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: TimedTask,
    // },
    {
      path: '/',
      name: 'TimedTask',
      component: TimedTask,
      meta: {
        title: '定时任务',
      },
    },
    {
      path: '/test/:id',
      name: 'test',
      component: TestView,
    },
    {
      path: '/log/:id',
      name: 'TaskLog',
      component: TaskLog,
      meta: {
        title: '任务日志',
      },
    },
    {
      path: '/account/:id',
      name: 'TaskAccount',
      component: TaskAccount,
      meta: {
        title: '账号管理',
      },
    },
    {
      path: '/notify',
      name: 'Notify',
      component: TaskNotify,
      meta: {
        title: '推送管理',
      },
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
