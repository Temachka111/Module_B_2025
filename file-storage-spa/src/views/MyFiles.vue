<template>
  <AppHeader />

  <div class="container">
    <div class="card card-wide">
      <h1 class="card-title">Мои файлы</h1>

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
              • Размер: {{ formatSize(file.size) }}
              • Создан: {{ formatDate(file.created_at) }}
            </div>
          </div>

          <div class="file-actions">
            <button
              class="btn btn-success btn-small"
              @click="download(file)"

            >
              ⬇️ Скачать
            </button>

            <button
              class="btn btn-primary btn-small"
              @click="edit(file.id)"
            >
              ✏️ Изменить
            </button>

            <button
              class="btn btn-secondary btn-small"
              @click="permissions(file.id)"
            >
              👥 Доступ
            </button>

            <button
              class="btn btn-danger btn-small"
              @click="remove(file.id)"
            >
              🗑️ Удалить
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="!loading && !files.length"
        class="text-center mt-20"
      >
        <p>У вас пока нет загруженных файлов</p>
        <RouterLink to="/upload" class="btn btn-primary mt-10">
          Загрузить файлы
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { api } from '@/api/http'
import { downloadFile } from '@/api/files'


const router = useRouter()

const files = ref([])
const loading = ref(false)
const message = ref('')

const loadFiles = async () => {
  loading.value = true
  message.value = ''

  try {
    const res = await api('/files/my')
    files.value = res.data.files
  } catch (e) {
    message.value = 'Не удалось загрузить файлы'
  } finally {
    loading.value = false
  }
}

const download = (file) => {
  downloadFile(file.id, file.name)
}



const edit = (id) => {
  router.push(`/edit/${id}`)
}

const permissions = (id) => {
  router.push(`/permissions/${id}`)
}

const remove = async (id) => {
  if (!confirm('Удалить файл?')) return

  try {
    await api(`/files/${id}`, {
      method: 'DELETE'
    })

    files.value = files.value.filter(f => f.id !== id)
  } catch (e) {
    message.value = 'Ошибка удаления файла'
  }
}

const formatDate = (date) =>
  new Date(date).toLocaleDateString()

const formatSize = (bytes) => {
  if (!bytes) return '—'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} КБ`
  return `${(kb / 1024).toFixed(1)} МБ`
}

onMounted(loadFiles)
</script>
