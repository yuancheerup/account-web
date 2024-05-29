import { defineStore } from 'pinia'
import { ref } from 'vue'
// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const username = ref('')

    const setToken = (newToken) => {
      token.value = newToken
    }
    const setUsername = (newVal) => {
      username.value = newVal
    }

    const removeToken = () => {
      token.value = ''
    }

    return {
      token,
      username,
      setToken,
      setUsername,
      removeToken
    }
  },
  {
    persist: true
  }
)
