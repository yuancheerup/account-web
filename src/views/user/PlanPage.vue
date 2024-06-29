<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { baseURL } from '@/utils/request'

const router = useRouter()
const name = ref(null)
const fromVisible = ref(false)
const detailFromVisible = ref(false)
const form = reactive({})
const formRef = ref(null)
const user = reactive(JSON.parse(localStorage.getItem('big-user') || '{}'))
const tableData = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailForm = reactive({})
const rules = {
  name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  money: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }
  ],
  start: [{ required: true, message: '请输入开始日期', trigger: 'blur' }],
  end: [{ required: true, message: '请输入结束日期', trigger: 'blur' }]
}

// 分页
const load = async (pageNumValue) => {
  if (pageNumValue) pageNum.value = pageNumValue
  const { data } = await request.get('/plan/selectPage', {
    params: {
      name: name.value,
      userId: user.userId,
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }
  })
  tableData.value = data.data?.list
  total.value = data.data?.total
}

// 点击重置
const reset = () => {
  name.value = null
  load(1)
}

// 点击添加
const handleAdd = () => {
  Object.assign(form, {})
  fromVisible.value = true
}

// 点击编辑
const handleEdit = (row) => {
  Object.assign(form, JSON.parse(JSON.stringify(row)))
  fromVisible.value = true
}

// 保存
const save = async () => {
  await formRef.value.validate()
  const response = await request({
    url: form.id ? '/plan/update' : '/plan/add',
    method: form.id ? 'PUT' : 'POST',
    data: {
      name: form.name,
      cover: form.cover,
      money: form.money,
      start: form.start,
      end: form.end,
      userId: user.id
    }
  })
  if (response.data.code === 1) {
    ElMessage.success('保存成功')
    load(1)
    fromVisible.value = false
  } else {
    ElMessage.error(response.data.msg)
  }
}

// 根据id删除
const del = async (id) => {
  await ElMessageBox.confirm('您确定删除吗？', '确认删除', { type: 'warning' })
  const response = await request.delete(`/plan/delete/${id}`)
  if (response.data.code === 1) {
    ElMessage.success('操作成功')
    load(1)
  } else {
    ElMessage.error(response.data.msg)
  }
}

const addPlanDetail = (planId) => {
  detailFromVisible.value = true
  detailForm.planId = planId
}

// 保存plan详情
const savePlanDetail = async () => {
  const response = await request.post('/planDetail/add', detailForm)
  if (response.data.code === 1) {
    ElMessage.success('操作成功')
    load(1)
    detailFromVisible.value = false
  } else {
    ElMessage.error(response.data.msg)
  }
}

onMounted(() => {
  load(1)
})

const handleImgSuccess = (res) => {
  form.cover = res.data
}

const handleCurrentChange = (page) => {
  load(page)
}
</script>

<template>
  <div>
    <div class="search">
      <el-button
        type="primary"
        plain
        @click="handleAdd"
        style="margin-right: 18px"
        >新增</el-button
      >
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
    </div>

    <!-- <div class="operation">
      <el-button type="primary" plain @click="handleAdd">新增</el-button>
    </div> -->

    <div style="margin-top: 10px" v-if="tableData.length">
      <div>
        <el-row :gutter="10" style="margin-bottom: 10px">
          <el-col
            v-for="item in tableData"
            :key="item.id"
            :span="12"
            style="margin-bottom: 5px"
          >
            <div
              style="display: flex; align-items: center; cursor: pointer"
              class="card"
              @click="router.push('/planDetail?planId=' + item.id)"
            >
              <img :src="item.cover" alt="" style="width: 80px; height: 80px" />
              <div style="flex: 1; margin-left: 15px">
                <div
                  style="
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                  "
                >
                  <el-tag type="warning" v-if="item.status === '未开始'">{{
                    item.status
                  }}</el-tag>
                  <el-tag type="primary" v-if="item.status === '进行中'">{{
                    item.status
                  }}</el-tag>
                  <el-tag type="danger" v-if="item.status === '已结束'">{{
                    item.status
                  }}</el-tag>
                  <el-tag type="success" v-if="item.status === '已完成'">{{
                    item.status
                  }}</el-tag>
                  <div style="font-size: 20px; flex: 1; width: 0" class="line1">
                    {{ item.name }}
                  </div>
                  <div style="color: #666; margin-left: 20px; font-size: 16px">
                    <el-icon><Calendar /></el-icon>
                    {{ item.start }} —— {{ item.end }}
                  </div>
                </div>
                <div style="margin-bottom: 10px">
                  <el-progress :percentage="item.percent"></el-progress>
                </div>
                <div style="display: flex; align-items: center">
                  <div style="color: #666">
                    <!-- <span style="margin-right: 40px">
                      <el-icon><User /></el-icon> {{ item.username }}
                    </span> -->
                    <!-- <span style="margin-left: 10px"
                      ><el-icon><Calendar /></el-icon>
                      {{ item.createTime }}</span
                    > -->
                  </div>
                  <div style="width: 50px">
                    <el-button type="primary" @click="addPlanDetail(item.id)"
                      >存一笔</el-button
                    >
                  </div>
                  <div style="flex: 1; text-align: right">
                    <el-button
                      @click.stop="handleEdit(item)"
                      type="text"
                      style="font-size: 16px; color: #2a60c9"
                      ><el-icon><Edit /></el-icon>编辑</el-button
                    >
                    <el-button
                      @click.stop="del(item.id)"
                      type="text"
                      style="font-size: 16px; color: red"
                      ><el-icon><Delete /></el-icon> 删除</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
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
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="form.name" placeholder="计划名称"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-upload
            :action="baseURL + '/files/upload'"
            :headers="{ token: user.token }"
            list-type="picture"
            :on-success="handleImgSuccess"
          >
            <el-button type="primary">上传封面</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="总金额" prop="money">
          <el-input v-model="form.money" placeholder="总金额"></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="start">
          <el-date-picker
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            v-model="form.start"
            placeholder="开始日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="end">
          <el-date-picker
            type="date"
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            v-model="form.end"
            placeholder="结束日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="fromVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      title="存钱"
      v-model="detailFromVisible"
      width="30%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        :model="detailForm"
        label-width="100px"
        style="padding-right: 50px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="金额" prop="money">
          <el-input v-model="detailForm.money" placeholder="金额"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="detailFromVisible = false">取 消</el-button>
          <el-button type="primary" @click="savePlanDetail">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.search,
.operation {
  margin-bottom: 10px;
}
.card {
  border: 1px solid #e8e8e8;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.pagination {
  margin-top: 10px;
  text-align: center;
}
.line1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.el-icon {
  margin-right: 3px;
}

.el-tag {
  margin-right: 10px;
}
</style>
