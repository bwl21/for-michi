export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'number' 
  | 'email' 
  | 'tel' 
  | 'url' 
  | 'date' 
  | 'time' 
  | 'datetime-local' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'multiselect'

export type ConditionType = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'greaterThan' 
  | 'lessThan' 
  | 'startsWith' 
  | 'endsWith'

export type ActionType = 
  | 'show' 
  | 'hide' 
  | 'enable' 
  | 'disable' 
  | 'require' 
  | 'skip'

export interface Form {
  id: string
  title: string
  description?: string
  settings: {
    isActive: boolean
    requiresLogin: boolean
    submitButtonText?: string
    successMessage?: string
    allowMultipleSubmissions: boolean
    submitterCanViewResponses: boolean
    redirectUrl?: string
  }
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface FormSection {
  id: string
  formId: string
  title: string
  description?: string
  order: number
  settings: {
    isVisible: boolean
    conditionalLogic?: {
      conditions: FormCondition[]
    }
  }
}

export interface FormQuestion {
  id: string
  sectionId: string
  type: FieldType
  label: string
  description?: string
  isRequired: boolean
  order: number
  settings: {
    placeholder?: string
    defaultValue?: any
    options?: Array<{
      label: string
      value: any
      isOther?: boolean
    }>
    validation?: {
      min?: number
      max?: number
      minLength?: number
      maxLength?: number
      pattern?: string
      errorMessage?: string
    }
    conditionalLogic?: {
      conditions: FormCondition[]
    }
  }
  fieldMapping?: string
  fieldType?: string
}

export interface FormCondition {
  id: string
  questionId: string
  conditionType: ConditionType
  conditionValue: any
  action: ActionType
  targetId: string
  targetType: 'question' | 'section'
}

export interface FormSubmission {
  id: string
  formId: string
  personId?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  submittedAt: string
  metadata: {
    ipAddress?: string
    userAgent?: string
    referrer?: string
    deviceType?: 'mobile' | 'tablet' | 'desktop'
  }
}

export interface FormAnswer {
  id: string
  submissionId: string
  questionId: string
  answer: any
  createdAt: string
}

export interface FormWithRelations extends Form {
  sections: FormSection[]
  questions: FormQuestion[]
  conditions: FormCondition[]
}

export interface FormSubmissionWithRelations extends FormSubmission {
  answers: FormAnswer[]
  form?: Form
}
