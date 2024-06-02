<script setup>
import { reactive } from 'vue'
import request from '@/utils/request'
import { baseURL } from '@/utils/request'

const user = reactive(JSON.parse(localStorage.getItem('big-user') || '{}'))

// 使用 defineEmits 来定义 emit 函数
const emit = defineEmits(['update:user'])

const update = () => {
  // 保存当前的用户信息到数据库
  request.put('/admin/update', user).then((res) => {
    if (res.data.code === 1) {
      // 成功更新
      ElMessage.success('保存成功')

      // 更新浏览器缓存里的用户信息
      localStorage.setItem('big-user', JSON.stringify(user))

      // 触发父级的数据更新
      emit('update:user')
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const handleAvatarSuccess = (response, file, fileList) => {
  // 把user的头像属性换成上传的图片的链接
  user.avatar = response.data
}
</script>
<template>
  <div>
    <el-card style="width: 50%">
      <el-form :model="user" label-width="100px" style="padding-right: 50px">
        <div style="margin: 15px; text-align: center">
          <el-upload
            class="avatar-uploader"
            :action="baseURL + '/files/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="user.avatar" :src="user.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="user.username"
            placeholder="用户名"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="user.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="user.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <div style="text-align: center; margin-bottom: 20px">
          <el-button type="primary" @click="update">保 存</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
::v-deep .el-form-item__label {
  font-weight: bold;
}
::v-deep .el-upload {
  border-radius: 50%;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border-radius: 50%;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}
</style>
