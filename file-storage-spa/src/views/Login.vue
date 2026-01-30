<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">Вход в систему</h1>

      <div
        v-if="message"
        class="message message-error show"
      >
        {{ message }}
      </div>

      <form @submit.prevent="submit">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ error: errors.email }"
            placeholder="user@example.com"
          />
          <div class="form-error">
            {{ errors.email }}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Пароль</label>
          <input
            v-model="form.password"
            type="password"
            class="form-input"
            :class="{ error: errors.password }"
            placeholder="Введите пароль"
          />
          <div class="form-error">
            {{ errors.password }}
          </div>
        </div>

        <button class="btn btn-primary btn-full">
          Войти
        </button>
      </form>

      <div class="text-center mt-20">
        <span>Нет аккаунта? </span>
        <RouterLink to="/registration" class="link">
          Зарегистрироваться
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/http'

const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const message = ref('')

const clearErrors = () => {
  errors.email = ''
  errors.password = ''
  message.value = ''
}

const submit = async () => {
  clearErrors()

  let hasError = false

  if (!form.email) {
    errors.email = 'Введите email'
    hasError = true
  }

  if (!form.password) {
    errors.password = 'Введите пароль'
    hasError = true
  }

  if (hasError) return

  try {
    const response = await api('/authorization', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    localStorage.setItem('token', response.data.token)

    router.push('/')

  } catch (err) {
    if (err?.error?.code === 401) {
      message.value = 'Неверный email или пароль'
    } else {
      message.value = 'Ошибка входа. Попробуйте позже'
    }
  }
}
</script>
