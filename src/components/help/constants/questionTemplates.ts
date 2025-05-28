export const QUESTION_TEMPLATES: Record<string, string> = {
  general: `I have a general question about Poly Micro Manager.

Please provide the following details:
- What specifically would you like to know?
- Have you checked the documentation?
- Any context that might help us provide a better answer?`,

  bug: `I'd like to report a bug.

Please provide the following details:
- What happened?
- What did you expect to happen?
- Steps to reproduce the issue
- Browser/device information
- Screenshots (if applicable)`,

  feature: `I'd like to request a new feature.

Please provide the following details:
- Describe the feature you'd like to see
- What problem would this feature solve?
- How would this feature benefit you and other users?
- Any examples of similar features in other tools?`,

  microservices: `I need help with microservices.

Please provide the following details:
- Which microservice are you working with?
- What are you trying to accomplish?
- What issues are you experiencing?
- Have you made any configuration changes recently?`,

  cicd: `I need help with the CI/CD pipeline.

Please provide the following details:
- Which pipeline are you using?
- What stage of the pipeline is failing?
- Are there any error messages?
- Have you made any recent changes to your configuration?`,

  testing: `I need help with automated testing.

Please provide the following details:
- What type of tests are you running?
- What testing framework are you using?
- What issues are you experiencing?
- Have you made any recent changes to your test configuration?`,

  account: `I need help with my account or settings.

Please provide the following details:
- What specific account feature or setting are you trying to access?
- What actions have you already tried?
- Are you seeing any error messages?
- When did this issue start occurring?`
};
