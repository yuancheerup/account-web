<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const user = JSON.parse(localStorage.getItem('big-user') || '{}')
// const user = ref({
//   name: '管理员',
//   avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
// })

const updateUser = () => {
  user.value.username = '张三'
  user.value.avatar =
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
}

const goToPerson = () => {
  if (user.role === 'ADMIN') {
    router.push('/adminPerson')
  } else {
    router.push('/userPerson')
  }
}
const goToPassword = () => {
  router.push('/password')
}
const logout = () => {
  localStorage.removeItem('big-user')
  router.push('/login')
}
</script>
<template>
  <div class="layout-container">
    <!--  头部  -->
    <div class="layout-header">
      <div class="layout-header-left">
        <img src="../../assets/img/logo.png" />
        <div class="title">后台管理系统</div>
      </div>

      <div class="layout-header-center">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: router.path }">{{
            $route.meta.name
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="layout-header-right">
        <div class="layout-header-right-notice">
          <el-icon :size="27" color="#DDD"><BellFilled /></el-icon>
        </div>
        <el-dropdown>
          <div class="avatar">
            <img
              :src="
                user.avatar ||
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
              "
            />
            <div>{{ user.username || '管理员' }}</div>
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToPerson">个人信息</el-dropdown-item>
              <el-dropdown-item @click="goToPassword"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!--  主体  -->
    <div class="layout-main">
      <!--  侧边栏  -->
      <div class="layout-main-left">
        <el-menu
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          router
          default-active="$route.path"
          text-color="#fff"
        >
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon>
            <span>系统首页</span>
          </el-menu-item>

          <el-menu-item index="/notice">
            <el-icon><Bell /></el-icon>
            <span>公告信息</span>
          </el-menu-item>

          <el-menu-item index="/account">
            <el-icon><Postcard /></el-icon>
            <span>账户信息</span>
          </el-menu-item>

          <el-menu-item index="/category">
            <el-icon><Grid /></el-icon>
            <span>账单分类</span>
          </el-menu-item>

          <el-menu-item index="/adminBill">
            <el-icon><Document /></el-icon>
            <span>账单管理</span>
          </el-menu-item>

          <el-menu-item index="/adminAccountBook">
            <el-icon><Notebook /></el-icon>
            <span>账本管理</span>
          </el-menu-item>

          <el-menu-item index="/adminPlan">
            <el-icon><Money /></el-icon>
            <span>存钱计划</span>
          </el-menu-item>

          <el-menu-item index="/adminDiary">
            <el-icon><Tickets /></el-icon>
            <span>记账日记</span>
          </el-menu-item>

          <!-- <el-sub-menu index="info">
            <template #title>
              <el-icon><Menu /></el-icon>
              <span>信息管理</span>
            </template>
            <el-menu-item index="/account">账户信息</el-menu-item>
            <el-menu-item index="/category">账单分类</el-menu-item>
            <el-menu-item index="/notice">公告信息</el-menu-item>
          </el-sub-menu> -->

          <el-sub-menu index="person">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/user">用户信息</el-menu-item>
            <el-menu-item index="/admin">管理员信息</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>

      <!--  数据表格  -->
      <div class="layout-main-right">
        <router-view @update:user="updateUser" />
        <!-- <router-view /> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/layout.css';
.layout-header-center ::v-deep .el-breadcrumb__item .el-breadcrumb__inner {
  color: #ccc !important;
}
</style>
