<script setup>
import { provide } from 'vue'
import LoginPage from './LoginPage.vue'

provide('parentId', 'user')
</script>
<template>
  <LoginPage
    >My Account
    <template #footer> 还没有账号？请 <a href="/register">注册</a> </template>
  </LoginPage>
</template>

<style>
a {
  color: #5081e4;
  text-decoration: none;
}

a:hover {
  color: #2a60c9;
  text-decoration: underline;
}
</style>
