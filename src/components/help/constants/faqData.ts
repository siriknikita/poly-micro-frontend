import { FAQ, FAQCategory, QuestionCategory } from '../types';

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: 'general',
    name: 'General Questions',
  },
  {
    id: 'microservices',
    name: 'Microservices',
  },
  {
    id: 'cicd',
    name: 'CI/CD Pipeline',
  },
  {
    id: 'testing',
    name: 'Automated Testing',
  },
];

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  {
    id: 'general',
    name: 'General Question',
  },
  {
    id: 'bug',
    name: 'Bug Report',
  },
  {
    id: 'feature',
    name: 'Feature Request',
  },
  {
    id: 'microservices',
    name: 'Microservices Help',
  },
  {
    id: 'cicd',
    name: 'CI/CD Pipeline Help',
  },
  {
    id: 'testing',
    name: 'Automated Testing Help',
  },
];

export const FAQS: FAQ[] = [
  {
    id: 'general-1',
    category: 'general',
    question: 'What is Poly Micro Manager?',
    answer:
      'Poly Micro Manager is a comprehensive platform designed to help you manage, monitor, and orchestrate microservices-based applications. It provides tools for monitoring service health, managing CI/CD pipelines, and running automated tests across your microservices architecture.',
  },
  {
    id: 'general-2',
    category: 'general',
    question: 'How do I get started with Poly Micro Manager?',
    answer:
      'After signing up and logging in, you\'ll be guided through an onboarding process that helps you set up your first project. You can then add your microservices, configure monitoring, set up CI/CD pipelines, and create automated tests. Check out the "Show Guide" option in the user menu for a step-by-step tutorial.',
  },
  {
    id: 'general-3',
    category: 'general',
    question: 'Is Poly Micro Manager suitable for small projects?',
    answer:
      'Yes! Poly Micro Manager is designed to scale with your needs. It works well for small projects with just a few microservices and scales efficiently as your architecture grows. The intuitive interface makes it easy to manage projects of any size.',
  },
  {
    id: 'microservices-1',
    category: 'microservices',
    question: 'How do I add a new microservice to my project?',
    answer:
      'Navigate to the Microservices tab, click the "Add Service" button, and fill in the required information such as service name, port, and endpoint. You can also configure health checks and monitoring settings during this process.',
  },
  {
    id: 'microservices-2',
    category: 'microservices',
    question: 'What metrics are available for monitoring my microservices?',
    answer:
      'Poly Micro Manager provides various metrics including CPU usage, memory consumption, request latency, error rates, and throughput. You can view these metrics in real-time on the dashboard and set up alerts for when they exceed specified thresholds.',
  },
  {
    id: 'microservices-3',
    category: 'microservices',
    question: 'Can I set up custom health checks for my services?',
    answer:
      'Yes, you can configure custom health checks for each microservice. Navigate to the service settings, go to the "Health Checks" tab, and define your custom endpoints, expected responses, and check intervals.',
  },
  {
    id: 'cicd-1',
    category: 'cicd',
    question: 'How does the CI/CD pipeline integration work?',
    answer:
      'Poly Micro Manager integrates with popular CI/CD tools like Jenkins, GitHub Actions, and GitLab CI. You can configure your pipelines to trigger builds, run tests, and deploy services automatically. The platform provides visibility into pipeline status and history.',
  },
  {
    id: 'cicd-2',
    category: 'cicd',
    question: 'Can I automate deployments across multiple environments?',
    answer:
      'Yes, you can set up deployment pipelines for different environments (development, staging, production). Each environment can have its own configuration, approval processes, and deployment strategies like blue-green or canary deployments.',
  },
  {
    id: 'cicd-3',
    category: 'cicd',
    question: 'How do I set up automatic rollbacks if a deployment fails?',
    answer:
      'In the CI/CD Pipeline settings, enable the "Automatic Rollback" option and configure the failure criteria. When a deployment meets these criteria, the system will automatically roll back to the previous stable version.',
  },
  {
    id: 'testing-1',
    category: 'testing',
    question:
      'What types of tests can I run with the Automated Testing feature?',
    answer:
      'You can run various types of tests including unit tests, integration tests, API tests, end-to-end tests, and performance tests. The platform supports popular testing frameworks and provides a unified interface to manage and monitor all your tests.',
  },
  {
    id: 'testing-2',
    category: 'testing',
    question: 'How do I create a new test suite?',
    answer:
      'Navigate to the Automated Testing tab, click "Create Test Suite", and follow the wizard to set up your test configuration. You can specify the test type, target services, test scripts, and execution schedule.',
  },
  {
    id: 'testing-3',
    category: 'testing',
    question: 'Can I schedule tests to run automatically?',
    answer:
      'Yes, you can schedule tests to run at specific intervals or trigger them based on events like code commits or deployments. Go to the test suite settings and configure the schedule under the "Automation" tab.',
  },
  {
    id: 'account-1',
    category: 'account',
    question: 'How do I change my account password?',
    answer:
      'Click on your profile in the bottom left corner, select "Settings" from the menu, and navigate to the "Security" tab. From there, you can change your password by entering your current password and your new password.',
  },
  {
    id: 'account-2',
    category: 'account',
    question: 'Can I invite team members to my project?',
    answer:
      'Yes, you can invite team members by going to your project settings and selecting the "Team" tab. Enter the email addresses of the people you want to invite and assign them appropriate roles and permissions.',
  },
  {
    id: 'account-3',
    category: 'account',
    question: 'How do I delete my account?',
    answer:
      'To delete your account, go to Settings > Account > Delete Account. Please note that this action is irreversible and will delete all your projects and data. We recommend exporting any important data before proceeding.',
  },
];
