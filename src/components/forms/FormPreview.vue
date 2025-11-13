<template>
  <div class="form-preview">
    <div v-if="loading" class="loading-indicator">
      Loading form preview...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else class="preview-container">
      <div class="preview-header">
        <h3>{{ form.title || 'Form Preview' }}</h3>
        <p v-if="form.description">{{ form.description }}</p>
      </div>
      
      <div class="form-fields">
        <div 
          v-for="(field, index) in form.fields" 
          :key="index"
          class="form-field"
        >
          <label :for="`field-${index}`">
            {{ field.label }}
            <span v-if="field.required" class="required">*</span>
          </label>
          
          <input 
            v-if="field.type === 'text' || field.type === 'email' || field.type === 'number'"
            :id="`field-${index}`"
            v-model="formData[field.name]"
            :type="field.type"
            :required="field.required"
            :placeholder="field.placeholder || ''"
          />
          
          <textarea
            v-else-if="field.type === 'textarea'"
            :id="`field-${index}`"
            v-model="formData[field.name]"
            :required="field.required"
            :placeholder="field.placeholder || ''"
            rows="4"
          ></textarea>
          
          <select
            v-else-if="field.type === 'select'"
            :id="`field-${index}`"
            v-model="formData[field.name]"
            :required="field.required"
          >
            <option value="" disabled selected>Select an option</option>
            <option 
              v-for="(option, i) in field.options" 
              :key="i" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          
          <div v-else-if="field.type === 'radio'" class="radio-group">
            <label 
              v-for="(option, i) in field.options" 
              :key="i"
              class="radio-option"
            >
              <input
                type="radio"
                :name="field.name"
                :value="option.value"
                v-model="formData[field.name]"
                :required="field.required"
              >
              {{ option.label }}
            </label>
          </div>
          
          <div v-else-if="field.type === 'checkbox'" class="checkbox-group">
            <label class="checkbox-option">
              <input
                type="checkbox"
                :id="`field-${index}`"
                v-model="formData[field.name]"
                :required="field.required"
              >
              {{ field.label }}
            </label>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          type="button" 
          class="submit-button"
          @click="submitForm"
          :disabled="submitting"
        >
          {{ submitting ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFormStore } from '@/stores/form'

const route = useRoute()
const formStore = useFormStore()

const loading = ref(true)
const error = ref('')
const form = ref({
  id: '',
  title: '',
  description: '',
  fields: []
})

const formData = ref({})
const submitting = ref(false)

// Load form data
const loadForm = async () => {
  try {
    loading.value = true
    error.value = ''
    
    // This would typically come from your API
    // For now, we'll use a sample form
    form.value = {
      id: route.params.id || 'sample-form',
      title: 'Sample Form',
      description: 'This is a sample form preview',
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          placeholder: 'Enter your email'
        },
        {
          name: 'message',
          label: 'Your Message',
          type: 'textarea',
          required: true,
          placeholder: 'Type your message here'
        }
      ]
    }
    
    // Initialize form data with empty values
    formData.value = form.value.fields.reduce((acc, field) => {
      return { ...acc, [field.name]: '' }
    }, {})
    
  } catch (err) {
    console.error('Error loading form:', err)
    error.value = 'Failed to load form. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Handle form submission
const submitForm = async () => {
  try {
    submitting.value = true
    console.log('Form submitted:', formData.value)
    // Here you would typically submit the form data to your API
    // await formStore.submitFormResponse(form.value.id, formData.value)
    alert('Form submitted successfully!')
  } catch (err) {
    console.error('Error submitting form:', err)
    error.value = 'Failed to submit form. Please try again.'
  } finally {
    submitting.value = false
  }
}

// Load form when component is mounted
onMounted(() => {
  loadForm()
})
</script>

<style scoped>
.form-preview {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-indicator,
.error-message {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.error-message {
  color: #e53e3e;
  background-color: #fff5f5;
  border-radius: 4px;
  padding: 1rem;
}

.preview-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.preview-header h3 {
  margin: 0 0 0.5rem;
  color: #2d3748;
  font-size: 1.5rem;
}

.preview-header p {
  margin: 0;
  color: #718096;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #4a5568;
}

.required {
  color: #e53e3e;
  margin-left: 0.25rem;
}

input[type="text"],
input[type="email"],
input[type="number"],
textarea,
select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="number"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.radio-option input[type="radio"],
.checkbox-option input[type="checkbox"] {
  margin: 0;
  width: auto;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #3182ce;
}

.submit-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
</style>
