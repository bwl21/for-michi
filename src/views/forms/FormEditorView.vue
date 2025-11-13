<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFormStore } from '@/stores/form'
import { useAuthStore } from '@/stores/auth'
import FormBuilder from '@/components/forms/FormBuilder.vue'
import FormPreview from '@/components/forms/FormPreview.vue'
import FormSettings from '@/components/forms/FormSettings.vue'
import { Save, ArrowLeft, Eye, Code, Settings, Check } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'

const route = useRoute()
const router = useRouter()
const formStore = useFormStore()
const authStore = useAuthStore()

const formId = route.params.id as string | undefined
const isNewForm = !formId
const isLoading = ref(true)
const activeTab = ref('builder')
const isSaving = ref(false)

// Form data
const formData = ref({
  title: 'Neues Formular',
  description: '',
  settings: {
    isActive: true,
    requiresLogin: false,
    submitButtonText: 'Absenden',
    successMessage: 'Vielen Dank für Ihre Anmeldung!',
    allowMultipleSubmissions: false,
    submitterCanViewResponses: false,
    redirectUrl: ''
  },
  sections: [] as any[],
  questions: [] as any[],
  conditions: [] as any[]
})

// Fetch form data if editing
onMounted(async () => {
  if (formId) {
    try {
      isLoading.value = true
      const form = await formStore.fetchForm(formId)
      if (form) {
        formData.value = { ...form }
      }
    } catch (error) {
      console.error('Error loading form:', error)
      toast.error('Fehler beim Laden des Formulars')
      router.push('/forms')
    } finally {
      isLoading.value = false
    }
  } else {
    isLoading.value = false
  }
})

// Save form
const saveForm = async () => {
  try {
    isSaving.value = true
    
    if (isNewForm) {
      // Create new form
      const newForm = await formStore.saveForm({
        ...formData.value,
        createdBy: authStore.user?.id
      })
      toast.success('Formular erfolgreich erstellt')
      router.push(`/forms/${newForm.id}`)
    } else {
      // Update existing form
      await formStore.saveForm({
        ...formData.value,
        id: formId
      })
      toast.success('Änderungen gespeichert')
    }
  } catch (error) {
    console.error('Error saving form:', error)
    toast.error('Fehler beim Speichern des Formulars')
  } finally {
    isSaving.value = false
  }
}

// Update form data from child components
const updateFormData = (data: any) => {
  formData.value = { ...formData.value, ...data }
}

// Navigate back to forms list
const goBack = () => {
  router.push('/forms')
}

// Preview form
const previewForm = () => {
  activeTab.value = 'preview'
}

// Toggle form status
const toggleStatus = async () => {
  try {
    formData.value.settings.isActive = !formData.value.settings.isActive
    await saveForm()
    toast.success(
      formData.value.settings.isActive 
        ? 'Formular ist jetzt aktiv' 
        : 'Formular ist jetzt inaktiv'
    )
  } catch (error) {
    console.error('Error toggling form status:', error)
    toast.error('Fehler beim Ändern des Status')
  }
}
</script>

<template>
  <div class="form-editor">
    <div class="editor-header">
      <div class="header-left">
        <button class="btn btn-link" @click="goBack">
          <ArrowLeft class="icon" />
          Zurück zur Übersicht
        </button>
        <h1>{{ isNewForm ? 'Neues Formular erstellen' : formData.title }}</h1>
        <div v-if="!isNewForm" class="form-status" @click="toggleStatus">
          <span class="status-indicator" :class="{ 'is-active': formData.settings.isActive }"></span>
          {{ formData.settings.isActive ? 'Aktiv' : 'Inaktiv' }}
        </div>
      </div>
      
      <div class="header-actions">
        <button 
          class="btn btn-outline"
          :class="{ 'active': activeTab === 'preview' }"
          @click="previewForm"
        >
          <Eye class="icon" />
          Vorschau
        </button>
        <button 
          class="btn btn-primary"
          :disabled="isSaving"
          @click="saveForm"
        >
          <Save class="icon" />
          {{ isSaving ? 'Wird gespeichert...' : 'Speichern' }}
        </button>
      </div>
    </div>

    <div class="editor-tabs">
      <button 
        class="tab-btn" 
        :class="{ 'active': activeTab === 'builder' }"
        @click="activeTab = 'builder'"
      >
        <Code class="icon" />
        Formular erstellen
      </button>
      <button 
        class="tab-btn" 
        :class="{ 'active': activeTab === 'settings' }"
        @click="activeTab = 'settings'"
      >
        <Settings class="icon" />
        Einstellungen
      </button>
    </div>

    <div class="editor-content">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Lade Formular...</p>
      </div>
      
      <template v-else>
        <FormBuilder 
          v-if="activeTab === 'builder'" 
          v-model="formData"
          @update:modelValue="updateFormData"
        />
        
        <FormPreview 
          v-else-if="activeTab === 'preview'" 
          :form="formData"
          @back="activeTab = 'builder'"
        />
        
        <FormSettings 
          v-else-if="activeTab === 'settings'" 
          v-model="formData"
          @update:modelValue="updateFormData"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.form-editor {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  gap: 0.5rem;
}

.btn-link {
  background: none;
  border: none;
  color: #4a5568;
  text-decoration: none;
  padding: 0.5rem 0;
}

.btn-link:hover {
  color: var(--ct-color-primary);
  text-decoration: underline;
}

.btn-outline {
  background: white;
  border-color: #cbd5e0;
  color: #4a5568;
}

.btn-outline:hover {
  border-color: #a0aec0;
  background-color: #f7fafc;
}

.btn-outline.active {
  border-color: var(--ct-color-primary);
  color: var(--ct-color-primary);
  background-color: rgba(66, 153, 225, 0.05);
}

.btn-primary {
  background-color: var(--ct-color-primary);
  color: white;
  border-color: var(--ct-color-primary);
}

.btn-primary:hover {
  background-color: #2b6cb0;
  border-color: #2b6cb0;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background-color: #a0aec0;
  border-color: #a0aec0;
}

.icon {
  width: 1rem;
  height: 1rem;
}

.form-status {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #4a5568;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.form-status:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.status-indicator {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: #e53e3e;
}

.status-indicator.is-active {
  background-color: #38a169;
}

.editor-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 1.5rem;
  background-color: #f8fafc;
}

.tab-btn {
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  color: #4a5568;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--ct-color-primary);
  background-color: rgba(66, 153, 225, 0.05);
}

.tab-btn.active {
  color: var(--ct-color-primary);
  border-bottom-color: var(--ct-color-primary);
  font-weight: 600;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #f7fafc;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #4a5568;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--ct-color-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
