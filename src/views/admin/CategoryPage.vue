<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const tableData = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const name = ref(null)
const formVisible = ref(false)
const form = reactive({})
const ids = ref([])

const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
}

const formRef = ref(null)

// 分页
const load = (pageNumValue = 1) => {
  pageNum.value = pageNumValue
  request({
    url: '/category/selectPage',
    method: 'GET',
    params: {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      name: name.value
    }
  }).then((res) => {
    tableData.value = res.data.data?.list || []
    total.value = res.data.data?.total || 0
  })
}

// 点击添加
const handleAdd = () => {
  form.name = ''
  form.type = ''
  formVisible.value = true
}

// 点击编辑
const handleEdit = (row) => {
  form.name = row.name
  form.type = row.type
  formVisible.value = true
}

// 保存
const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      request({
        url: form.id ? '/category/update' : '/category/add',
        method: form.id ? 'PUT' : 'POST',
        data: form
      }).then((res) => {
        if (res.data.code === 1) {
          ElMessage.success('保存成功')
          load(1)
          formVisible.value = false
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    }
  })
}

// 删除
const del = (id) => {
  ElMessageBox.confirm('您确定删除吗？', '确认删除', { type: 'warning' })
    .then(() => {
      request({ url: '/category/delete/' + id, method: 'DELETE' }).then(
        (res) => {
          if (res.data.code === 1) {
            ElMessage.success('操作成功')
            load(1)
          } else {
            ElMessage.error(res.data.msg)
          }
        }
      )
    })
    .catch(() => {})
}

const handleSelectionChange = (rows) => {
  ids.value = rows.map((v) => v.id)
}

// 批量删除
const delBatch = () => {
  if (!ids.value.length) {
    ElMessage.warning('请选择数据')
    return
  }
  ElMessageBox.confirm('您确定批量删除这些数据吗？', '确认删除', {
    type: 'warning'
  })
    .then(() => {
      request({
        url: '/category/delete/batch',
        method: 'DELETE',
        data: ids.value
      }).then((res) => {
        if (res.data.code === 1) {
          ElMessage.success('操作成功')
          load(1)
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    })
    .catch(() => {})
}

const reset = () => {
  name.value = null
  load(1)
}

const handleCurrentChange = (pageNumValue) => {
  load(pageNumValue)
}

onMounted(() => {
  load(1)
})
</script>

<template>
  <div>
    <div class="search">
      <el-input
        placeholder="请输入名称查询"
        style="width: 200px"
        v-model="name"
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
          prop="id"
          label="序号"
          width="75"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="分类名称"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
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
      title="信息"
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
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="分类名称"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select style="width: 100%" v-model="form.type">
            <el-option value="支出">支出</el-option>
            <el-option value="收入">收入</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
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
  font-size: 10px;
  .pagination {
    margin-top: 10px;
  }
}
</style>
