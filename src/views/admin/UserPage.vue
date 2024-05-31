<script setup>
import { ref, onBeforeMount } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const user = JSON.parse(localStorage.getItem('big-user'))

const username = ref(null)

const reset = () => {
  username.value = ''
}

const formVisible = ref(false)
const form = ref({
  username: '',
  password: '',
  name: '',
  phone: '',
  email: '',
  sex: '',
  role: '',
  birthday: ''
})

const handleAdd = () => {
  // 新增
  formVisible.value = true
  form.value = {}
}

const delBatch = () => {
  // 批量删除
}

const tableData = ref([])

// 获取用户数据
onBeforeMount(() => {
  load(1)
})

// 获取选中行的id值
const ids = ref([])
const handleSelectionChange = (val) => {
  ids.value = val.map((item) => item.id)
}

// 编辑内容
const handleEdit = (row) => {
  formVisible.value = true
  form.value = JSON.parse(JSON.stringify(row))
}

// 删除
const del = (id) => {
  ElMessageBox.confirm('确定删除吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    request.delete('/user/deleteById/' + id).then((res) => {
      if (res.data.code === '1') {
        ElMessage.success('删除成功')
        load(1)
      } else {
        ElMessage.error('删除失败')
      }
    })
  })
}

// 分页
const pageSize = ref(5)
const pageNum = ref(1)
const total = ref(0)
const load = (pageNum) => {
  request
    .get('/user/selectPage', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        username: username.value
      }
    })
    .then((res) => {
      tableData.value = res.data.data.list
      total.value = res.data.data.total
      console.log(res)
    })
}

// 处理分页
const handleCurrentChange = (pageNum) => {
  load(pageNum)
}
</script>
<template>
  <div>
    <div class="search">
      <el-input
        placeholder="请输入账号查询"
        style="width: 200px"
        v-model="username"
      ></el-input>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)"
        >查询</el-button
      >
      <el-button type="warning" plain style="margin-left: 10px" @click="reset"
        >重置</el-button
      >
    </div>

    <div class="operation">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>

    <div class="table">
      <el-table
        :data="tableData"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="birth" label="生日"></el-table-column>
        <el-table-column label="头像">
          <template #scope>
            <div style="display: flex; align-items: center">
              <el-image
                style="width: 40px; height: 40px; border-radius: 50%"
                v-if="scope.row.avatar"
                :src="scope.row.avatar"
                :preview-src-list="[scope.row.avatar]"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <el-button type="primary" plain @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" plain @click="del(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20]"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="用户"
      v-model="formVisible"
      width="40%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        :model="form"
        label-width="100px"
        style="padding-right: 50px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="生日" prop="birth">
          <el-date-picker
            style="width: 100%"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="form.birth"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="$baseUrl + '/files/upload'"
            :headers="{ token: user.token }"
            list-type="picture"
            :on-success="handleAvatarSuccess"
          >
            <el-button type="primary">上传头像</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.search,
.operation,
.table {
  background-color: #fff;
  margin-bottom: 7px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table {
  font-size: 14px;
}
</style>
