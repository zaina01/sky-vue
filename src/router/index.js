import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import TimedTask from '@/views/TimedTask.vue'
import TestView from '@/views/TestView.vue'
import TaskLog from '@/views/TaskLog.vue'
import TaskAccount from '@/views/TaskAccount.vue'

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
    },
    {
      path: '/account/:id',
      name: 'TaskAccount',
      component: TaskAccount,
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
