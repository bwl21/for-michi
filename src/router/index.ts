import { createRouter, createWebHistory, type RouteRecordRaw, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/forms',
    name: 'FormsList',
    component: () => import('@/views/forms/FormsListView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forms/create',
    name: 'FormCreate',
    component: () => import('@/views/forms/FormEditorView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forms/:id',
    name: 'FormEdit',
    component: () => import('@/views/forms/FormEditorView.vue'),
    meta: { requiresAuth: false },
    props: true
  },
  {
    path: '/forms/:id/submit',
    name: 'FormSubmit',
    component: () => import('@/views/forms/FormSubmitView.vue'),
    props: true
  },
  {
    path: '/submissions',
    name: 'SubmissionsList',
    component: () => import('@/views/submissions/SubmissionsListView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
