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
          component: () => import('../views/HomePage.vue'),
          meta: {
            name: '首页'
          }
        },
        {
          path: '/bill',
          name: 'bill',
          component: () => import('../views/user/BillPage.vue'),
          meta: {
            name: '我的账单'
          }
        },
        {
          path: '/plan',
          name: 'plan',
          component: () => import('../views/user/PlanPage.vue'),
          meta: {
            name: '存钱计划'
          }
        },
        {
          path: '/diary',
          name: 'diary',
          component: () => import('../views/user/DiaryPage.vue'),
          meta: {
            name: '记账日记'
          }
        },
        {
          path: '/account',
          name: 'account',
          component: () => import('../views/admin/AccountPage.vue'),
          meta: {
            name: '账户信息'
          }
        },
        {
          path: '/category',
          name: 'category',
          component: () => import('../views/admin/CategoryPage.vue'),
          meta: {
            name: '账单分类'
          }
        },
        {
          path: '/notice',
          name: 'notice',
          component: () => import('../views/admin/NoticePage.vue'),
          meta: {
            name: '公告信息'
          }
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('../views/admin/UserPage.vue'),
          meta: {
            name: '用户信息'
          }
        },
        {
          path: '/admin',
          name: 'admin',
          component: () => import('../views/admin/AdminPage.vue'),
          meta: {
            name: '管理员信息'
          }
        },
        {
          path: '/adminPerson',
          name: 'adminPerson',
          component: () => import('../views/admin/AdminPersonPage.vue'),
          meta: {
            name: '个人信息'
          }
        },
        {
          path: '/userPerson',
          name: 'userPerson',
          components: () => import('../views/user/UserPersonPage.vue'),
          meta: {
            name: '个人信息'
          }
        },
        {
          path: '/password',
          name: 'password',
          component: () => import('../views/admin/PasswordPage.vue'),
          meta: {
            name: '修改密码'
          }
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
