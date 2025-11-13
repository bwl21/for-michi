# ChurchTools Group Registration Form - Development Prompt

## Project Overview
Create a dynamic, branching form builder for ChurchTools that allows group registration with conditional logic, similar to MS Forms, while maintaining the ChurchTools design system.

## Core Requirements

### 1. Dynamic Form Builder
- **Branching Logic**: Create forms that show/hide questions based on previous answers
- **Section-based Navigation**: Multi-step form progression with conditional section flow
- **Field Types**: Support all ChurchTools group and person field types
- **Question Elements**:
  - Required/optional fields
  - Descriptions/help text
  - Validation rules
  - Conditional display rules

### 2. Group Management
- Multiple forms per group
- Field-level permissions (only allow selection from defined group fields)
- Duplicate submission handling:
  - Option to block duplicate submissions
  - Option to update existing submissions
  - Configurable notifications for existing members
- Conditional group assignments based on form responses

### 3. User Experience
- MS Forms-like interface with ChurchTools styling
- Live preview functionality during form creation
- Progress indicators for multi-step forms
- Responsive design for all device types
- Clear error messages and validation feedback

### 4. Technical Implementation

#### Backend
- **API Endpoints**:
  - Form CRUD operations
  - Form submission handling
  - Response management
  - Group assignment processing
- **Database Schema**:
  - forms (id, title, description, settings)
  - form_sections (id, form_id, title, description, order)
  - form_questions (id, section_id, type, label, description, required, order, settings)
  - form_conditions (id, question_id, condition_type, condition_value, action, target_id)
  - form_submissions (id, form_id, person_id, status, submitted_at)
  - form_answers (id, submission_id, question_id, answer_data)

#### Frontend
- **Form Builder**:
  - Drag-and-drop interface
  - Conditional logic builder
  - Live preview
  - Section management
- **Form Renderer**:
  - Dynamic field rendering
  - Client-side validation
  - Progress tracking
  - Submission handling

### 5. Security
- CSRF protection
- Rate limiting
- Input sanitization
- Permission checks for form access
- Secure handling of sensitive data

### 6. Integration Points
- ChurchTools API for:
  - Group management
  - Person data
  - Field definitions
  - Authentication/authorization

## Development Guidelines

### Code Style
- Follow ChurchTools coding standards
- Use TypeScript for type safety
- Component-based architecture
- Comprehensive test coverage

### Performance
- Optimize for large forms (100+ questions)
- Lazy load form sections
- Efficient database queries
- Client-side caching where appropriate

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast requirements

## Deliverables
1. Working form builder interface
2. Form renderer with conditional logic
3. API endpoints for form management
4. Database migration scripts
5. Unit and integration tests
6. Documentation
7. Deployment guide

## Acceptance Criteria
- Forms can be created with branching logic
- Form responses create/update group memberships
- All ChurchTools field types are supported
- Performance is acceptable with large forms (loads in <2s)
- Mobile-responsive design
- Comprehensive test coverage (>80%)
- Documentation for users and developers

## Technical Constraints
- Must work with ChurchTools API v3
- Must support ChurchTools authentication
- Must maintain backward compatibility
- Must follow ChurchTools design system
