<script setup>
import { ref } from 'vue'

const emit = defineEmits(['registered', 'login'])

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
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

async function register() {
  error.value = ''
  success.value = ''

  const cleanName = name.value.trim()
  const cleanEmail = email.value.trim().toLowerCase()

  if (!cleanName) {
    error.value = 'Please enter your full name.'
    return
  }

  if (!cleanEmail) {
    error.value = 'Please enter your email address.'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    error.value = 'Please enter a valid email address.'
    return
  }

  if (!password.value) {
    error.value = 'Please enter a password.'
    return
  }

  if (password.value.length < 8) {
    error.value =
      'Password must contain at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true

  try {
    const users = JSON.parse(
      localStorage.getItem('eventora-users') || '[]'
    )

    const existingUser = users.find(
      user =>
        user.email.toLowerCase() === cleanEmail
    )

    if (existingUser) {
      error.value =
        'An account with this email already exists.'
      return
    }

    const passwordHash = await hashPassword(password.value)

    users.push({
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      passwordHash
    })

    localStorage.setItem(
      'eventora-users',
      JSON.stringify(users)
    )

    success.value =
      'Account created successfully!'

    name.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''

    setTimeout(() => {
      emit('registered', cleanEmail)
    }, 800)

  } catch (registrationError) {
    console.error(
      'Registration error:',
      registrationError
    )

    error.value =
      'Unable to create the account. Please try again.'

  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page">

    <div class="auth-card">

      <!-- Brand -->
      <div class="auth-brand">
        <div class="auth-logo">✦</div>

        <div>
          <strong>EVENTORA</strong>
          <small>EVENT MANAGEMENT</small>
        </div>
      </div>

      <!-- Header -->
      <div class="auth-heading">
        <span>ACCOUNT REGISTRATION</span>

        <h1>Create Account</h1>

        <p>
          Register to access your Eventora system.
        </p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="register">

        <div class="form-group">
          <label for="name">Full Name</label>

          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Enter your full name"
            autocomplete="name"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>

          <input
            id="email"
            v-model="email"
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
            placeholder="Minimum 8 characters"
            autocomplete="new-password"
            minlength="8"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirm-password">
            Confirm Password
          </label>

          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            autocomplete="new-password"
            minlength="8"
            required
          />
        </div>

        <div
          v-if="error"
          class="auth-message error"
          role="alert"
        >
          {{ error }}
        </div>

        <div
          v-if="success"
          class="auth-message success"
          role="status"
        >
          {{ success }}
        </div>

        <button
          class="auth-submit"
          type="submit"
          :disabled="isLoading"
        >
          {{ isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT' }}
        </button>

      </form>

      <!-- Login -->
      <div class="auth-footer">
        <span>Already have an account?</span>

        <button
          type="button"
          @click="emit('login')"
        >
          Sign in
        </button>
      </div>

    </div>

  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(50, 199, 149, 0.12),
      transparent 35%
    ),
    #050e0b;
  color: #effbf6;
}

.auth-card {
  width: min(100%, 480px);
  padding: 2.5rem;
  border: 1px solid rgba(68, 211, 163, 0.18);
  border-radius: 24px;
  background: rgba(10, 23, 19, 0.96);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.45);
}

.auth-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 2.5rem;
}

.auth-logo {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #f2bd4d;
  color: #07110d;
  font-size: 1.4rem;
}

.auth-brand strong {
  display: block;
  font-size: 1.15rem;
  letter-spacing: 0.08em;
}

.auth-brand small {
  display: block;
  margin-top: 0.2rem;
  color: #8ca99e;
  font-size: 0.55rem;
  letter-spacing: 0.12em;
}

.auth-heading {
  margin-bottom: 1.8rem;
}

.auth-heading span {
  color: #32c795;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.auth-heading h1 {
  margin: 0.5rem 0;
  font-size: 2rem;
}

.auth-heading p {
  margin: 0;
  color: #8ca99e;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.78rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(68, 211, 163, 0.16);
  border-radius: 10px;
  outline: none;
  background: #081712;
  color: #effbf6;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input:focus {
  border-color: #32c795;
  box-shadow: 0 0 0 3px rgba(50, 199, 149, 0.08);
}

.form-group input::placeholder {
  color: #526b62;
}

.auth-message {
  padding: 0.8rem 1rem;
  margin: 1rem 0;
  border-radius: 10px;
  font-size: 0.8rem;
}

.error {
  border: 1px solid rgba(239, 96, 96, 0.3);
  background: rgba(239, 96, 96, 0.08);
  color: #ff8c8c;
}

.success {
  border: 1px solid rgba(50, 199, 149, 0.3);
  background: rgba(50, 199, 149, 0.08);
  color: #32c795;
}

.auth-submit {
  width: 100%;
  padding: 0.95rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 10px;
  background: #f2bd4d;
  color: #07110d;
  font-weight: 800;
  cursor: pointer;
  transition:
    filter 0.2s ease,
    opacity 0.2s ease;
}

.auth-submit:hover:not(:disabled) {
  filter: brightness(1.08);
}

.auth-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.auth-footer {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 1.5rem;
  color: #8ca99e;
  font-size: 0.8rem;
}

.auth-footer button {
  border: none;
  background: none;
  color: #32c795;
  font-weight: 700;
  cursor: pointer;
}

.auth-footer button:hover {
  text-decoration: underline;
}

@media (max-width: 520px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-card {
    padding: 2rem 1.5rem;
  }
}
</style>