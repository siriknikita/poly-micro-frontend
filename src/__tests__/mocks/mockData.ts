// Mock data for tests

import { TestItem, TestOutput, TestMessage } from '@/types';

// Mock microservices data
export const mockMicroservices: TestItem[] = [
  {
    id: 'ms1',
    name: 'Authentication Service',
    projectId: 'project1',
    status: 'online',
    version: '1.2.0',
    lastDeployed: '2025-04-01T10:30:00Z',
    type: 'microservice',
  },
  {
    id: 'ms2',
    name: 'User Service',
    projectId: 'project1',
    status: 'online',
    version: '1.1.5',
    lastDeployed: '2025-04-05T14:20:00Z',
    type: 'microservice',
  },
  {
    id: 'ms3',
    name: 'Payment Service',
    projectId: 'project1',
    status: 'offline',
    version: '1.0.8',
    lastDeployed: '2025-03-28T09:15:00Z',
    type: 'microservice',
  },
  {
    id: 'ms4',
    name: 'Notification Service',
    projectId: 'project2',
    status: 'online',
    version: '2.0.1',
    lastDeployed: '2025-04-10T11:45:00Z',
    type: 'microservice',
  },
  {
    id: 'ms5',
    name: 'Analytics Service',
    projectId: 'project2',
    status: 'online',
    version: '1.3.2',
    lastDeployed: '2025-04-08T16:30:00Z',
    type: 'microservice',
  },
];

// Mock test items data
export const mockTestItems: TestItem[] = [
  {
    id: 'func1',
    name: 'authenticateUser',
    type: 'function',
    children: [
      {
        id: 'test1',
        name: 'Should authenticate with valid credentials',
        type: 'test-case',
      },
      {
        id: 'test2',
        name: 'Should reject invalid credentials',
        type: 'test-case',
      },
    ],
  },
  {
    id: 'func2',
    name: 'validateToken',
    type: 'function',
    children: [
      {
        id: 'test3',
        name: 'Should validate a valid token',
        type: 'test-case',
      },
      {
        id: 'test4',
        name: 'Should reject an expired token',
        type: 'test-case',
      },
    ],
  },
  {
    id: 'func3',
    name: 'registerUser',
    type: 'function',
    children: [
      {
        id: 'test5',
        name: 'Should register a new user',
        type: 'test-case',
      },
      {
        id: 'test6',
        name: 'Should reject duplicate email',
        type: 'test-case',
      },
    ],
  },
];

// Mock test output data
export const mockTestOutput: TestOutput = {
  status: 'success',
  time: '0.35s',
  output: `✓ User authentication successful
✓ Token generation verified
✓ Permissions correctly assigned`,
  coverage: 87,
  timestamp: new Date().toISOString(),
};

// Mock test chat messages
export const mockTestMessages: TestMessage[] = [
  {
    id: 'msg1',
    text: 'Can you create a test for the user login flow?',
    isUser: true,
    timestamp: new Date(Date.now() - 30000).toISOString(),
  },
  {
    id: 'msg2',
    text: `I've created a test case for the user login flow. It verifies:
- Valid username and password successfully logs in
- Invalid credentials show appropriate error
- Login button is disabled when fields are empty`,
    isUser: false,
    timestamp: new Date(Date.now() - 15000).toISOString(),
  },
  {
    id: 'msg3',
    text: 'Can you add a test for the "forgot password" flow too?',
    isUser: true,
    timestamp: new Date().toISOString(),
  },
];

// Mock user preferences
export const mockUserPreferences = {
  theme: 'light',
  language: 'en',
  notifications: true,
  defaultProject: 'project1',
};

// Mock API responses
export const mockApiResponses = {
  getProjects: {
    success: true,
    data: [],
  },
  getMicroservices: {
    success: true,
    data: mockMicroservices,
  },
  getTestItems: {
    success: true,
    data: mockTestItems,
  },
  getTestOutput: {
    success: true,
    data: mockTestOutput,
  },
  error: {
    success: false,
    error: 'An error occurred',
    message: 'Failed to fetch data',
  },
};
