<template>
  <AppHeader />

  <div class="container">
    <div class="card card-wide">
      <h1 class="card-title">Файлы, доступные мне</h1>

      <div
        v-if="message"
        class="message message-error show"
      >
        {{ message }}
      </div>

      <div
        v-if="loading"
        class="loader show"
      ></div>

      <div
        v-if="!loading && files.length"
        class="file-list"
      >
        <div
          v-for="file in files"
          :key="file.id"
          class="file-item"
        >
          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>

            <div class="file-meta">
              ID: {{ file.id }}
              • Размер: {{ formatSize(file.size) }}<br />
              Владелец:
              {{ file.owner_name }} ({{ file.owner_email }})<br />
              Доступ предоставлен:
              {{ formatDate(file.shared_at) }}
            </div>
          </div>

          <div class="file-actions">
            <button
              class="btn btn-success btn-small"
              @click="download(file)"
            >
              ⬇️ Скачать
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="!loading && !files.length"
        class="text-center mt-20"
      >
        <p>Вам пока не предоставлен доступ ни к одному файлу</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { api } from '@/api/http'
import { downloadFile } from '@/api/files'


const files = ref([])
const loading = ref(false)
const message = ref('')

const loadShared = async () => {
  loading.value = true
  message.value = ''

  try {
    const res = await api('/files/shared')
    files.value = res.data.files
  } catch (e) {
    message.value = 'Не удалось загрузить доступные файлы'
  } finally {
    loading.value = false
  }
}

const download = (file) => {
  downloadFile(file.id, file.name)
}


const formatDate = (date) =>
  new Date(date).toLocaleDateString()

const formatSize = (bytes) => {
  if (!bytes) return '—'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} КБ`
  return `${(kb / 1024).toFixed(1)} МБ`
}

onMounted(loadShared)
</script>
