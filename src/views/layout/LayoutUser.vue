<script setup>
import { ref } from 'vue'
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
  <div class="box">
    <!--  头部  -->
    <el-affix :offset="0">
      <div class="header">
        <!-- logo -->
        <div class="logo">
          <img src="../../assets/img/logo.png" alt="" />
          <span>记账系统</span>
        </div>

        <!-- 横向导航栏 -->
        <div class="header-main-top">
          <el-menu
            mode="horizontal"
            active-text-color="#409EFF"
            class="el-menu-horizontal-demo"
            router
            :default-active="$route.path"
            text-color="#000"
            :ellipsis="false"
          >
            <el-menu-item index="/home">
              <el-icon><HomeFilled /></el-icon>
              <span>系统首页</span>
            </el-menu-item>

            <el-menu-item index="/statistic">
              <el-icon><PieChart /></el-icon>
              <span>账单统计</span>
            </el-menu-item>

            <el-menu-item index="/bill">
              <el-icon><Document /></el-icon>
              <span>我的账单</span>
            </el-menu-item>

            <el-menu-item index="/accountBook">
              <el-icon><Notebook /></el-icon>
              <span>我的账本</span>
            </el-menu-item>

            <el-menu-item index="/plan">
              <el-icon><Money /></el-icon>
              <span>存钱计划</span>
            </el-menu-item>

            <el-menu-item index="/diary">
              <el-icon><Tickets /></el-icon>
              <span>记账日记</span>
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 右侧用户头像和用户名 -->
        <div class="header-right">
          <div class="header-right-notice">
            <el-icon :size="27" color="#DDD"><BellFilled /></el-icon>
          </div>
          <el-dropdown>
            <div class="avatar">
              <img :src="user.avatar" />
              <div>{{ user.username || '用户' }}</div>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToPerson"
                  >个人信息</el-dropdown-item
                >
                <el-dropdown-item @click="goToPassword"
                  >修改密码</el-dropdown-item
                >
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-affix>

    <!-- 主体内容 -->
    <div class="content">
      <router-view @update:user="updateUser" />
    </div>
  </div>
</template>

<style scoped>
.box {
  min-height: 100vh;
  background-color: #f4f6f9;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 20px;
    color: #fff;
    background-color: #fff;

    .logo {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 700;
      cursor: pointer;
      color: #000;

      img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
    }

    .header-main-top {
      display: flex;
      justify-content: center;
      margin: 0 10px;

      span {
        font-size: 15px;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      cursor: pointer;

      .header-right-notice {
        margin-right: 15px;
      }

      .avatar {
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
    }
  }

  .content {
    margin: 0 18% 0 18%;
  }
}
</style>
