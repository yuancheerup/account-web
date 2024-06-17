import { defineStore } from 'pinia'
import { ref } from 'vue'
// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const id = ref()
    const username = ref('')
    const name = ref('')
    const role = ref('')
    const avatar = ref('')
    const phone = ref('')
    const email = ref('')

    const setUser = (
      newId,
      newUsername,
      newName,
      newAvatar,
      newRole,
      newPhone,
      newEmail,
      newToken
    ) => {
      token.value = newToken
      id.value = newId
      username.value = newUsername
      name.value = newName
      role.value = newRole
      avatar.value = newAvatar
      phone.value = newPhone
      email.value = newEmail
    }

    const setToken = (newToken) => {
      token.value = newToken
    }
    const setId = (newVal) => {
      id.value = newVal
    }
    const setUsername = (newVal) => {
      username.value = newVal
    }
    const setName = (newVal) => {
      name.value = newVal
    }
    const setRole = (newVal) => {
      role.value = newVal
    }
    const setAvatar = (newVal) => {
      avatar.value = newVal
    }
    const setPhone = (newVal) => {
      phone.value = newVal
    }
    const setEmail = (newVal) => {
      email.value = newVal
    }

    const removeToken = () => {
      token.value = ''
      id.value = ''
      username.value = ''
      name.value = ''
      role.value = ''
      avatar.value = ''
      phone.value = ''
      email.value = ''
    }

    return {
      token,
      id,
      username,
      name,
      role,
      avatar,
      phone,
      email,
      setUser,
      setToken,
      setId,
      setUsername,
      setName,
      setRole,
      setAvatar,
      setPhone,
      setEmail,
      removeToken
    }
  },
  {
    persist: true
  }
)
