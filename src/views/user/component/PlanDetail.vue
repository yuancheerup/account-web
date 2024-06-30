<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const plan = ref({})
const tableData = ref([])
const detailForm = ref({})
const detailFromVisible = ref(false)
const formRef = ref(null)
const route = useRoute()
const planId = ref(route.query.planId)

const rules = {
  money: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur' }
  ]
}

const toback = () => {
  window.history.go(-1)
}

// 查询
const load = () => {
  request.get('/plan/selectById/' + planId.value).then((res) => {
    plan.value = res.data.data || {}
  })

  request
    .get('/planDetail/selectAll', { params: { planId: planId.value } })
    .then((res) => {
      tableData.value = res.data.data || []
    })
}

// 添加
const addPlanDetail = (planId) => {
  detailFromVisible.value = true
  detailForm.value = { planId: planId }
}

// 保存
const savePlanDetail = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      request.post('/planDetail/add', detailForm.value).then((res) => {
        if (res.data.code === 1) {
          ElMessage.success('操作成功')
          load()
          detailFromVisible.value = false
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
      request.delete(`/planDetail/delete/${id}/${planId.value}`).then((res) => {
        if (res.data.code === 1) {
          ElMessage.success('操作成功')
          load()
        } else {
          ElMessage.error(res.data.msg)
        }
      })
    })
    .catch(() => {})
}

onMounted(() => {
  load()
})
</script>

<template>
  <div>
    <!-- <div class="back">
      <el-icon><Back /></el-icon>
      <el-button type="primary" style="margin-bottom: 20px">返回</el-button>
    </div> -->
    <div class="card">
      <div class="status">
        <el-tag type="warning" v-if="plan.status === '未开始'">{{
          plan.status
        }}</el-tag>
        <el-tag type="primary" v-if="plan.status === '进行中'">{{
          plan.status
        }}</el-tag>
        <el-tag type="danger" v-if="plan.status === '已结束'">{{
          plan.status
        }}</el-tag>
        <el-tag type="success" v-if="plan.status === '已完成'">{{
          plan.status
        }}</el-tag>
        <div
          style="font-size: 20px; flex: 1; width: 0; margin-left: 5px"
          class="line1"
        >
          {{ plan.name }}
          <span
            style="
              color: red;
              font-size: 16px;
              font-weight: bold;
              margin-left: 30px;
            "
            >￥{{ plan.money }}</span
          >
          <el-button
            type="primary"
            style="margin-left: 20px"
            @click="addPlanDetail(planId)"
            >存一笔</el-button
          >
          <el-button type="primary" @click="toback">返回</el-button>
        </div>
        <div
          style="
            color: #666;
            margin-left: 20px;
            font-size: 16px;
            padding-right: 50px;
          "
        >
          <el-icon><Calendar /></el-icon>{{ plan.start }} —— {{ plan.end }}
        </div>
      </div>
      <div style="margin-bottom: 10px">
        <el-progress
          :percentage="plan.percent"
          style="font-size: 18px"
        ></el-progress>
      </div>
    </div>

    <div style="margin-top: 10px">
      <el-row :gutter="10">
        <el-col :span="6" v-for="item in tableData" :key="item.id">
          <div
            class="card"
            style="background-color: #fff1e0; margin-bottom: 10px"
          >
            <div
              style="display: flex; align-items: center; margin-bottom: 10px"
            >
              <div style="color: #666; flex: 1">存入 ￥{{ item.money }}</div>
              <div style="display: flex; align-items: center">
                累计
                <span style="color: red; font-size: 20px">
                  {{ item.total }}
                </span>
              </div>
            </div>
            <div style="display: flex; color: #666; font-size: 13px">
              <div style="flex: 1">
                {{ item.date.replace('T', ' ') }}
              </div>
              <div
                @click="del(item.id)"
                style="width: fit-content; cursor: pointer; font-size: 15px"
              >
                <el-icon><Delete /></el-icon><span>删除</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

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
      <template #footer>
        <el-button @click="detailFromVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePlanDetail">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.card {
  border-radius: 10px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 20px;
  .status {
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    .el-tag {
      margin-right: 10px;
    }
  }
}
.el-icon {
  margin-right: 3px;
}
</style>
