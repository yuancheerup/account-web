<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import { baseURL } from '@/utils/request'
import moment from 'moment'

const tableData = ref([]) // 所有的数据
const pageNum = ref(1) // 当前的页码
const pageSize = ref(10) // 每页显示的个数
const total = ref(0)
const name = ref(null)
const fromVisible = ref(false)
const fromVisibleBill = ref(false)
const form = reactive({
  id: null,
  name: '',
  cover: '',
  remark: ''
})
const formRef = ref(null)
const user = JSON.parse(localStorage.getItem('big-user') || '{}')
const rules = {
  name: [{ required: true, message: '请输入标题', trigger: 'blur' }]
}
const categoryList = ref([])
const contentVisible = ref(false)
const bookBills = ref(null)
const ids = ref([])

// 查询账本账单
const showContent = (id) => {
  request.get('/bill/billByBookId', { params: { bookId: id } }).then((res) => {
    if (res.data.code === 1) {
      bookBills.value = res.data.data
      console.log('bookBills', bookBills.value)
      contentVisible.value = true
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

// 添加账本
// const handleAdd = () => {
//   form.id = null
//   form.name = ''
//   form.cover = ''
//   form.remark = ''
//   fromVisible.value = true
// }

// 点击编辑按钮
const handleEdit = (row) => {
  Object.assign(form, row) // 直接赋值整个对象
  fromVisible.value = true
}

// 保存
const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const url = form.id ? '/accountBook/update' : '/accountBook/add'
      const method = form.id ? 'put' : 'post'
      request({
        url,
        method,
        data: {
          id: form.id,
          name: form.name,
          cover: form.cover,
          userId: user.id,
          remark: form.remark
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

// 根据id删除
const del = (id) => {
  ElMessageBox.confirm('您确定删除吗？', '确认删除', { type: 'warning' })
    .then(() => {
      request.delete('/accountBook/delete/' + id).then((res) => {
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

// 获取选中的行
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
    request
      .delete('/accountBook/delete/batch', { data: ids.value })
      .then((res) => {
        if (res.data.code === 1) {
          ElMessage.success('操作成功')
          load(1)
        } else {
          ElMessage.error(res.data.msg)
        }
      })
  })
}

// 分页
const load = (pageNumParam) => {
  if (pageNumParam) pageNum.value = pageNumParam
  request
    .get('/accountBook/selectPage', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        name: name.value
      }
    })
    .then((res) => {
      tableData.value = res.data.data?.list || []
      total.value = res.data.data?.total || []
    })
}

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

// 点击编辑
const handleEditBill = (row) => {
  Object.assign(form, { ...row })

  request
    .get('/category/selectAll', {
      params: { type: form.type }
    })
    .then((res) => {
      categoryList.value = res.data.data || []
    })
  contentVisible.value = false
  fromVisibleBill.value = true
}

// 保存账本中账单的修改
const saveBill = () => {
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
            userId: user.id
          }
        }).then((res) => {
          if (res.data.code === 1) {
            ElMessage.success('保存成功')
            load(1)
            fromVisibleBill.value = false
            showContent(form.bookId)
          } else {
            ElMessage.error(res.data.msg)
          }
        })
      }
    })
  }
}

// 根据id删除
const delBill = (id) => {
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

// 重置
const reset = () => {
  name.value = null
  load(1)
}

// 更换页码
const handleCurrentChange = (pageNumParam) => {
  load(pageNumParam)
}

// 上存封面
const handleCoverSuccess = (res) => {
  form.cover = res.data
}

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
        v-model="name"
      ></el-input>
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
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column label="序号" width="80" align="center">
          <template #default="scope">
            {{ (pageNum - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="封面" align="center">
          <template v-slot="scope">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <el-image
                style="width: 50px"
                v-if="scope.row.cover"
                :src="scope.row.cover"
                :preview-src-list="[scope.row.cover]"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="内容" align="center">
          <template v-slot="scope">
            <el-button @click="showContent(scope.row.id)">查看内容</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column prop="createTime" label="创建日期" align="center">
          <template #default="scope">
            {{
              scope.row.createTime
                ? moment(scope.row.createTime).format('YYYY-MM-DD')
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="创建人"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template v-slot="scope">
            <el-button
              plain
              type="primary"
              @click="handleEdit(scope.row)"
              size="mini"
              >编辑</el-button
            >
            <el-button
              plain
              type="danger"
              size="mini"
              @click="del(scope.row.id)"
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
        ></el-pagination>
      </div>
    </div>

    <!-- 新增和编辑账本dialog -->
    <el-dialog
      title="信息"
      v-model="fromVisible"
      width="50%"
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
        <el-form-item prop="name" label="名称">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请输入账本名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-upload
            :action="baseURL + '/files/upload'"
            :headers="{ token: user.token }"
            list-type="picture"
            :on-success="handleCoverSuccess"
          >
            <el-button type="primary">上传封面</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input
            type="textarea"
            v-model="form.remark"
            autocomplete="off"
            placeholder="输入备注"
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

    <!-- 渲染账本账单dialog -->
    <el-dialog
      title="信息"
      v-model="contentVisible"
      width="60%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <!-- 渲染bookBill -->
      <el-table :data="bookBills" stripe>
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
        <el-table-column label="操作" align="center" width="180">
          <template v-slot="scope">
            <el-button type="primary" plain @click="handleEditBill(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" plain @click="delBill(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="contentVisible = false"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 编辑账单dialog -->
    <el-dialog
      title="信息"
      v-model="fromVisibleBill"
      width="40%"
      :close-on-click-modal="false"
      destroy-on-close
      @close="contentVisible = true"
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
          <el-button type="primary" @click="saveBill">确 定</el-button>
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

.book-card {
  .card {
    display: flex;
    justify-content: start;

    background-color: #fff;
    margin-bottom: 7px;
    padding: 20px 10px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    img {
      margin-right: 15px;
    }

    .card-header {
      display: flex;
      justify-content: start;
      align-items: center;
      margin-bottom: 20px;

      .card-title {
        font-size: 20px;
        margin: 0 20px 0 0;
      }

      .card-time {
        font-size: 14px;
        color: #666;
      }
    }

    .card-button {
      display: flex;
      justify-items: center;

      .card-button-item {
        .el-icon {
          font-size: 16px;
          margin-right: 5px;
        }
      }
      .card-button-read {
        color: #fff;
      }
    }
  }
}
</style>
