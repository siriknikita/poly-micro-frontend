import { renderHook, act } from '@testing-library/react';
import { useProjectManagement } from '@/components/monitoring/hooks/useProjectManagement';
import { mockProjects } from '@data/mockData';
import { ProjectContext } from '@/context/ProjectContext';
import { ReactNode } from 'react';
import { ProjectContextType } from '@/context/projectTypes';

// Mock data
jest.mock('@data/mockData', () => ({
  mockProjects: [
    { id: '1', name: 'E-commerce Platform', path: '/path/to/ecommerce' },
    { id: '2', name: 'Banking System', path: '/path/to/banking' },
  ],
}));

// Create test data matching the actual structure
const mockMicroservices1 = [
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
];

const mockMicroservices2 = [
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
];

jest.mock('@data/mockTestData', () => ({
  mockTestDataByProject: {
    '1': mockMicroservices1,
    '2': mockMicroservices2,
  },
}));

// No need to mock useProject since we'll provide the actual context

describe('useProjectManagement', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
    };
  })();

  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  const mockSetProject = jest.fn();

  // Create a wrapper with ProjectContext
  const wrapper = ({ children }: { children: ReactNode }) => {
    const contextValue: ProjectContextType = {
      project: null,
      setProject: mockSetProject,
    };

    return (
      <ProjectContext.Provider value={contextValue}>
        {children}
      </ProjectContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    mockSetProject.mockClear();
  });

  it('should not set a project if none is saved in localStorage', () => {
    const { result } = renderHook(() => useProjectManagement('dashboard'), {
      wrapper,
    });

    expect(result.current.selectedProject).toBeNull();
  });

  it('should update project context with microservices when on testing tab', () => {
    const { result } = renderHook(() => useProjectManagement('testing'), {
      wrapper,
    });

    act(() => {
      result.current.handleSelectProject(mockProjects[0]);
    });

    expect(mockSetProject).toHaveBeenCalledWith({
      ...mockProjects[0],
      microservices: mockMicroservices1,
    });
  });

  it('should update project context without microservices when not on testing tab', () => {
    const { result } = renderHook(() => useProjectManagement('dashboard'), {
      wrapper,
    });

    act(() => {
      result.current.handleSelectProject(mockProjects[0]);
    });

    expect(mockSetProject).toHaveBeenCalledWith({
      ...mockProjects[0],
      microservices: undefined,
    });
  });

  it('should save selected project to localStorage', () => {
    const { result } = renderHook(() => useProjectManagement('dashboard'), {
      wrapper,
    });

    act(() => {
      result.current.handleSelectProject(mockProjects[1]);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'lastSelectedProject',
      '2',
    );
    expect(result.current.selectedProject).toEqual(mockProjects[1]);
  });
});
