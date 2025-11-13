import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Form } from '@/types/forms'
import { createForm, getForm, updateForm, deleteForm, submitForm } from '@/services/formService'

export const useFormStore = defineStore('form', () => {
  const currentForm = ref<Form | null>(null)
  const forms = ref<Form[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchForm(id: string): Promise<Form | null> {
    try {
      isLoading.value = true
      const form = await getForm(id)
      if (form) {
        currentForm.value = form
      }
      return form
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch form'
      error.value = message
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  async function saveForm(formData: Partial<Form>): Promise<Form> {
    try {
      isLoading.value = true
      let form: Form
      
      if (formData.id) {
        form = await updateForm(formData.id, formData)
      } else {
        form = await createForm(formData)
      }
      
      currentForm.value = form
      return form
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save form'
      error.value = message
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  async function removeForm(id: string): Promise<void> {
    try {
      await deleteForm(id)
      if (currentForm.value?.id === id) {
        currentForm.value = null
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete form'
      error.value = message
      throw new Error(message)
    }
  }

  async function submitFormResponse(
    formId: string, 
    responses: Record<string, unknown>
  ): Promise<unknown> {
    try {
      isLoading.value = true
      return await submitForm(formId, responses)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit form'
      error.value = message
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  function resetCurrentForm(): void {
    currentForm.value = null
  }

  return {
    currentForm,
    forms,
    isLoading,
    error,
    fetchForm,
    saveForm,
    removeForm,
    submitForm: submitFormResponse,
    resetCurrentForm
  }
})
