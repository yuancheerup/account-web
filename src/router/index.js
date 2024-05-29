import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../views/layout/LayoutContainer.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/HomePage.vue')
        },
        {
          path: '/bill',
          name: 'bill',
          component: () => import('../views/user/BillPage.vue')
        },
        {
          path: '/plan',
          name: 'plan',
          component: () => import('../views/user/PlanPage.vue')
        },
        {
          path: '/diary',
          name: 'diary',
          component: () => import('../views/user/DiaryPage.vue')
        },
        {
          path: '/account',
          name: 'account',
          component: () => import('../views/admin/AccountPage.vue')
        },
        {
          path: '/category',
          name: 'category',
          component: () => import('../views/admin/CategoryPage.vue')
        },
        {
          path: '/notice',
          name: 'notice',
          component: () => import('../views/admin/NoticePage.vue')
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('../views/admin/UserPage.vue')
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import('../views/admin/AdminPage.vue')
        },
        {
          path: '/adminPerson',
          name: 'adminPerson',
          component: () => import('../views/admin/AdminPersonPage.vue')
        },
        {
          path: '/password',
          name: 'password',
          component: () => import('../views/admin/PasswordPage.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/UserLoginPage.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register/UserRegisterPage.vue')
    },
    {
      path: '/admin/login',
      component: () => import('../views/login/AdminLoginPage.vue')
    }
  ]
})

export default router
