<template>
  <div class="auth-page">
    <div class="auth-card">

      <div class="brand">
        <div class="brand-icon">✦</div>

        <div>
          <h1>EVENTORA</h1>
          <span>EVENT MANAGEMENT</span>
        </div>
      </div>

      <div class="auth-header">
        <p class="eyebrow">WELCOME BACK</p>
        <h2>Login</h2>
        <p>Sign in to manage your events.</p>
      </div>

      <form @submit.prevent="login">

        <div class="form-group">
          <label for="email">Email Address</label>

          <input
            id="email"
            v-model.trim="email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>

          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            autocomplete="current-password"
            required
          />
        </div>

        <p
          v-if="errorMessage"
          class="error"
          role="alert"
        >
          {{ errorMessage }}
        </p>

        <p
          v-if="successMessage"
          class="success"
          role="status"
        >
          {{ successMessage }}
        </p>

        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
        >
          {{ isLoading ? 'SIGNING IN...' : 'LOGIN' }}
        </button>

      </form>

      <div class="register-link">
        <span>Don't have an account?</span>

        <button
          type="button"
          @click="goToRegister"
        >
          Create Account
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits([
  'register',
  'authenticated'
])

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

async function hashPassword(value) {
  const data = new TextEncoder().encode(value)

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    data
  )

  return Array.from(new Uint8Array(hashBuffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
}

const login = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const cleanEmail = email.value.toLowerCase().trim()

  if (!cleanEmail || !password.value) {
    errorMessage.value =
      'Please enter your email and password.'
    return
  }

  isLoading.value = true

  try {
    const users = JSON.parse(
      localStorage.getItem('eventora-users') || '[]'
    )

    const user = users.find(
      account =>
        account.email.toLowerCase() === cleanEmail
    )

    if (!user) {
      errorMessage.value =
        'Invalid email or password.'
      return
    }

    const enteredPasswordHash =
      await hashPassword(password.value)

    if (
      enteredPasswordHash !== user.passwordHash
    ) {
      errorMessage.value =
        'Invalid email or password.'
      return
    }

    sessionStorage.setItem(
      'eventoraAuthenticated',
      'true'
    )

    sessionStorage.setItem(
      'eventoraUser',
      JSON.stringify({
        name: user.name,
        email: user.email
      })
    )

    successMessage.value =
      'Login successful. Welcome to Eventora!'

    setTimeout(() => {
      emit('authenticated')
    }, 500)

  } catch (loginError) {
    console.error(
      'Login error:',
      loginError
    )

    errorMessage.value =
      'Unable to complete login. Please try again.'

  } finally {
    isLoading.value = false
  }
}

const goToRegister = () => {
  emit('register')
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background: #020b08;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  border: 1px solid rgba(40, 200, 150, 0.25);
  border-radius: 24px;
  background: #071914;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 35px;
}

.brand-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #f2aa19;
  color: white;
  font-size: 24px;
}

.brand h1 {
  margin: 0;
  color: white;
  font-size: 20px;
  letter-spacing: 1px;
}

.brand span {
  color: #7f9a91;
  font-size: 9px;
  letter-spacing: 2px;
}

.eyebrow {
  color: #24c994;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.auth-header h2 {
  margin: 8px 0;
  color: white;
  font-size: 32px;
}

.auth-header p:last-child {
  color: #81978f;
  margin-bottom: 28px;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #b5c7c0;
  font-size: 13px;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border: 1px solid rgba(40, 200, 150, 0.22);
  border-radius: 12px;
  outline: none;
  background: #081f18;
  color: white;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

input:focus {
  border-color: #24c994;
  box-shadow: 0 0 0 3px rgba(36, 201, 148, 0.08);
}

input::placeholder {
  color: #526b62;
}

.error {
  margin: 8px 0;
  color: #ff7777;
  font-size: 13px;
}

.success {
  margin: 8px 0;
  color: #24c994;
  font-size: 13px;
}

.login-button {
  width: 100%;
  padding: 14px;
  margin-top: 8px;
  border: none;
  border-radius: 12px;
  background: #f2aa19;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition:
    filter 0.2s ease,
    opacity 0.2s ease;
}

.login-button:hover:not(:disabled) {
  filter: brightness(1.08);
}

.login-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.register-link {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 24px;
  color: #81978f;
  font-size: 13px;
}

.register-link button {
  padding: 0;
  border: none;
  background: none;
  color: #24c994;
  cursor: pointer;
  font-weight: 700;
}

.register-link button:hover {
  text-decoration: underline;
}

@media (max-width: 520px) {
  .auth-page {
    padding: 20px;
  }

  .auth-card {
    padding: 28px 22px;
  }
}
</style>