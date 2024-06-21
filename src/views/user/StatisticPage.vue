<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import request from '@/utils/request'

const user = JSON.parse(localStorage.getItem('big-user') || '{}')
const ac = ref({})
const payList = ref([])
const incomeList = ref([])
const colorList = ['#f56c6c', '#e6a23c', '#5cb87a', '#1989fa', '#6f7ad3']

let pieChart = null
let pieChart1 = null

const pieOption = {
  title: {
    text: '账户支出分类统计',
    subtext: '比例图',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'pie',
      center: ['50%', '60%'],
      radius: '50%',
      data: [],
      label: {
        show: true,
        formatter(param) {
          return param.name + ' (' + param.percent + '%)'
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

const pieOption1 = {
  title: {
    text: '账户收入分类统计',
    subtext: '比例图',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'pie',
      center: ['50%', '60%'],
      radius: '50%',
      data: [],
      label: {
        show: true,
        formatter(param) {
          return param.name + ' (' + param.percent + '%)'
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

const fetchAccountData = async () => {
  try {
    const res = await request.get(`/account/selectAll`, {
      params: { userId: user.id }
    })
    console.log('fetchAccountData------', res)
    ac.value = res.data.data?.length ? res.data.data[0] : {}
  } catch (error) {
    console.error('Error fetching account data:', error)
  }
}

const fetchPayData = async () => {
  try {
    const res = await request.get(`/bill/count`, {
      params: { type: '支出' }
    })
    console.log('fetchPayData------', res)

    payList.value = res.data.data || []
    const arr = payList.value.map((item) => ({
      name: item.category,
      value: item.money
    }))
    pieOption.series[0].data = arr

    await nextTick()
    const pieDom = document.getElementById('pie')
    if (pieDom) {
      if (pieChart) {
        pieChart.dispose()
      }
      pieChart = echarts.init(pieDom)
      pieChart.setOption(pieOption)
    }
  } catch (error) {
    console.error('Error fetching pay data:', error)
  }
}

const fetchIncomeData = async () => {
  try {
    const res = await request.get(`/bill/count`, {
      params: { type: '收入' }
    })
    console.log('fetchIncomeData------', res)

    incomeList.value = res.data.data || []
    const arr = incomeList.value.map((item) => ({
      name: item.category,
      value: item.money
    }))
    pieOption1.series[0].data = arr

    await nextTick()
    const pieDom1 = document.getElementById('pie1')
    if (pieDom1) {
      if (pieChart1) {
        pieChart1.dispose()
      }
      pieChart1 = echarts.init(pieDom1)
      pieChart1.setOption(pieOption1)
    }
  } catch (error) {
    console.error('Error fetching income data:', error)
  }
}

onMounted(() => {
  fetchAccountData()
  fetchPayData()
  fetchIncomeData()
})

onBeforeUnmount(() => {
  if (pieChart) {
    pieChart.dispose()
  }
  if (pieChart1) {
    pieChart1.dispose()
  }
})
</script>

<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card>
            <div style="display: flex; align-items: center">
              <div style="width: 150px">
                <div style="font-size: 20px">账户余额</div>
              </div>
              <div style="flex: 1">
                <div style="font-size: 16px; color: red; font-weight: bold">
                  ￥ {{ ac.balance || 0 }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div style="display: flex; align-items: center">
              <div style="width: 150px">
                <div style="font-size: 20px">账户支出</div>
              </div>
              <div style="flex: 1">
                <div style="font-size: 16px; color: green; font-weight: bold">
                  ￥ {{ ac.pay || 0 }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <div style="display: flex; align-items: center">
              <div style="width: 150px">
                <div style="font-size: 20px">账户收入</div>
              </div>
              <div style="flex: 1">
                <div style="font-size: 16px; color: orange; font-weight: bold">
                  ￥ {{ ac.income || 0 }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div style="display: flex; grid-gap: 10px; margin-bottom: 10px">
      <div style="width: 50%" class="card">
        <div style="font-weight: bold; font-size: 24px; margin-bottom: 20px">
          支出统计
        </div>
        <div v-for="item in payList" :key="item.id" style="margin-bottom: 5px">
          {{ item.category }} {{ item.money }}
          <el-progress
            :stroke-width="12"
            :percentage="item.percent"
            :color="colorList"
          ></el-progress>
        </div>
      </div>

      <div style="width: 50%" class="card">
        <div style="font-weight: bold; font-size: 24px; margin-bottom: 20px">
          收入统计
        </div>
        <div
          v-for="item in incomeList"
          :key="item.id"
          style="margin-bottom: 5px"
        >
          {{ item.category }} {{ item.money }}
          <el-progress
            :stroke-width="12"
            :percentage="item.percent"
            :color="colorList"
          ></el-progress>
        </div>
      </div>
    </div>

    <div style="display: flex; grid-gap: 10px; margin-bottom: 10px">
      <div style="width: 45.8%" class="card">
        <div id="pie" style="width: 90%; height: 400px"></div>
      </div>
      <div style="width: 45.8%" class="card">
        <div id="pie1" style="width: 90%; height: 400px"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
