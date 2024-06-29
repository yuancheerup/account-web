<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import request from '@/utils/request'
import moment from 'moment'

const tableData = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const type = ref(null)
const category = ref(null)
const name = ref(null)
const start = ref(null)
const end = ref(null)
const fromVisible = ref(false)
const form = reactive({})
const formRef = ref({})

const user = JSON.parse(localStorage.getItem('big-user') || '{}')
const rules = reactive({
  type: [{ required: true, message: '请选择账单类型', trigger: 'blur' }],
  category: [{ required: true, message: '请选择账单分类', trigger: 'blur' }],
  wayType: [{ required: true, message: '请选择账户类型', trigger: 'blur' }],
  money: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    {
      pattern: /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/,
      message: '金额只能输入数字，最多2位小数',
      trigger: 'blur'
    }
  ]
})
const ids = ref([])
const categoryList = ref([])

// 获取所有账单分类
const getCategoryList = () => {
  if (form.category) {
    form.category = ''
  }
  request
    .get('/category/selectAll', {
      params: { type: form.type }
    })
    .then((res) => {
      categoryList.value = res.data.data || []
    })
}

// 点击添加
// const handleAdd = () => {
//   // 清空form中的数据
//   Object.keys(form).forEach((key) => {
//     form[key] = ''
//   })
//   fromVisible.value = true
// }

// 点击编辑
const handleEdit = (row) => {
  Object.assign(form, { ...row })

  request
    .get('/category/selectAll', {
      params: { type: form.type }
    })
    .then((res) => {
      categoryList.value = res.data.data || []
    })
  fromVisible.value = true
}

// 保存
const save = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        request({
          url: form.id ? '/bill/update' : '/bill/add',
          method: form.id ? 'PUT' : 'POST',
          data: {
            id: form.id,
            category: form.category,
            type: form.type,
            wayType: form.wayType,
            money: form.money,
            remark: form.remark,
            userId: user.id,
            bookId: form.bookId ? form.bookId : -1
          }
        }).then((res) => {
          if (res.data.code === 1) {
            ElMessage.success('保存成功')
            load(1)
            fromVisible.value = false
          } else {
            ElMessage.error(res.data.msg)
          }
        })
      }
    })
  }
}

// 根据id删除
const del = (id) => {
  ElMessageBox.confirm('确定删除吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    request.delete('/bill/delete/' + id).then((res) => {
      if (res.data.code === 1) {
        ElMessage.success('操作成功')
        load(1)
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  })
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
    request.delete('/bill/delete/batch', { data: ids.value }).then((res) => {
      if (res.data.code === 1) {
        ElMessage.success('操作成功')
        load(1)
      } else {
        ElMessage.error(res.data.msg)
      }
    })
  })
}

// 分页查询
const load = (pageNumValue) => {
  if (pageNumValue) pageNum.value = pageNumValue
  request
    .get('/bill/selectPage', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        type: type.value,
        category: category.value,
        userId: user.id,
        start: start.value,
        end: end.value,
        name: name.value
      }
    })
    .then((res) => {
      tableData.value = res.data.data?.list || []
      total.value = res.data.data?.total || 0
    })
}

// 重置
const reset = () => {
  type.value = null
  category.value = null
  start.value = null
  end.value = null
  load(1)
}

// 获取所有账本名称
const nameList = ref([])
const getAllName = () => {
  request.get('/accountBook/selectAll').then((res) => {
    if (res.data.code === 1) {
      nameList.value = res.data.data || []
    }
  })
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
      <el-input placeholder="请输入账单类型查询" v-model="type"></el-input>
      <el-input placeholder="请输入账单分类查询" v-model="category"></el-input>
      <el-input placeholder="请输入账本名称查询" v-model="name"></el-input>
      <el-date-picker
        v-model="start"
        type="date"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
        placeholder="请选择开始日期"
        style="margin-right: 10px; width: 167px"
      ></el-date-picker>
      <el-date-picker
        v-model="end"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
        placeholder="请选择结束日期"
        style="width: 167px"
      ></el-date-picker>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)"
        >查询</el-button
      >
      <el-button type="warning" plain style="margin-left: 10px" @click="reset"
        >重置</el-button
      >
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div>

    <!-- <div class="operation">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
      <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    </div> -->

    <div class="table">
      <el-table
        :data="tableData"
        strip
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
          prop="type"
          label="账单类型"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="category"
          label="账单分类"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="wayType"
          label="账户类型"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="money"
          label="金额"
          align="center"
        ></el-table-column>
        <el-table-column prop="name" label="账本名称" align="center">
          <template #default="scope">
            {{ scope.row.name ? scope.row.name : '无' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="创建人"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        ></el-table-column>
        <el-table-column prop="createTime" label="时间" align="center">
          <template #default="scope">
            {{
              scope.row.createTime
                ? moment(scope.row.createTime).format('YYYY-MM-DD')
                : ''
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="username" label="用户"></el-table-column> -->
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

    <!-- 新增信息 -->
    <el-dialog
      title="信息"
      v-model="fromVisible"
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
        <el-form-item label="账单类型" prop="type">
          <el-select
            style="width: 100%"
            v-model="form.type"
            @change="getCategoryList"
          >
            <el-option value="支出"></el-option>
            <el-option value="收入"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账单分类" prop="category">
          <el-select style="width: 100%" v-model="form.category">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户类型" prop="wayType">
          <el-select
            v-model="form.wayType"
            style="width: 100%"
            placeholder="账户"
          >
            <el-option value="支付宝"></el-option>
            <el-option value="微信支付"></el-option>
            <el-option value="银行卡"></el-option>
            <el-option value="现金"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="金额" :min="1"></el-input>
        </el-form-item>
        <el-form-item label="账本" prop="name">
          <el-select
            v-model="form.name"
            style="width: 100%"
            placeholder="选择账本"
            @click="getAllName"
          >
            <el-option
              v-for="item in nameList"
              :key="item.id"
              :label="item.name"
              @click="form.bookId = item.id"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="fromVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.search {
  .el-input {
    width: 167px;
    margin-right: 10px;
  }
}

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
