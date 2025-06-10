/*
 * @Author: zi.yang
 * @Date: 2025-06-10 00:20:19
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-06-10 14:33:57
 * @Description: 
 * @FilePath: /short-link/src/router/index.js
 */
import { createRouter, createWebHistory } from 'vue-router';

import DashboardPage from '@/views/dashboard/index.vue';
import HomePage from '@/views/home/index.vue';
import LoginPage from '@/views/login/index.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    // 将来可以添加路由守卫，检查用户是否已登录
    // meta: { requiresAuth: true }
  },
  // 将来可以添加404页面
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'not-found',
  //   component: NotFound
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 将来可以添加全局路由守卫
// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
//   const isAuthenticated = localStorage.getItem('user')
//
//   if (requiresAuth && !isAuthenticated) {
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router