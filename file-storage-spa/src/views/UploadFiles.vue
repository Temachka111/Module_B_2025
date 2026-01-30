<template>
  <AppHeader />

  <div class="container">
    <div class="card card-wide">
      <h1 class="card-title">Загрузка файлов</h1>

      <div
        v-if="message"
        class="message message-error show"
      >
        {{ message }}
      </div>

      <div
        class="upload-area"
        :class="{ 'drag-over': dragOver }"
        @dragenter.prevent="dragOver = true"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="onDrop"
      >
        <div class="upload-icon">📤</div>
        <div class="upload-text">Перетащите файлы сюда</div>
        <div class="upload-hint">или</div>

        <label class="btn btn-primary" style="margin-top: 10px; cursor: pointer;">
          📁 Выбрать файлы
          <input
            type="file"
            class="file-input"
            multiple
            @change="onSelect"
          />
        </label>
      </div>

      <div v-if="loading" class="loader show"></div>

      <div
        v-if="results.length"
        class="upload-results"
      >
        <h3 class="mb-10">Результаты загрузки</h3>

        <div
          v-for="file in results"
          :key="file.name"
          class="upload-item"
        >
          <div class="upload-status">
            <span
              class="status-icon"
              :class="file.uploaded ? 'success' : 'error'"
            >
              {{ file.uploaded ? '✅' : '❌' }}
            </span>

            <div>
              <div class="file-name">{{ file.name }}</div>
              <div
                class="file-meta"
                :style="{ color: file.uploaded ? '#555' : '#e74c3c' }"
              >
                {{ file.uploaded
                  ? 'Загружен успешно'
                  : file.error || 'Ошибка загрузки'
                }}
              </div>
            </div>
          </div>

            <button
              v-if="file.uploaded"
              class="btn btn-success btn-small"
              @click="downloadFile(file.id, file.name)"
            >
            ⬇️ Скачать
          </button>
        </div>
      </div>

      <div class="mt-20">
        <button class="btn btn-secondary" @click="back">
          ← Назад к моим файлам
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { api } from '@/api/http'
import { downloadFile } from '@/api/files'


const router = useRouter()

const dragOver = ref(false)
const loading = ref(false)
const message = ref('')
const results = ref([])

const upload = async (files) => {
  message.value = ''
  loading.value = true
  results.value = []

  const formData = new FormData()
  Array.from(files).forEach(file => {
    formData.append('files[]', file)
  })

  try {
    const res = await api('/files/upload', {
      method: 'POST',
      body: formData
    })

    results.value = res.data.files.map(f => ({
      ...f,
      uploaded: true
    }))

  } catch (err) {
    message.value = 'Ошибка загрузки файлов'
  } finally {
    loading.value = false
  }
}

const onSelect = (e) => {
  upload(e.target.files)
}

const onDrop = (e) => {
  dragOver.value = false
  upload(e.dataTransfer.files)
}

const download = (id) => {

}

const back = () => {
  router.push('/')
}
</script>
