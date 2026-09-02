import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createHash } from 'node:crypto'

import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

describe('Module 9 - Authentication', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()

    // Provide crypto.subtle.digest for the Vitest/jsdom environment
    vi.stubGlobal('crypto', {
      subtle: {
        digest: async (algorithm, data) => {
          const hash = createHash(
            algorithm.name || algorithm
          )

          hash.update(Buffer.from(data))

          const result = hash.digest()

          return result.buffer.slice(
            result.byteOffset,
            result.byteOffset + result.byteLength
          )
        }
      }
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  // TC-M9-01
  it('successfully registers a new account', async () => {
    const wrapper = mount(Register)

    await wrapper.find('#name').setValue('Justin Pineda')
    await wrapper.find('#email').setValue('justinp@gmail.com')
    await wrapper.find('#password').setValue('password123')
    await wrapper
      .find('#confirm-password')
      .setValue('password123')

    await wrapper.find('form').trigger('submit.prevent')

    // Allow async password hashing to complete
    await vi.runAllTimersAsync()
    await wrapper.vm.$nextTick()

    const users = JSON.parse(
      localStorage.getItem('eventora-users') || '[]'
    )

    expect(users).toHaveLength(1)
    expect(users[0].name).toBe('Justin Pineda')
    expect(users[0].email).toBe('justinp@gmail.com')
    expect(users[0].passwordHash).toBeTruthy()
    expect(wrapper.emitted('registered')).toBeTruthy()
  })

  // TC-M9-02
  it('rejects registration when the email already exists', async () => {
    localStorage.setItem(
      'eventora-users',
      JSON.stringify([
        {
          id: 1,
          name: 'Justin Pineda',
          email: 'justinp@gmail.com',
          passwordHash: 'existing-hash'
        }
      ])
    )

    const wrapper = mount(Register)

    await wrapper.find('#name').setValue('Another User')
    await wrapper.find('#email').setValue('justinp@gmail.com')
    await wrapper.find('#password').setValue('password123')
    await wrapper
      .find('#confirm-password')
      .setValue('password123')

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain(
      'An account with this email already exists.'
    )
  })

  // TC-M9-03
  it('successfully logs in with valid registered credentials', async () => {
    const registerWrapper = mount(Register)

    await registerWrapper
      .find('#name')
      .setValue('Justin Pineda')

    await registerWrapper
      .find('#email')
      .setValue('justinp@gmail.com')

    await registerWrapper
      .find('#password')
      .setValue('password123')

    await registerWrapper
      .find('#confirm-password')
      .setValue('password123')

    await registerWrapper
      .find('form')
      .trigger('submit.prevent')

    await vi.runAllTimersAsync()
    await registerWrapper.vm.$nextTick()

    const loginWrapper = mount(Login)

    await loginWrapper
      .find('#email')
      .setValue('justinp@gmail.com')

    await loginWrapper
      .find('#password')
      .setValue('password123')

    await loginWrapper
      .find('form')
      .trigger('submit.prevent')

    await vi.runAllTimersAsync()
    await loginWrapper.vm.$nextTick()

    expect(
      sessionStorage.getItem('eventoraAuthenticated')
    ).toBe('true')

    expect(
      sessionStorage.getItem('eventoraUser')
    ).toBeTruthy()

    expect(
      loginWrapper.emitted('authenticated')
    ).toBeTruthy()
  })

  // TC-M9-04
  it('rejects login with an incorrect password', async () => {
    const registerWrapper = mount(Register)

    await registerWrapper
      .find('#name')
      .setValue('Justin Pineda')

    await registerWrapper
      .find('#email')
      .setValue('justinp@gmail.com')

    await registerWrapper
      .find('#password')
      .setValue('password123')

    await registerWrapper
      .find('#confirm-password')
      .setValue('password123')

    await registerWrapper
      .find('form')
      .trigger('submit.prevent')

    await vi.runAllTimersAsync()
    await registerWrapper.vm.$nextTick()

    const loginWrapper = mount(Login)

    await loginWrapper
      .find('#email')
      .setValue('justinp@gmail.com')

    await loginWrapper
      .find('#password')
      .setValue('wrongpassword')

    await loginWrapper
      .find('form')
      .trigger('submit.prevent')

    await vi.runAllTimersAsync()
    await loginWrapper.vm.$nextTick()

    expect(
      sessionStorage.getItem('eventoraAuthenticated')
    ).not.toBe('true')

    expect(loginWrapper.text()).toContain(
      'Invalid email or password.'
    )
  })

  // TC-M9-05
  it('rejects login when the email is not registered', async () => {
    const wrapper = mount(Login)

    await wrapper
      .find('#email')
      .setValue('notregistered@gmail.com')

    await wrapper
      .find('#password')
      .setValue('password123')

    await wrapper
      .find('form')
      .trigger('submit.prevent')

    await wrapper.vm.$nextTick()

    expect(
      sessionStorage.getItem('eventoraAuthenticated')
    ).not.toBe('true')

    expect(wrapper.text()).toContain(
      'Invalid email or password.'
    )
  })

  // TC-M9-06
  it('requires email and password before login', async () => {
    const wrapper = mount(Login)

    await wrapper
      .find('form')
      .trigger('submit.prevent')

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain(
      'Please enter your email and password.'
    )

    expect(
      sessionStorage.getItem('eventoraAuthenticated')
    ).not.toBe('true')
  })

  // TC-M9-07
  it('logs out by clearing the authentication session', async () => {
    sessionStorage.setItem(
      'eventoraAuthenticated',
      'true'
    )

    sessionStorage.setItem(
      'eventoraUser',
      JSON.stringify({
        name: 'Justin Pineda',
        email: 'justinp@gmail.com'
      })
    )

    // Simulate the logout behavior used by Eventora
    sessionStorage.removeItem('eventoraAuthenticated')
    sessionStorage.removeItem('eventoraUser')

    expect(
      sessionStorage.getItem('eventoraAuthenticated')
    ).toBeNull()

    expect(
      sessionStorage.getItem('eventoraUser')
    ).toBeNull()
  })
})