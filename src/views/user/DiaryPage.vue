<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import E from 'wangeditor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import request from '@/utils/request'
import { baseURL } from '@/utils/request'
import moment from 'moment'

const tableData = ref([]) // 所有的数据
const pageNum = ref(1) // 当前的页码
const pageSize = ref(10) // 每页显示的个数
const total = ref(0)
const title = ref(null)
const fromVisible = ref(false)
const form = reactive({})
const formRef = ref(null)
const user = JSON.parse(localStorage.getItem('big-user') || '{}')
const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
}
const ids = ref([])
const contentVisible = ref(false)
const content = ref('')

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const mode = ref('default')

// 内容 HTML
const valueHtml = ref('')

const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {}
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const showContent = (contentText) => {
  content.value = contentText
  contentVisible.value = true
}

const handleAdd = () => {
  Object.keys(form).forEach((key) => delete form[key])
  setText()
  fromVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(form, JSON.parse(JSON.stringify(row)))

  // 等待编辑器实例初始化完成后设置内容
  // 使用setTimeout延迟执行setText，确保编辑器实例已经初始化
  setTimeout(() => {
    setText(form.content)
  }, 100)
  fromVisible.value = true
}

// 保存
const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      form.content = editorRef.value.getText()
      const url = form.id ? '/diary/update' : '/diary/add'
      const method = form.id ? 'put' : 'post'
      request({
        url,
        method,
        data: {
          id: form.id,
          title: form.title,
          cover: form.cover,
          content: form.content,
          userId: user.id,
          username: user.username
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
      request.delete('/diary/delete/' + id).then((res) => {
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

const handleSelectionChange = (rows) => {
  ids.value = rows.map((v) => v.id)
}

// 分页
const load = (pageNumParam) => {
  if (pageNumParam) pageNum.value = pageNumParam
  request
    .get('/diary/selectPage', {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        title: title.value
      }
    })
    .then((res) => {
      tableData.value = res.data.data?.list || []
      total.value = res.data.data?.total || []
    })
}

const reset = () => {
  title.value = null
  load(1)
}

const handleCurrentChange = (pageNumParam) => {
  load(pageNumParam)
}

const handleCoverSuccess = (res) => {
  console.log('cover res', res.data)
  form.cover = res.data
}

const setText = (content) => {
  editorConfig.MENU_CONF['uploadImage'] = {
    server: baseURL + '/files/upload',
    fieldName: 'img',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxNumberOfFiles: 10,
    meta: {
      token: user.token
    }
  }
  if (content) {
    editorRef.value.setHtml(content)
  }
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
    </div>

    <div class="table" v-if="user.role === 'ADMIN' && tableData.length">
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
          width="80"
          align="center"
          sortable
        ></el-table-column>
        <el-table-column label="封面">
          <template v-slot="scope">
            <div style="display: flex; align-items: center">
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
          prop="title"
          label="标题"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="内容">
          <template v-slot="scope">
            <el-button @click="showContent(scope.row.content)"
              >查看内容</el-button
            >
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期">
          <template #default="scope">
            {{
              scope.row.createTime
                ? moment(scope.row.createTime).format('YYYY-MM-DD')
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="创建人"></el-table-column>
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

    <div
      style="margin-top: 10px"
      v-else-if="tableData.length"
      class="diary-card"
    >
      <el-row :gutter="10" style="margin-bottom: 10px">
        <el-col
          v-for="item in tableData"
          :key="item.id"
          :span="12"
          style="margin-bottom: 5px"
        >
          <div class="card">
            <div>
              <div class="card-header">
                <div class="card-title">
                  {{ item.title }}
                </div>
                <div class="card-time">
                  <span><i class="el-icon-user"></i> {{ item.username }}</span>
                  <span
                    ><i class="el-icon-date"></i>
                    {{
                      item.createTime
                        ? moment(item.createTime).format('YYYY-MM-DD')
                        : ''
                    }}</span
                  >
                </div>
              </div>
              <div class="card-button">
                <div>
                  <el-button
                    @click="showContent(item.content)"
                    type="success"
                    class="card-button-item card-button-item-read"
                    ><el-icon><Reading /></el-icon>查看</el-button
                  >
                  <el-button
                    @click="handleEdit(item)"
                    type="primary"
                    class="card-button-item card-button-item-editor"
                    ><el-icon><Edit /></el-icon>编辑</el-button
                  >
                  <el-button
                    @click="del(item.id)"
                    type="danger"
                    class="card-button-item card-button-item-delete"
                    ><el-icon><Delete /></el-icon> 删除</el-button
                  >
                </div>
              </div>
            </div>
            <div class="img">
              <img
                :src="item.cover"
                alt=""
                style="max-width: 120px; max-height: 80px"
              />
            </div>
          </div>
        </el-col>
      </el-row>

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
      width="60%"
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
        <el-form-item prop="content" label="内容">
          <Toolbar
            style="border: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="
              height: 300px;
              width: 100%;
              border: 1px solid #ccc;
              border-top: 0;
              overflow-y: hidden;
            "
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
          />
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
      title="信息"
      v-model="contentVisible"
      width="50%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="w-e-text">
        <div v-html="content"></div>
      </div>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="contentVisible = false"
            >确 定</el-button
          >
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

.diary-card {
  .card {
    display: flex;
    justify-content: space-between;

    background-color: #fff;
    margin-bottom: 7px;
    padding: 20px 25px;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

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
        /* margin-right: 20px; */
        .el-icon {
          font-size: 16px;
          margin-right: 5px;
        }
      }
      .card-button-read {
        color: #fff;
        margin-right: 20px;
      }
    }
  }
}
</style>
