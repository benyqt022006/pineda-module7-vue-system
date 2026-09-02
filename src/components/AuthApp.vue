<script setup>
import { ref } from 'vue'
import App from '../App.vue'
import Login from './Login.vue'
import Register from './Register.vue'

const mode = ref('login')
const isAuthenticated = ref(
  sessionStorage.getItem('eventoraAuthenticated') === 'true'
)

const showRegister = () => {
  mode.value = 'register'
}

const showLogin = () => {
  mode.value = 'login'
}

const authenticated = () => {
  sessionStorage.setItem(
    'eventoraAuthenticated',
    'true'
  )

  isAuthenticated.value = true
}
</script>

<template>
  <Login
    v-if="!isAuthenticated && mode === 'login'"
    @register="showRegister"
    @authenticated="authenticated"
  />

  <Register
    v-else-if="!isAuthenticated && mode === 'register'"
    @login="showLogin"
    @registered="showLogin"
  />

  <App v-else />
</template>