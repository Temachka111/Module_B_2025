<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">Регистрация</h1>

      <div
        v-if="message"
        class="message message-error show"
      >
        {{ message }}
      </div>

      <form @submit.prevent="submit">
        <div class="form-group">
          <label class="form-label">Фамилия</label>
          <input
            v-model="form.last_name"
            class="form-input"
            :class="{ error: errors.last_name }"
            placeholder="Иванов"
          />
          <div class="form-error">{{ errors.last_name }}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Имя</label>
          <input
            v-model="form.first_name"
            class="form-input"
            :class="{ error: errors.first_name }"
            placeholder="Иван"
          />
          <div class="form-error">{{ errors.first_name }}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Отчество</label>
          <input
            v-model="form.patronymic"
            class="form-input"
            :class="{ error: errors.patronymic }"
            placeholder="Иванович"
          />
          <div class="form-error">{{ errors.patronymic }}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            :class="{ error: errors.email }"
            placeholder="user@example.com"
          />
          <div class="form-error">{{ errors.email }}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Дата рождения</label>
          <input
            v-model="form.birth_date"
            type="date"
            class="form-input"
            :class="{ error: errors.birth_date }"
          />
          <div class="form-error">{{ errors.birth_date }}</div>
        </div>

        <div class="form-group">
          <label class="form-label">Пароль</label>
          <input
            v-model="form.password"
            type="password"
            class="form-input"
            :class="{ error: errors.password }"
            placeholder="Минимум 3 символа"
          />
          <div class="form-error">{{ errors.password }}</div>
        </div>

        <button class="btn btn-primary btn-full">
          Зарегистрироваться
        </button>
      </form>

      <div class="text-center mt-20">
        <span>Уже есть аккаунт? </span>
        <RouterLink to="/login" class="link">
          Войти
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
  first_name: '',
  last_name: '',
  patronymic: '',
  email: '',
  password: '',
  birth_date: ''
})

const errors = reactive({})
const message = ref('')

const clearErrors = () => {
  message.value = ''
  Object.keys(errors).forEach(k => delete errors[k])
}

const submit = async () => {
  clearErrors()

  try {
    await api('/registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    router.push('/login')

  } catch (err) {
    if (err?.error?.code === 422) {
      Object.assign(errors, err.error.errors)
    } else {
      message.value = 'Ошибка регистрации. Попробуйте позже'
    }
  }
}
</script>
