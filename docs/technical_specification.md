# ChurchTools Group Registration Form - Technical Specification

## System Architecture

### 1. Frontend Architecture
- **Framework**: Vue 3 with Composition API and TypeScript
- **State Management**: Pinia for global state management
- **Form Handling**: Vee-Validate with Yup validation
- **UI Library**: ChurchTools Design System components (Vue 3 compatible)
- **Routing**: Vue Router 4
- **Build Tool**: Vite
- **HTTP Client**: Axios for API requests
- **Internationalization**: Vue I18n for multi-language support

### 2. Backend Architecture
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Data Storage**: Key-Value Store (using ChurchTools API's key-value endpoints)
- **Authentication**: JWT + ChurchTools OAuth
- **API**: RESTful with OpenAPI 3.0 specification
- **Caching**: In-memory caching for frequently accessed data
- **Rate Limiting**: Implemented to prevent abuse

## Data Structure (Key-Value Store)

### Data Organization
All data will be stored using ChurchTools' key-value store with the following structure:

#### Forms
```typescript
interface Form {
  id: string; // UUID
  title: string;
  description?: string;
  settings: {
    isActive: boolean;
    requiresLogin: boolean;
    submitButtonText?: string;
    successMessage?: string;
    // Additional form settings
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy: string; // User ID
}
```

#### Form Sections
```typescript
interface FormSection {
  id: string; // UUID
  formId: string; // Reference to form
  title: string;
  description?: string;
  order: number;
  settings: {
    isVisible: boolean;
    // Additional section settings
  };
}
```

#### Form Questions
```typescript
interface FormQuestion {
  id: string; // UUID
  sectionId: string; // Reference to section
  type: 'text' | 'select' | 'checkbox' | 'radio' | 'date' | 'number' | 'email' | 'tel' | 'url' | 'textarea';
  label: string;
  description?: string;
  isRequired: boolean;
  order: number;
  settings: {
    placeholder?: string;
    defaultValue?: any;
    options?: Array<{ label: string; value: any }>;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      // Additional validation rules
    };
    // Additional field settings
  };
  fieldMapping?: string; // For mapping to ChurchTools fields
  fieldType?: string; // Type of the field in ChurchTools
}
```

#### Form Conditions
```typescript
interface FormCondition {
  id: string; // UUID
  questionId: string; // Reference to question
  conditionType: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  conditionValue: any;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'skip';
  targetId: string; // ID of the target question or section
  targetType: 'question' | 'section';
}
```

#### Form Submissions
```typesxture
interface FormSubmission {
  id: string; // UUID
  formId: string; // Reference to form
  personId?: string; // ChurchTools person ID (if logged in)
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt: string; // ISO date string
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    // Additional metadata
  };
}
```

#### Form Answers
```typescript
interface FormAnswer {
  id: string; // UUID
  submissionId: string; // Reference to submission
  questionId: string; // Reference to question
  answer: any; // The actual answer value
  createdAt: string; // ISO date string
}
```

### Key Naming Convention
All keys in the key-value store will follow this pattern:
- Forms: `forms:{formId}`
- Form Sections: `forms:{formId}:sections:{sectionId}`
- Form Questions: `forms:{formId}:questions:{questionId}`
- Form Conditions: `forms:{formId}:conditions:{conditionId}`
- Form Submissions: `forms:{formId}:submissions:{submissionId}`
- Form Answers: `forms:{formId}:submissions:{submissionId}:answers:{answerId}`

### Indexes
To enable efficient querying, we'll maintain the following indexes:
- List of all forms: `index:forms`
- Form sections by form: `index:forms:{formId}:sections`
- Form questions by section: `index:forms:{formId}:sections:{sectionId}:questions`
- Form submissions by form: `index:forms:{formId}:submissions`
- Form answers by submission: `index:forms:{formId}:submissions:{submissionId}:answers`

## API Endpoints

### Forms Management
- `GET /api/forms` - List all forms
- `POST /api/forms` - Create new form
- `GET /api/forms/:id` - Get form details
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `POST /api/forms/:id/duplicate` - Duplicate form
- `GET /api/forms/:id/preview` - Get form preview data

### Form Submissions
- `GET /api/forms/:id/submissions` - List form submissions
- `POST /api/forms/:id/submit` - Submit form response
- `GET /api/submissions/:id` - Get submission details
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission

### Groups Integration
- `GET /api/groups/:id/fields` - List available group fields
- `GET /api/groups/:id/forms` - List forms for group
- `POST /api/groups/:id/forms` - Create form for group

## Frontend Components

### Form Builder Components
- `FormEditor.vue` - Main form builder container using Vue 3 Composition API
- `QuestionPanel.vue` - Question editing interface with draggable support
- `ConditionBuilder.vue` - Conditional logic builder with visual flow
- `FormPreview.vue` - Live form preview with responsive design
- `SectionManager.vue` - Form section management with drag-and-drop
- `FieldSettings.vue` - Field configuration panel with validation rules
- `components/fields/` - Directory for all form field components
  - `BaseField.vue` - Base field component with common functionality
  - `TextField.vue`, `SelectField.vue`, `CheckboxField.vue`, etc.

### Form Renderer Components
- `FormRenderer.vue` - Main form rendering component with validation
- `FieldRenderer.vue` - Dynamic field rendering with conditional logic
- `FormNavigation.vue` - Multi-step navigation with progress tracking
- `SubmissionSuccess.vue` - Success message after submission
- `FormError.vue` - Error handling and display component
- `components/inputs/` - Directory for all input components
  - `BaseInput.vue` - Base input component
  - `TextInput.vue`, `SelectInput.vue`, `CheckboxInput.vue`, etc.

### State Management (Pinia Stores)
- `useFormStore.ts` - Manages form builder state
- `useSubmissionStore.ts` - Handles form submissions
- `useAuthStore.ts` - Manages authentication state
- `useUiStore.ts` - Handles UI state and notifications

### Composables
- `useFormValidation.ts` - Form validation logic
- `useFormNavigation.ts` - Navigation logic for multi-step forms
- `useConditionalLogic.ts` - Handles conditional field display
- `useApi.ts` - API request handling with Axios

## Security Considerations

### Authentication
- JWT-based authentication with ChurchTools OAuth
- Role-based access control
- Session management

### Data Protection
- Input validation and sanitization
- CSRF protection
- Rate limiting
- Data encryption at rest
- Secure API communication (HTTPS)

## Performance Optimization

### Frontend
- Code splitting
- Lazy loading of form sections
- Virtualized lists for long forms
- Client-side caching with React Query

### Backend
- Database indexing
- Query optimization
- Response caching
- Background job processing for heavy operations

## Testing Strategy

### Unit Testing
- Component tests with Jest and React Testing Library
- Utility function tests
- Redux reducer/action tests

### Integration Testing
- Form submission flow
- Conditional logic
- API integration

### E2E Testing
- Complete user flows with Cypress
- Cross-browser testing
- Performance testing

## Deployment

### Requirements
- Node.js 18+ environment
- PostgreSQL 13+
- Redis (for caching and rate limiting)
- ChurchTools API access

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-jwt-secret
CHURCHTOOLS_URL=https://your-instance.church.tools
CHURCHTOOLS_CLIENT_ID=your-client-id
CHURCHTOOLS_CLIENT_SECRET=your-client-secret
REDIS_URL=redis://localhost:6379
```

## Monitoring and Logging
- Application performance monitoring
- Error tracking
- Usage analytics
- Audit logging

## Future Enhancements
1. Form templates
2. Offline form support
3. File uploads
4. Payment integration
5. Advanced analytics
6. Webhook support
7. Form versioning
8. Bulk operations
9. Custom validation rules
10. Multi-language support
