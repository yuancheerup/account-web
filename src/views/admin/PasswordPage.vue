<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()

const user = reactive(JSON.parse(localStorage.getItem('big-user') || '{}'))

const form = ref({
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = reactive({
  password: [
    { required: true, message: '请输入原始密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '长度在 6 到 20 的非空字符',
      trigger: 'blur'
    }
  ],
  newPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '长度在 6 到 20 的非空字符',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '长度在 6 到 20 的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const formRef = ref(null)

const update = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log(user.id)
      request
        .put('/updatePassword', {
          id: user.id,
          password: form.value.password,
          newPassword: form.value.newPassword,
          role: user.role
        })
        .then((res) => {
          if (res.data.code === 1) {
            // 成功更新
            localStorage.removeItem('big-user') // 清除缓存的用户信息
            ElMessage.success('修改密码成功')
            router.push('/login')
          } else {
            ElMessage.error(res.data.msg)
          }
        })
    }
  })
}
</script>

<template>
  <div class="box">
    <el-card style="width: 50%">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        style="padding-right: 50px"
      >
        <el-form-item label="原始密码" prop="password">
          <el-input
            show-password
            v-model="form.password"
            placeholder="原始密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            show-password
            v-model="form.newPassword"
            placeholder="新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            show-password
            v-model="form.confirmPassword"
            placeholder="确认密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改按钮 -->
      <div style="text-align: center; margin-bottom: 20px">
        <el-button type="primary" @click="update">确认修改</el-button>
      </div>
    </el-card>
  </div>
</template>
<style scoped>
::v-deep .el-form-item__label {
  font-weight: bold;
}
</style>
