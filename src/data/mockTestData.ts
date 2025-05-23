import { TestItem } from '@/types';

// Create project-specific test data
export const mockTestDataByProject: Record<string, TestItem[]> = {
  // E-commerce Platform (Project ID: 1)
  '1': [
    {
      id: 'ms-1',
      name: 'User Service',
      type: 'microservice',
      children: [
        {
          id: 'fn-1',
          name: 'authenticateUser',
          type: 'function',
          children: [
            {
              id: 'test-1',
              name: 'should authenticate valid credentials',
              type: 'test-case',
            },
            {
              id: 'test-2',
              name: 'should reject invalid password',
              type: 'test-case',
            },
          ],
        },
        {
          id: 'fn-2',
          name: 'updateUserProfile',
          type: 'function',
          children: [
            {
              id: 'test-3',
              name: 'should update user details',
              type: 'test-case',
            },
          ],
        },
      ],
    },
    {
      id: 'ms-2',
      name: 'Payment Service',
      type: 'microservice',
      children: [
        {
          id: 'fn-3',
          name: 'processPayment',
          type: 'function',
          children: [
            {
              id: 'test-4',
              name: 'should process valid payment',
              type: 'test-case',
            },
            {
              id: 'test-5',
              name: 'should handle declined transactions',
              type: 'test-case',
            },
          ],
        },
      ],
    },
    {
      id: 'ms-3',
      name: 'Notification Service',
      type: 'microservice',
      children: [
        {
          id: 'fn-4',
          name: 'sendEmail',
          type: 'function',
          children: [
            {
              id: 'test-6',
              name: 'should send email successfully',
              type: 'test-case',
            },
          ],
        },
        {
          id: 'fn-5',
          name: 'sendPushNotification',
          type: 'function',
          children: [
            {
              id: 'test-7',
              name: 'should send push notification',
              type: 'test-case',
            },
          ],
        },
      ],
    },
  ],

  // Banking System (Project ID: 2)
  '2': [
    {
      id: 'ms-4',
      name: 'Payment Service',
      type: 'microservice',
      children: [
        {
          id: 'fn-6',
          name: 'processPayment',
          type: 'function',
          children: [
            {
              id: 'test-8',
              name: 'should process valid payment',
              type: 'test-case',
            },
          ],
        },
        {
          id: 'fn-7',
          name: 'transferFunds',
          type: 'function',
          children: [
            {
              id: 'test-9',
              name: 'should transfer funds between accounts',
              type: 'test-case',
            },
            {
              id: 'test-10',
              name: 'should prevent overdrafts',
              type: 'test-case',
            },
          ],
        },
      ],
    },
    {
      id: 'ms-5',
      name: 'Loan Service',
      type: 'microservice',
      children: [
        {
          id: 'fn-8',
          name: 'applyForLoan',
          type: 'function',
          children: [
            {
              id: 'test-11',
              name: 'should apply for a loan',
              type: 'test-case',
            },
          ],
        },
      ],
    },
  ],

  // Healthcare Portal (Project ID: 3)
  '3': [
    {
      id: 'ms-6',
      name: 'Health Monitoring Service',
      type: 'microservice',
      children: [
        {
          id: 'fn-8',
          name: 'monitorHealth',
          type: 'function',
          children: [
            {
              id: 'test-11',
              name: 'should monitor health',
              type: 'test-case',
            },
          ],
        },
      ],
    },
  ],

  // Education Platform (Project ID: 4)
  '4': [
    {
      id: 'ms-7',
      name: 'Course Management Service',
      type: 'microservice',
      children: [
        {
          id: 'fn-9',
          name: 'enrollStudent',
          type: 'function',
          children: [
            {
              id: 'test-12',
              name: 'should enroll a student in a course',
              type: 'test-case',
            },
          ],
        },
        {
          id: 'fn-10',
          name: 'dropStudent',
          type: 'function',
          children: [
            {
              id: 'test-13',
              name: 'should drop a student from a course',
              type: 'test-case',
            },
          ],
        },
      ],
    },
  ],
};

// For backward compatibility
export const mockTestData = mockTestDataByProject['1'];
