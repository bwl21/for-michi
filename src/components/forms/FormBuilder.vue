<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { Plus, GripVertical, Trash2, Settings, Copy, ChevronDown, ChevronRight } from 'lucide-vue-next'
import type { Form, FormSection, FormQuestion, FormCondition } from '@/types/forms'

const props = defineProps<{
  modelValue: Form
}>()

const emit = defineEmits(['update:modelValue'])

const form = computed<Form>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// Helper function to update section data reactively
const updateSectionData = (sectionId: string, updates: Partial<FormSection>) => {
  const updatedSections = form.value.sections?.map(section => 
    section.id === sectionId ? { ...section, ...updates } : section
  ) || []
  
  form.value = {
    ...form.value,
    sections: updatedSections
  }
}

// Form sections
const activeSectionId = ref<string | null>(null)
const expandedSections = ref<Record<string, boolean>>({})
// Questions
const activeQuestionId = ref<string | null>(null)

// Form methods
function addSection() {
  const newSection: FormSection = {
    id: `section-${uuidv4()}`,
    formId: form.value.id || '',
    title: 'Neuer Abschnitt',
    description: '',
    order: form.value.sections ? form.value.sections.length : 0,
    settings: {
      isVisible: true
    }
  }
  
  form.value = {
    ...form.value,
    sections: [...(form.value.sections || []), newSection]
  }
  
  // Expand the new section
  expandedSections.value[newSection.id] = true
  setActiveSection(newSection.id)
}

function deleteSection(sectionId: string) {
  if (!form.value.sections) return
  
  // Delete all questions in this section
  const updatedQuestions = form.value.questions?.filter(
    q => q.sectionId !== sectionId
  ) || []
  
  // Delete the section
  const updatedSections = form.value.sections.filter(s => s.id !== sectionId)
  
  // Update orders
  const sectionsWithUpdatedOrders = updatedSections.map((section, index) => ({
    ...section,
    order: index
  }))
  
  form.value = {
    ...form.value,
    sections: sectionsWithUpdatedOrders,
    questions: updatedQuestions
  }
  
  // Clear active section if needed
  if (activeSectionId.value === sectionId) {
    activeSectionId.value = null
  }
}

function duplicateSection(section: FormSection) {
  if (!form.value.sections) return
  
  const newSection = {
    ...section,
    id: `section-${uuidv4()}`,
    title: `${section.title} (Kopie)`,
    order: form.value.sections.length
  }
  
  // Find questions in the original section
  const sectionQuestions = form.value.questions?.filter(
    q => q.sectionId === section.id
  ) || []
  
  // Create new questions with updated IDs and section references
  const newQuestions = sectionQuestions.map(question => ({
    ...question,
    id: `question-${uuidv4()}`,
    sectionId: newSection.id
  }))
  
  form.value = {
    ...form.value,
    sections: [...form.value.sections, newSection],
    questions: [...(form.value.questions || []), ...newQuestions]
  }
  
  // Expand the new section
  expandedSections.value[newSection.id] = true
  setActiveSection(newSection.id)
}

function setActiveSection(sectionId: string) {
  activeSectionId.value = sectionId
  activeQuestionId.value = null
}

function toggleSection(sectionId: string) {
  expandedSections.value[sectionId] = !expandedSections.value[sectionId]
  
  if (expandedSections.value[sectionId]) {
    setActiveSection(sectionId)
  } else if (activeSectionId.value === sectionId) {
    activeSectionId.value = null
  }
}

function moveSection(sectionId: string, direction: 'up' | 'down') {
  if (!form.value.sections) return
  
  const sections = [...form.value.sections]
  const currentIndex = sections.findIndex(s => s.id === sectionId)
  
  if (currentIndex === -1) return
  
  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  
  if (newIndex < 0 || newIndex >= sections.length) return
  
  // Swap orders
  const tempOrder = sections[currentIndex].order
  sections[currentIndex].order = sections[newIndex].order
  sections[newIndex].order = tempOrder
  
  // Swap elements
  const [movedSection] = sections.splice(currentIndex, 1)
  sections.splice(newIndex, 0, movedSection)
  
  form.value = {
    ...form.value,
    sections
  }
}

// Update methods
function updateQuestionLabel(questionId: string, value: string) {
  if (!form.value.questions) return;
  const questions = [...form.value.questions];
  const questionIndex = questions.findIndex(q => q.id === questionId);
  if (questionIndex !== -1) {
    questions[questionIndex] = { ...questions[questionIndex], label: value };
    form.value = { ...form.value, questions };
  }
}

function updateQuestionDescription(questionId: string, value: string) {
  if (!form.value.questions) return;
  const questions = [...form.value.questions];
  const questionIndex = questions.findIndex(q => q.id === questionId);
  if (questionIndex !== -1) {
    questions[questionIndex] = { ...questions[questionIndex], description: value };
    form.value = { ...form.value, questions };
  }
}

function updateQuestionRequired(questionId: string, value: boolean) {
  if (!form.value.questions) return;
  const questions = [...form.value.questions];
  const questionIndex = questions.findIndex(q => q.id === questionId);
  if (questionIndex !== -1) {
    questions[questionIndex] = { ...questions[questionIndex], isRequired: value };
    form.value = { ...form.value, questions };
  }
}

// Question methods
function addQuestion(sectionId: string) {
  const newQuestion: FormQuestion = {
    id: `question-${uuidv4()}`,
    sectionId,
    type: 'text', // Default type
    label: 'Neue Frage',
    description: '',
    isRequired: false,
    order: form.value.questions?.filter(q => q.sectionId === sectionId).length || 0,
    settings: {
      placeholder: '',
      options: []
    }
  }


  function updateQuestionLabel(questionId: string, label: string) {
    const question = form.value.questions?.find(q => q.id === questionId)
    if (question) {
      question.label = label
      const newIndex = direction === 'up'
          ? sectionQuestionIndex - 1
          : sectionQuestionIndex + 1

      if (newIndex < 0 || newIndex >= sectionQuestions.length) return

      // Find the target question in the main array
      const targetQuestion = sectionQuestions[newIndex]
      const targetIndex = questions.findIndex(q => q.id === targetQuestion.id)

      // Swap orders
      const tempOrder = currentQuestion.order
      currentQuestion.order = targetQuestion.order
      targetQuestion.order = tempOrder

      // Update the questions array
      questions[targetIndex] = {...currentQuestion}
      questions[currentIndex] = {...targetQuestion}

      form.value = {
        ...form.value,
        questions
      }
    }

// Get questions for a section
    function getQuestionsForSection(sectionId: string) {
      if (!form.value.questions) return []
      return form.value.questions
          .filter(q => q.sectionId === sectionId)
          .sort((a, b) => a.order - b.order)
    }

// Check if a section is expanded
    function isSectionExpanded(sectionId: string) {
      return !!expandedSections.value[sectionId]
    }

// Initialize expanded sections
    function initExpandedSections() {
      if (!form.value.sections) return

      form.value.sections.forEach(section => {
        if (expandedSections.value[section.id] === undefined) {
          expandedSections.value[section.id] = true
        }
      })
    }

// Initialize on mount
    onMounted(() => initExpandedSections())
  }
}
</script>
<template>
  <div class="form-builder">
    <div class="builder-container">
      <!-- Left sidebar - Form structure -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h3>Formular-Struktur</h3>
          <button class="btn btn-sm btn-primary" @click="addSection">
            <Plus class="icon" size="16" />
            Abschnitt hinzufügen
          </button>
        </div>
        
        <div class="sections-list">
          <div 
            v-for="section in form.sections?.sort((a, b) => a.order - b.order)" 
            :key="section.id"
            class="section-item"
            :class="{ 'is-active': activeSectionId === section.id }"
          >
            <div 
              class="section-header"
              @click="setActiveSection(section.id)"
            >
              <button 
                class="toggle-btn"
                @click.stop="toggleSection(section.id)"
                :aria-expanded="isSectionExpanded(section.id)"
                :aria-controls="`section-${section.id}-content`"
              >
                <ChevronDown 
                  v-if="isSectionExpanded(section.id)" 
                  size="16" 
                  class="icon" 
                />
                <ChevronRight v-else size="16" class="icon" />
              </button>
              
              <div class="section-title">
                {{ section.title || 'Unbenannter Abschnitt' }}
                <span class="question-count">
                  ({{ getQuestionsForSection(section.id).length }})
                </span>
              </div>
              
              <div class="section-actions">
                <button 
                  class="btn-icon"
                  @click.stop="duplicateSection(section)"
                  title="Abschnitt duplizieren"
                >
                  <Copy size="14" />
                </button>
                <button 
                  class="btn-icon"
                  @click.stop="deleteSection(section.id)"
                  title="Abschnitt löschen"
                >
                  <Trash2 size="14" />
                </button>
              </div>
            </div>
            
            <div 
              v-if="isSectionExpanded(section.id)"
              :id="`section-${section.id}-content`"
              class="section-content"
            >
              <div class="questions-list">
                <div 
                  v-for="question in getQuestionsForSection(section.id)" 
                  :key="question.id"
                  class="question-item"
                  :class="{ 'is-active': activeQuestionId === question.id }"
                  @click.stop="setActiveQuestion(question.id)"
                >
                  <div class="question-handle">
                    <GripVertical size="14" class="icon" />
                  </div>
                  <div class="question-title">
                    {{ question.label || 'Unbenannte Frage' }}
                    <span class="question-type">
                      {{ question.type }}
                    </span>
                  </div>
                  <div class="question-actions">
                    <button 
                      class="btn-icon"
                      @click.stop="duplicateQuestion(question)"
                      title="Frage duplizieren"
                    >
                      <Copy size="12" />
                    </button>
                    <button 
                      class="btn-icon"
                      @click.stop="deleteQuestion(question.id)"
                      title="Frage löschen"
                    >
                      <Trash2 size="12" />
                    </button>
                  </div>
                </div>
                
                <button 
                  class="add-question-btn"
                  @click.stop="addQuestion(section.id)"
                >
                  <Plus size="14" class="icon" />
                  Frage hinzufügen
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="!form.sections?.length" class="empty-state">
            <p>Keine Abschnitte vorhanden</p>
            <button class="btn btn-sm btn-primary" @click="addSection">
              Ersten Abschnitt erstellen
            </button>
          </div>
        </div>
      </div>
      
      <!-- Main content - Form editor -->
      <div class="main-content">
        <div v-if="activeSectionId" class="editor-panel">
          <div class="panel-header">
            <h3>Abschnitt bearbeiten</h3>
          </div>
          
          <div class="panel-content">
            <div class="form-group">
              <label>Titel</label>
              <input 
                type="text" 
                class="form-control"
                :value="form.sections?.find(s => s.id === activeSectionId)?.title"
                @input="updateSectionData(activeSectionId, { title: ($event.target as HTMLInputElement).value })"
                placeholder="Abschnittsname"
              />
            </div>
            
            <div class="form-group">
              <label>Beschreibung</label>
              <textarea 
                class="form-control"
                :value="form.sections?.find(s => s.id === activeSectionId)?.description"
                @input="updateSectionData(activeSectionId, { description: ($event.target as HTMLTextAreaElement).value })"
                placeholder="Optionale Beschreibung"
                rows="2"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button class="btn btn-sm btn-outline" @click="deleteSection(activeSectionId)">
                <Trash2 size="14" class="icon" />
                Abschnitt löschen
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-editor">
          <div class="empty-content">
            <Settings size="48" class="icon" />
            <h3>Formular bearbeiten</h3>
            <p>Wählen Sie einen Abschnitt aus oder erstellen Sie einen neuen, um mit der Bearbeitung zu beginnen.</p>
            <button class="btn btn-primary" @click="addSection">
              <Plus size="16" class="icon" />
              Neuer Abschnitt
            </button>
          </div>
        </div>
      </div>
      
      <!-- Right sidebar - Field settings -->
      <div class="sidebar settings-sidebar">
        <div class="sidebar-header">
          <h3>Feldeinstellungen</h3>
          <div class="field-type-indicator" v-if="activeQuestionId">
            {{ form.questions?.find(q => q.id === activeQuestionId)?.type || 'text' }}
          </div>
        </div>
        
        <div class="settings-content">
          <div v-if="activeQuestionId" class="field-settings">
            <div class="form-group">
              <label>Frage</label>
              <input 
                type="text" 
                class="form-control" 
                :value="form.questions?.find(q => q.id === activeQuestionId)?.label || ''"
                @input="updateQuestionLabel(activeQuestionId, $event.target.value)"
                placeholder="Frage eingeben"
              />
            </div>
            
            <div class="form-group">
              <label>Beschreibung</label>
              <input 
                type="text" 
                class="form-control" 
                :value="form.questions?.find(q => q.id === activeQuestionId)?.description || ''"
                @input="updateQuestionDescription(activeQuestionId, $event.target.value)"
                placeholder="Optionale Beschreibung"
              />
            </div>
            
            <div class="form-group">
              <label>
                <input 
                  type="checkbox" 
                  :checked="form.questions?.find(q => q.id === activeQuestionId)?.isRequired || false"
                  @change="updateQuestionRequired(activeQuestionId, $event.target.checked)"
                />
                Pflichtfeld
              </label>
            </div>
            
            <div class="form-actions">
              <button 
                class="btn btn-sm btn-outline" 
                @click="deleteQuestion(activeQuestionId)"
              >
                <Trash2 size="14" class="icon" />
                Frage löschen
              </button>
            </div>
          </div>
          
          <div v-else class="empty-settings">
            <Settings size="32" class="icon" />
            <p>Wählen Sie eine Frage aus, um die Einstellungen anzuzeigen.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-builder {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f7fafc;
}

.builder-container {
  display: flex;
  flex: 1;
  min-height: 0;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Sidebar styles */
.sidebar {
  width: 280px;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a202c;
}

.sections-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.section-item {
  margin-bottom: 0.5rem;
  border-radius: 6px;
  overflow: hidden;
  background-color: white;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.section-item.is-active {
  border-color: var(--ct-color-primary);
  box-shadow: 0 0 0 1px var(--ct-color-primary);
}

.section-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  user-select: none;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: #718096;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.section-title {
  flex: 1;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.question-count {
  color: #718096;
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.section-actions {
  display: flex;
  opacity: 0;
  transition: opacity 0.2s;
}

.section-item:hover .section-actions {
  opacity: 1;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #718096;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #4a5568;
}

.section-content {
  background-color: white;
}

.questions-list {
  padding: 0.5rem;
}

.question-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.question-item:hover {
  background-color: #f7fafc;
  border-color: #e2e8f0;
}

.question-item.is-active {
  background-color: #ebf8ff;
  border-color: #bee3f8;
}

.question-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #a0aec0;
  cursor: move;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.question-title {
  flex: 1;
  font-size: 0.8125rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.question-type {
  display: inline-block;
  font-size: 0.6875rem;
  background-color: #edf2f7;
  color: #4a5568;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  margin-left: 0.5rem;
  text-transform: capitalize;
}

.question-actions {
  display: flex;
  opacity: 0;
  transition: opacity 0.2s;
}

.question-item:hover .question-actions {
  opacity: 1;
}

.add-question-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem;
  border: 1px dashed #cbd5e0;
  background: none;
  color: #4a5568;
  font-size: 0.8125rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.25rem;
}

.add-question-btn:hover {
  border-color: #a0aec0;
  background-color: #f7fafc;
}

.add-question-btn .icon {
  margin-right: 0.5rem;
  color: #718096;
}

.empty-state {
  padding: 1.5rem;
  text-align: center;
  color: #718096;
}

.empty-state p {
  margin-bottom: 1rem;
}

/* Main content styles */
.main-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: auto;
}

.editor-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
}

.panel-content {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #4a5568;
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: var(--ct-color-primary);
  box-shadow: 0 0 0 1px var(--ct-color-primary);
}

textarea.form-control {
  min-height: 80px;
  resize: vertical;
}

.form-actions {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.empty-editor {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #a0aec0;
  text-align: center;
  padding: 2rem;
}

.empty-content {
  max-width: 400px;
}

.empty-content .icon {
  margin-bottom: 1rem;
  color: #e2e8f0;
}

.empty-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #4a5568;
}

.empty-content p {
  margin: 0 0 1.5rem;
  color: #718096;
  line-height: 1.5;
}

/* Settings sidebar */
.settings-sidebar {
  width: 320px;
  border-left: 1px solid #e2e8f0;
  border-right: none;
}

.settings-sidebar .sidebar-header {
  position: relative;
}

.field-type-indicator {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  font-size: 0.75rem;
  background-color: #edf2f7;
  color: #4a5568;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  text-transform: capitalize;
}

.settings-content {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
}

.field-settings {
  padding: 0.5rem 0;
}

.empty-settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #a0aec0;
  text-align: center;
  padding: 2rem 1rem;
}

.empty-settings .icon {
  margin-bottom: 1rem;
  color: #e2e8f0;
}

.empty-settings p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .sidebar {
    width: 240px;
  }
  
  .settings-sidebar {
    width: 280px;
  }
}

@media (max-width: 992px) {
  .settings-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .settings-sidebar.is-visible {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .builder-container {
    flex-direction: column;
    height: 100%;
  }
  
  .sidebar, 
  .main-content,
  .settings-sidebar {
    width: 100%;
    height: auto;
    position: static;
    transform: none;
    box-shadow: none;
  }
  
  .sections-list {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .settings-sidebar {
    border-top: 1px solid #e2e8f0;
  }
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8125rem;
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

.btn-outline {
  background-color: transparent;
  border-color: #cbd5e0;
  color: #4a5568;
}

.btn-outline:hover {
  background-color: #f7fafc;
  border-color: #a0aec0;
}

.icon {
  flex-shrink: 0;
}

/* Form elements */
input[type="checkbox"] {
  margin-right: 0.5rem;
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
