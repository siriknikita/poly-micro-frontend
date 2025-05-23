# Help Center Component

The Help Center provides users with a comprehensive FAQ system and the ability to submit questions
when they can't find the information they need.

## Features

- **Searchable FAQ System**: Users can search through categorized FAQs to find answers to common
  questions.
- **Expandable FAQ Items**: FAQs can be expanded and collapsed to show/hide answers.
- **Question Submission Form**: Users can submit their own questions when they can't find the
  information they need.
- **Form Validation**: The question submission form includes validation for all fields.
- **Responsive Design**: The Help Center is fully responsive and works well on all device sizes.

## Components

### HelpPage

The main component that renders the entire Help Center page. It includes the search functionality,
FAQ sections, and the question submission form.

### FAQSection

Renders a section of FAQs with an expandable/collapsible interface. Each FAQ item can be clicked to
show or hide its answer.

### AskQuestionForm

A form component that allows users to submit questions. It includes validation for all fields and
shows a success message after submission.

## Hooks

### useHelp

A custom hook that handles the question submission logic. It manages the submission state and
handles success/error notifications.

## Types

The Help Center uses the following TypeScript interfaces:

- `FAQ`: Represents a frequently asked question with its answer and category.
- `FAQCategory`: Represents a category of FAQs.
- `QuestionSubmission`: Represents a question submitted by a user.
- `QuestionCategory`: Represents a category for question submissions.

## Constants

FAQ data and categories are stored in the `faqData.ts` file. This includes:

- `FAQ_CATEGORIES`: An array of FAQ categories.
- `QUESTION_CATEGORIES`: An array of question submission categories.
- `FAQS`: An array of frequently asked questions with their answers and categories.

## Testing

The Help Center components are thoroughly tested with both unit and integration tests:

- Unit tests for each component and hook
- Integration tests to ensure all components work together correctly

## Usage

The Help Center is accessible via the `/help` route and can be navigated to from the sidebar.
