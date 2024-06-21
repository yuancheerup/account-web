<script setup>
import { ref, inject } from 'vue'
import router from '@/router'
import request from '@/utils/request'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const formRef = ref(null)

const form = ref({
  username: '',
  password: ''
})

// 校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '长度在 6 到 20 的非空字符',
      trigger: 'blur'
    }
  ]
}

const parentId = inject('parentId', 'Unknown')

// 登录
const login = () => {
  // 提交之前预校验
  formRef.value.validate((valid) => {
    if (valid) {
      request
        .post(parentId === 'user' ? '/login' : '/admin/login', form.value)
        .then((res) => {
          console.log('res:' + res.data)
          if (res.data.code === 1) {
            ElMessage.success('登录成功')
            userStore.setUser(
              res.data.data.id,
              res.data.data.username || '',
              res.data.data.name || '',
              res.data.data.avatar || '',
              res.data.data.role || '',
              res.data.data.phone || '',
              res.data.data.email || '',
              res.data.data.sex || '',
              res.data.data.birthday || '',
              res.data.data.token
            )
            // 登录成功后跳转到首页
            router.push('/')
          }
        })
    }
  })
}
</script>
<template>
  <div class="container">
    <div class="login-box">
      <div class="title">
        <slot></slot>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input
            prefix-icon="User"
            placeholder="请输入账号"
            v-model="form.username"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            prefix-icon="Lock"
            placeholder="请输入密码"
            show-password
            v-model="form.password"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button @click="login">登 录</el-button>
        </el-form-item>

        <div style="display: flex; align-items: center">
          <div style="flex: 1; text-align: right">
            <slot name="footer"></slot>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style scoped>
.container {
  height: 100vh;
  overflow: hidden;
  background-image: url('@/assets/img/bg-login-user.png');
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  background-color: #b8e5f8;
}

.login-box {
  width: 300px;
  padding: 30px;
  background-color: #fff;
  border-radius: 5px;
  .title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 20px;
    color: #333;
  }
  .el-button {
    width: 100%;
    background-color: #409eff;
    border-color: #409eff;
    color: white;
  }
}
</style>
