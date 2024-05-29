<script setup>
import { ref, onBeforeMount } from 'vue'
import request from '@/utils/request'

const notices = ref([])

const user = JSON.parse(localStorage.getItem('big-user') || '{}')

// 获取公告数据
onBeforeMount(() => {
  request.get('/notice/selectAll').then((res) => {
    notices.value = res.data.data || []
  })
})
</script>

<template>
  <div>
    <div class="card">您好，{{ user?.username }}！欢迎使用本系统</div>

    <div style="display: flex; margin: 10px 0">
      <div style="width: 50%" class="card">
        <div style="margin-bottom: 30px; font-size: 20px; font-weight: bold">
          公告列表
        </div>
        <div>
          <el-timeline reverse>
            <el-timeline-item
              v-for="item in notices"
              :key="item.id"
              :timestamp="item.createTime.replace('T', ' ')"
              size="large"
              hollow="true"
              color="#0bbd87"
            >
              <el-popover
                placement="right"
                width="200"
                trigger="hover"
                :content="item.content"
              >
                <template #reference>
                  <span>{{ item.title }}</span>
                </template>
              </el-popover>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 15px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 10px;
}
</style>
