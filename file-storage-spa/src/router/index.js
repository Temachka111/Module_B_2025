import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/Login.vue'
import Registration from '@/views/Registration.vue'
import MyFiles from '@/views/MyFiles.vue'
import SharedFiles from '@/views/SharedFiles.vue'
import UploadFiles from '@/views/UploadFiles.vue'
import EditFile from '@/views/EditFile.vue'
import FilePermissions from '@/views/FilePermissions.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/registration', component: Registration },

  { path: '/', component: MyFiles, meta: { auth: true } },
  { path: '/shared', component: SharedFiles, meta: { auth: true } },
  { path: '/upload', component: UploadFiles, meta: { auth: true } },
  { path: '/edit/:id', component: EditFile, meta: { auth: true } },
  { path: '/permissions/:id', component: FilePermissions, meta: { auth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta.auth && !localStorage.getItem('token')) {
    return '/login'
  }
})

export default router
