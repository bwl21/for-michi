<template>
  <div class="form-settings">
    <h3>Form Settings</h3>
    
    <div class="settings-section">
      <h4>General</h4>
      <div class="form-group">
        <label for="form-title">Form Title</label>
        <input
          id="form-title"
          v-model="form.title"
          type="text"
          placeholder="Enter form title"
          class="form-control"
        >
      </div>
      
      <div class="form-group">
        <label for="form-description">Description</label>
        <textarea
          id="form-description"
          v-model="form.description"
          rows="3"
          placeholder="Enter form description"
          class="form-control"
        ></textarea>
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Form Behavior</h4>
      
      <div class="form-group">
        <label class="checkbox-option">
          <input
            type="checkbox"
            v-model="form.requireLogin"
          >
          Require login to submit
        </label>
      </div>
      
      <div class="form-group">
        <label class="checkbox-option">
          <input
            type="checkbox"
            v-model="form.multipleSubmissions"
          >
          Allow multiple submissions
        </label>
      </div>
      
      <div class="form-group">
        <label for="redirect-url">Redirect after submission</label>
        <input
          id="redirect-url"
          v-model="form.redirectUrl"
          type="url"
          placeholder="https://example.com/thank-you"
          class="form-control"
        >
      </div>
    </div>
    
    <div class="settings-section">
      <h4>Notifications</h4>
      
      <div class="form-group">
        <label for="notification-email">Notification Email</label>
        <input
          id="notification-email"
          v-model="form.notificationEmail"
          type="email"
          placeholder="email@example.com"
          class="form-control"
        >
        <small class="hint">Email to receive submission notifications</small>
      </div>
      
      <div class="form-group">
        <label class="checkbox-option">
          <input
            type="checkbox"
            v-model="form.sendConfirmationEmail"
          >
          Send confirmation email to respondents
        </label>
      </div>
    </div>
    
    <div class="form-actions">
      <button 
        type="button" 
        class="btn btn-primary"
        @click="saveSettings"
        :disabled="!hasChanges || saving"
      >
        <span v-if="saving">Saving...</span>
        <span v-else>Save Settings</span>
      </button>
      
      <button 
        type="button" 
        class="btn btn-secondary"
        @click="resetForm"
        :disabled="!hasChanges || saving"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      requireLogin: false,
      multipleSubmissions: false,
      redirectUrl: '',
      notificationEmail: '',
      sendConfirmationEmail: false
    })
  }
})

const emit = defineEmits(['save'])

const form = ref({ ...props.initialData })
const initialFormState = ref(JSON.stringify(props.initialData))
const saving = ref(false)

const hasChanges = computed(() => {
  return JSON.stringify(form.value) !== initialFormState.value
})

const saveSettings = async () => {
  try {
    saving.value = true
    // Emit the save event with the form data
    emit('save', { ...form.value })
    // Update the initial form state to the new values
    initialFormState.value = JSON.stringify(form.value)
  } catch (error) {
    console.error('Error saving form settings:', error)
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  form.value = JSON.parse(initialFormState.value)
}

// Watch for changes to the initialData prop
watch(() => props.initialData, (newVal) => {
  form.value = { ...newVal }
  initialFormState.value = JSON.stringify(newVal)
}, { deep: true })
</script>

<style scoped>
.form-settings {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

h4 {
  margin: 1.5rem 0 1rem;
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
}

.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.5;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  margin: 0.5rem 0;
}

.checkbox-option input[type="checkbox"] {
  margin: 0;
  width: auto;
}

.hint {
  display: block;
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  border: 1px solid transparent;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: white;
  border-color: #d1d5db;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #9ca3af;
}
</style>
