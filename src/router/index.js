/*
 * @Author: zi.yang
 * @Date: 2025-06-10 00:20:19
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-07-18 17:30:00
 * @Description:
 * @FilePath: /short-link/src/router/index.js
 */
import { createRouter, createWebHistory } from 'vue-router';

import DashboardPage from '@/views/dashboard/index.vue';
import HistoryPage from '@/views/history/index.vue';
import HomePage from '@/views/home/index.vue';
import LoginPage from '@/views/login/index.vue';
import NotFoundPage from '@/views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryPage
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
    // 新增 meta 屬性，標記此路由需要登入驗證
    meta: { requiresAuth: true }
  },
  {
    path: '/404',
    name: 'not-found',
    component: NotFoundPage,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局路由守衛
router.beforeEach((to, from, next) => {
  // 檢查 localStorage 中是否有登入憑證 (user-token)
  const isAuthenticated = !!localStorage.getItem('user-token');

  // 檢查目標路由是否需要登入
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // 如果使用者未登入，則重定向到登入頁面
      next({ name: 'login' });
    } else {
      // 如果已登入，則允許訪問
      next();
    }
  } else {
    // 如果目標路由不需要登入，則直接允許訪問
    next();
  }
});

export default router