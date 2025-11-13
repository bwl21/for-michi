import axios from 'axios'
import type { 
  Form, 
  FormSection, 
  FormQuestion, 
  FormSubmission
} from '@/types/forms'

// Export types for external use
export type { Form, FormSection, FormQuestion, FormSubmission } from '@/types/forms'

const API_BASE_URL = import.meta.env.VITE_CT_API_URL

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('auth_token')
  return {
    'Authorization': `Login ${token}`,
    'Content-Type': 'application/json'
  }
}

// Forms

export async function getForms(): Promise<Form[]> {
  const response = await axios.get(`${API_BASE_URL}/forms`, {
    headers: getAuthHeaders()
  })
  return response.data.data || []
}

export async function getForm(id: string): Promise<Form> {
  const response = await axios.get(`${API_BASE_URL}/forms/${id}`, {
    headers: getAuthHeaders()
  })
  return response.data.data
}

export async function createForm(formData: Partial<Form>): Promise<Form> {
  const response = await axios.post(`${API_BASE_URL}/forms`, formData, {
    headers: getAuthHeaders()
  })
  return response.data.data
}

export async function updateForm(id: string, formData: Partial<Form>): Promise<Form> {
  const response = await axios.put(`${API_BASE_URL}/forms/${id}`, formData, {
    headers: getAuthHeaders()
  })
  return response.data.data
}

export async function deleteForm(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/forms/${id}`, {
    headers: getAuthHeaders()
  })
}

// Form Sections

export async function getFormSections(formId: string): Promise<FormSection[]> {
  const response = await axios.get(`${API_BASE_URL}/forms/${formId}/sections`, {
    headers: getAuthHeaders()
  })
  return response.data.data || []
}

export async function createFormSection(sectionData: Partial<FormSection>): Promise<FormSection> {
  const response = await axios.post(
    `${API_BASE_URL}/forms/${sectionData.formId}/sections`,
    sectionData,
    { headers: getAuthHeaders() }
  )
  return response.data.data
}

// Form Questions

export async function getFormQuestions(formId: string): Promise<FormQuestion[]> {
  const response = await axios.get(`${API_BASE_URL}/forms/${formId}/questions`, {
    headers: getAuthHeaders()
  })
  return response.data.data || []
}

// Form Submissions

export async function submitForm(
  formId: string, 
  responses: Record<string, any>
): Promise<FormSubmission> {
  const response = await axios.post(
    `${API_BASE_URL}/forms/${formId}/submissions`,
    { responses },
    { headers: getAuthHeaders() }
  )
  return response.data.data
}

export async function getFormSubmissions(formId: string): Promise<FormSubmission[]> {
  const response = await axios.get(`${API_BASE_URL}/forms/${formId}/submissions`, {
    headers: getAuthHeaders()
  })
  return response.data.data || []
}

// Export form data
export async function exportFormData(formId: string, format: 'csv' | 'json' = 'json') {
  const response = await axios.get(`${API_BASE_URL}/forms/${formId}/export?format=${format}`, {
    headers: getAuthHeaders(),
    responseType: format === 'csv' ? 'blob' : 'json'
  })
  return response.data
}

// Group related functions
export async function getGroupFields(groupId: string) {
  const response = await axios.get(`${API_BASE_URL}/groups/${groupId}/fields`, {
    headers: getAuthHeaders()
  })
  return response.data.data || []
}

export async function getGroupMembers(groupId: string) {
  const response = await axios.get(`${API_BASE_URL}/groups/${groupId}/members`, {
    headers: getAuthHeaders()
  })
  return response.data.data || []
}

// Helper function to save form data to group fields
export async function saveToGroupFields(
  groupId: string, 
  personId: string, 
  fieldData: Record<string, any>
) {
  const response = await axios.post(
    `${API_BASE_URL}/groups/${groupId}/members/${personId}/fields`,
    fieldData,
    { headers: getAuthHeaders() }
  )
  return response.data.data
}
