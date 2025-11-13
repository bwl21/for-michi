<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const isActive = (path: string) => {
  return router.currentRoute.value.path === path
}

const userInitials = computed(() => {
  if (!authStore.user) return ''
  return `${authStore.user.firstName[0]}${authStore.user.lastName[0]}`.toUpperCase()
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">
            <h1>Formular Manager</h1>
          </router-link>
        </div>
        
        <nav class="main-nav" :class="{ 'is-open': isMenuOpen }">
          <ul class="nav-list">
            <li v-if="authStore.isAuthenticated">
              <router-link 
                to="/forms" 
                class="nav-link"
                :class="{ 'active': isActive('/forms') }"
              >
                Formulare
              </router-link>
            </li>
            <li v-if="authStore.isAuthenticated && authStore.isAdmin">
              <router-link 
                to="/submissions" 
                class="nav-link"
                :class="{ 'active': isActive('/submissions') }"
              >
                Einsendungen
              </router-link>
            </li>
          </ul>
        </nav>
        
        <div class="user-actions">
          <div v-if="authStore.isAuthenticated" class="user-menu">
            <button 
              class="user-button"
              @click="toggleMenu"
              aria-label="Benutzermenü"
            >
              <span class="user-avatar">{{ userInitials }}</span>
              <span class="user-name">
                {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
              </span>
              <span class="dropdown-arrow">▼</span>
            </button>
            
            <div v-if="isMenuOpen" class="dropdown-menu">
              <router-link 
                to="/profile" 
                class="dropdown-item"
                @click="isMenuOpen = false"
              >
                Profil
              </router-link>
              <button 
                class="dropdown-item logout"
                @click="handleLogout"
              >
                Abmelden
              </button>
            </div>
          </div>
          
          <router-link 
            v-else
            to="/login" 
            class="login-button"
          >
            Anmelden
          </router-link>
        </div>
        
        <button 
          class="mobile-menu-button"
          @click="toggleMenu"
          aria-label="Menü öffnen/schließen"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--ct-color-primary);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.logo a {
  color: white;
  text-decoration: none;
}

.main-nav {
  flex: 1;
  margin: 0 2rem;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-list li {
  margin: 0 1rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: white;
  border-bottom-color: white;
}

.user-actions {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-right: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.user-name {
  margin: 0 0.5rem;
}

.dropdown-arrow {
  font-size: 0.6rem;
  opacity: 0.8;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  margin-top: 0.5rem;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
  text-align: left;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.logout {
  color: #e53e3e;
}

.login-button {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.login-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-button span {
  display: block;
  width: 24px;
  height: 2px;
  background-color: white;
  margin: 4px 0;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .main-nav {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    margin: 0;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 999;
  }
  
  .main-nav.is-open {
    transform: translateY(0);
    opacity: 1;
  }
  
  .nav-list {
    flex-direction: column;
  }
  
  .nav-list li {
    margin: 0.5rem 0;
  }
  
  .nav-link {
    color: #333;
    display: block;
    padding: 0.5rem 0;
  }
  
  .mobile-menu-button {
    display: block;
  }
  
  .user-actions {
    margin-left: auto;
  }
}
</style>
