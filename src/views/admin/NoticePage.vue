<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const tableData = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const title = ref(null)
const formVisible = ref(false)
const form = reactive({})
const ids = ref([])

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

const formRef = ref(null)

// 分页
const load = (pageNumValue) => {
  pageNum.value = pageNumValue
  request({
    url: '/notice/selectPage',
    method: 'GET',
    params: {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      title: title.value
    }
  }).then((res) => {
    tableData.value = res.data.data?.list || []
    total.value = res.data.data?.total || 0
  })
}

const handleAdd = () => {
  form.title = ''
  form.content = ''
  formVisible.value = true
}

const handleEdit = (row) => {
  form.title = row.title
  form.content = row.content
  formVisible.value = true
}

// 保存
const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      request({
        url: form.id ? '/notice/update' : '/notice/add',
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
  ElMessageBox.confirm('您确定删除吗？', '确认删除', { type: 'warning' }).then(
    () => {
      request({ url: '/notice/delete/' + id, method: 'DELETE' }).then((res) => {
        if (res.data.code === 1) {
          ElMessage.success('操作成功')
          load(1)
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    }
  )
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
  }).then(() => {
    request({
      url: '/notice/delete/batch',
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
}

// 重置
const reset = () => {
  title.value = null
  load(1)
}

const handleCurrentChange = (pageNumValue) => {
  load(pageNumValue)
}

// DOM渲染之后执行
onMounted(() => {
  load(1)
})
</script>

<template>
  <div>
    <div class="search">
      <el-input
        placeholder="请输入标题查询"
        style="width: 200px"
        v-model="title"
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
        <el-table-column prop="id" label="序号" width="80" align="center">
          <template #default="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="content"
          label="内容"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="time" label="创建时间"></el-table-column>
        <el-table-column prop="user" label="创建人"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template v-slot="scope">
            <el-button plain type="primary" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button plain type="danger" @click="del(scope.row.id)"
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
        label-width="100px"
        style="padding-right: 50px"
        :model="form"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item prop="title" label="标题">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="content" label="内容">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.content"
            autocomplete="off"
          ></el-input>
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
  padding: 18px;
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
