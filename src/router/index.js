// import { createRouter, createWebHistory } from 'vue-router'

// const routes = [
//   {
//     path: '/',
//     component: () => import('../views/layout/LayoutContainer.vue'),
//     redirect: '/home',
//     children: [
//       {
//         path: '/home',
//         name: 'home',
//         component: () => import('../views/HomePage.vue'),
//         meta: {
//           name: '首页',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/statistic',
//         name: 'statistic',
//         component: () => import('../views/user/StatisticPage.vue'),
//         meta: {
//           name: '账单统计',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/bill',
//         name: 'bill',
//         component: () => import('../views/user/BillPage.vue'),
//         meta: {
//           name: '我的账单',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/plan',
//         name: 'plan',
//         component: () => import('../views/user/PlanPage.vue'),
//         meta: {
//           name: '存钱计划',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/planDetail',
//         name: 'planDetail',
//         component: () => import('../views/user/component/PlanDetail.vue'),
//         meta: {
//           name: '存钱计划详情',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/diary',
//         name: 'diary',
//         component: () => import('../views/user/DiaryPage.vue'),
//         meta: {
//           name: '记账日记',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/account',
//         name: 'account',
//         component: () => import('../views/admin/AccountPage.vue'),
//         meta: {
//           name: '账户信息',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/category',
//         name: 'category',
//         component: () => import('../views/admin/CategoryPage.vue'),
//         meta: {
//           name: '账单分类',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/notice',
//         name: 'notice',
//         component: () => import('../views/admin/NoticePage.vue'),
//         meta: {
//           name: '公告信息',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/user',
//         name: 'user',
//         component: () => import('../views/admin/UserPage.vue'),
//         meta: {
//           name: '用户信息',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/admin',
//         name: 'admin',
//         component: () => import('../views/admin/AdminPage.vue'),
//         meta: {
//           name: '管理员信息',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/adminPerson',
//         name: 'adminPerson',
//         component: () => import('../views/admin/AdminPersonPage.vue'),
//         meta: {
//           name: '个人信息',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/userPerson',
//         name: 'userPerson',
//         component: () => import('../views/user/UserPersonPage.vue'),
//         meta: {
//           name: '个人信息',
//           requiresAuth: true
//         }
//       },
//       {
//         path: '/password',
//         name: 'password',
//         component: () => import('../views/admin/PasswordPage.vue'),
//         meta: {
//           name: '修改密码',
//           requiresAuth: true
//         }
//       }
//     ]
//   },
//   {
//     path: '/login',
//     name: 'login',
//     component: () => import('../views/login/UserLoginPage.vue')
//   },
//   {
//     path: '/register',
//     name: 'register',
//     component: () => import('../views/register/UserRegisterPage.vue')
//   },
//   {
//     path: '/admin/login',
//     component: () => import('../views/login/AdminLoginPage.vue')
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes
// })

// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
//   const user = JSON.parse(localStorage.getItem('big-user') || '{}')

//   if (requiresAuth && (!user || !user.token)) {
//     next({ name: 'login' })
//   } else {
//     next()
//   }
// })

// export default router

import { createRouter, createWebHistory } from 'vue-router'

// 基础路由
const routes = [
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
  },
  {
    path: '/test',
    component: () => import('../views/TestPage.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 用户路由
const userRoutes = [
  {
    path: '/',
    component: () => import('../views/layout/LayoutUser.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/HomePage.vue'),
        meta: {
          name: '首页',
          requiresAuth: true
        }
      },
      {
        path: 'statistic',
        name: 'statistic',
        component: () => import('../views/user/StatisticPage.vue'),
        meta: {
          name: '账单统计',
          requiresAuth: true
        }
      },
      {
        path: 'bill',
        name: 'bill',
        component: () => import('../views/user/BillPage.vue'),
        meta: {
          name: '我的账单',
          requiresAuth: true
        }
      },
      {
        path: 'accountBook',
        name: 'accountBook',
        component: () => import('../views/user/AccountBook.vue'),
        meta: {
          name: '我的账本',
          requiresAuth: true
        }
      },
      {
        path: 'plan',
        name: 'plan',
        component: () => import('../views/user/PlanPage.vue'),
        meta: {
          name: '存钱计划',
          requiresAuth: true
        }
      },
      {
        path: 'planDetail',
        name: 'planDetail',
        component: () => import('../views/user/component/PlanDetail.vue'),
        meta: {
          name: '存钱计划详情',
          requiresAuth: true
        }
      },
      {
        path: 'diary',
        name: 'diary',
        component: () => import('../views/user/DiaryPage.vue'),
        meta: {
          name: '记账日记',
          requiresAuth: true
        }
      },
      {
        path: 'userPerson',
        name: 'userPerson',
        component: () => import('../views/user/UserPersonPage.vue'),
        meta: {
          name: '个人信息',
          requiresAuth: true
        }
      },
      {
        path: '/password',
        name: 'password',
        component: () => import('../views/user/PasswordPage.vue'),
        meta: {
          name: '修改密码',
          requiresAuth: true
        }
      }
    ]
  }
]

// 管理员路由
const adminRoutes = [
  {
    path: '/',
    component: () => import('../views/layout/LayoutAdmin.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/HomePage.vue'),
        meta: {
          name: '首页',
          requiresAuth: true
        }
      },
      {
        path: 'account',
        name: 'account',
        component: () => import('../views/admin/AccountPage.vue'),
        meta: {
          name: '账户信息',
          requiresAuth: true
        }
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('../views/admin/CategoryPage.vue'),
        meta: {
          name: '账单分类',
          requiresAuth: true
        }
      },
      {
        path: 'notice',
        name: 'notice',
        component: () => import('../views/admin/NoticePage.vue'),
        meta: {
          name: '公告信息',
          requiresAuth: true
        }
      },
      {
        path: 'adminAccountBook',
        name: 'adminAccountBook',
        component: () => import('../views/admin/AdminAccountBook.vue'),
        meta: {
          name: '账本管理',
          requiresAuth: true
        }
      },
      {
        path: 'adminDiary',
        name: 'adminDiary',
        component: () => import('../views/admin/AdminDiaryPage.vue'),
        meta: {
          name: '记账日记',
          requiresAuth: true
        }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('../views/admin/UserPage.vue'),
        meta: {
          name: '用户信息',
          requiresAuth: true
        }
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('../views/admin/AdminPage.vue'),
        meta: {
          name: '管理员信息',
          requiresAuth: true
        }
      },
      {
        path: 'adminPerson',
        name: 'adminPerson',
        component: () => import('../views/admin/AdminPersonPage.vue'),
        meta: {
          name: '个人信息',
          requiresAuth: true
        }
      },
      {
        path: '/password',
        name: 'password',
        component: () => import('../views/admin/PasswordPage.vue'),
        meta: {
          name: '修改密码',
          requiresAuth: true
        }
      }
    ]
  }
]

let isRoutesAdded = false

router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.path)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const user = JSON.parse(localStorage.getItem('big-user') || '{}')
  console.log('User data:', user)

  if (requiresAuth && (!user || !user.token)) {
    console.log('Authentication required, redirecting to login...')
    next({ name: 'login' })
  } else {
    if (!isRoutesAdded && user && user.token) {
      console.log('Adding routes for user role:', user.role)
      if (user.role === 'ADMIN') {
        adminRoutes.forEach((route) => router.addRoute(route))
      } else if (user.role === 'USER') {
        userRoutes.forEach((route) => router.addRoute(route))
      }
      isRoutesAdded = true
      console.log('Routes added, redirecting to:', to.path)
      next({ path: to.path, replace: true }) // 重新导航到目标路由
    } else {
      next()
    }
  }
})

export default router
