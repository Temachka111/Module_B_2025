<template>
  <AppHeader />

  <div class="container">
    <div class="card card-wide">
      <h1 class="card-title">Управление правами доступа</h1>

      <div class="mb-20">
        <strong>Файл:</strong>
        <span>{{ fileName || '—' }}</span>
      </div>

      <div
        v-if="message"
        class="message message-error show"
      >
        {{ message }}
      </div>

      <div class="card" style="background:#f8f9fa; box-shadow:none; padding:20px;">
        <h3 class="mb-10">Добавить пользователя</h3>

        <form @submit.prevent="addPermission">
          <div class="form-group">
            <label class="form-label">Email пользователя</label>
            <input
              v-model="email"
              type="email"
              class="form-input"
              :class="{ error: emailError }"
              placeholder="user@example.com"
            />
            <div class="form-error">{{ emailError }}</div>
          </div>

          <button class="btn btn-primary">
            ➕ Добавить доступ
          </button>
        </form>
      </div>

      <h3 class="mt-20 mb-10">Пользователи с доступом</h3>

      <div v-if="permissions.length" class="user-list">
        <div
          v-for="user in permissions"
          :key="user.user_id"
          class="user-item"
        >
          <div class="user-info">
            <div class="user-name">{{ user.full_name }}</div>
            <div class="user-email">{{ user.email }}</div>
            <div class="user-email" style="font-size:12px;color:#999;">
              Доступ предоставлен:
              {{ formatDate(user.granted_at) }}
            </div>
          </div>

          <button
            class="btn btn-danger"
            @click="removePermission(user.user_id)"
          >
            🗑️ Удалить доступ
          </button>
        </div>
      </div>

      <div
        v-if="!permissions.length"
        class="text-center mt-20"
      >
        <p>Доступ к файлу пока никому не предоставлен</p>
      </div>

      <div class="mt-20">
        <button class="btn btn-secondary" @click="back">
          ← Назад к списку файлов
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { api } from '@/api/http'

const route = useRoute()
const router = useRouter()

const fileId = route.params.id

const fileName = ref('')
const permissions = ref([])
const email = ref('')
const emailError = ref('')
const message = ref('')

const loadPermissions = async () => {
  try {
    const res = await api(`/files/${fileId}/permissions`)
    permissions.value = res.data.permissions
  } catch (e) {
    message.value = 'Не удалось загрузить права доступа'
  }
}

const addPermission = async () => {
  emailError.value = ''
  message.value = ''

  if (!email.value) {
    emailError.value = 'Введите email'
    return
  }

  try {
    await api(`/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.value })
    })

    email.value = ''
    loadPermissions()

  } catch (e) {
    if (e?.error?.code === 404) {
      emailError.value = 'Пользователь не найден'
    } else if (e?.error?.code === 409) {
      emailError.value = 'Доступ уже предоставлен'
    } else {
      message.value = 'Ошибка добавления доступа'
    }
  }
}

const removePermission = async (userId) => {
  if (!confirm('Удалить доступ?')) return

  try {
    await api(`/files/${fileId}/permissions/${userId}`, {
      method: 'DELETE'
    })

    permissions.value =
      permissions.value.filter(u => u.user_id !== userId)

  } catch (e) {
    message.value = 'Ошибка удаления доступа'
  }
}

const formatDate = (date) =>
  new Date(date).toLocaleString()

const back = () => {
  router.push('/')
}

onMounted(loadPermissions)
</script>
