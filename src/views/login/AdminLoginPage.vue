<script setup>
import { provide } from 'vue'
import LoginPage from './LoginPage.vue'

provide('parentId', 'admin')
</script>
<template>
  <LoginPage>后台管理登录</LoginPage>
</template>

<style></style>
