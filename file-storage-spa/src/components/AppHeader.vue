<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">📁 Файловое хранилище</div>

      <nav class="nav">
        <RouterLink
          to="/"
          class="nav-link"
          :class="{ active: isActive('/') }"
        >
          Мои файлы
        </RouterLink>

        <RouterLink
          to="/shared"
          class="nav-link"
          :class="{ active: isActive('/shared') }"
        >
          Доступные файлы
        </RouterLink>

        <RouterLink
          to="/upload"
          class="nav-link"
          :class="{ active: isActive('/upload') }"
        >
          Загрузить
        </RouterLink>
      </nav>

      <button class="btn-logout" @click="logout">
        Выход
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isActive = (path) => route.path === path

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
