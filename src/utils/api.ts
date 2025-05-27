import axios from 'axios';
import { TokenResponse, User } from '@/components/auth/hooks/useAuth';
import { isTauriEnvironment } from './platform';

// Enhanced API URL determination with fallback options
const getApiUrl = (): string => {
  // First check for explicitly set API URL via environment variable
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl) {
    return envApiUrl;
  }

  // For Tauri desktop app - try multiple endpoints
  if (isTauriEnvironment()) {
    // Primary: localhost (if Docker port is properly exposed)
    const url = 'http://backend:8000/api';
    return url;
  }
  
  // For browser environment inside Docker, we use localhost
  const browserUrl = 'http://backend:8000/api';
  return browserUrl;
};

// Initialize API with explicit URL
const API_URL = getApiUrl();

// Create axios instance with base URL and increased timeout
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Log more details about the error
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - backend may not be accessible');
      console.error('Attempted URL:', error.config?.url);
      console.error('Full URL:', `${API_URL}${error.config?.url}`);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      
      // If we're in a browser context
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API endpoints with enhanced error handling
export const authApi = {
  login: (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return api.post<TokenResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  
  register: async (userData: { username: string; email: string; password: string; full_name?: string }) => {
    console.log('Attempting registration with:', { username: userData.username, email: userData.email });
    console.log('API URL being used:', API_URL);
    
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error: any) {
      console.log('Registration failed:', error);
      
      if (error.response) {
        console.log('Error response:', error.response.data);
        console.log('Status:', error.response.status);
      } else if (error.request) {
        console.log('No response received:', error.request);
        console.log('This usually means the backend server is not accessible');
      } else {
        console.log('Error setting up request:', error.message);
      }
      
      throw error;
    }
  },
  
  getCurrentUser: () => {
    return api.get<User>('/auth/me');
  },
  
  updateUser: (userData: any) => {
    return api.put('/auth/me', userData);
  },

  // Utility method to test connection
  testConnection: async () => {
    try {
      console.log('Testing connection to:', API_URL);
      const response = await api.get('/health', { timeout: 5000 });
      console.log('Connection test successful:', response.status);
      return true;
    } catch (error) {
      console.log('First connection attempt failed, trying with /api/health:', error);
      try {
        // Try the correct endpoint path as defined in backend
        const response = await api.get('/api/health', { timeout: 5000 });
        console.log('Connection successful with /api/health:', response.status);
        return true;
      } catch (secondError) {
        console.log('All connection attempts failed:', secondError);
        return false;
      }
    }
  },

  // Utility method to get the current API URL for debugging
  getApiUrl: () => {
    return API_URL;
  },
};

// Rest of the API endpoints remain the same
export const logsApi = {
  getLogs: (projectId?: string, serviceId?: string, filters?: any) => {
    let url = '/logs';
    
    if (projectId) {
      url = `/logs/project/${projectId}`;
      
      if (serviceId) {
        url = `/logs/service/${serviceId}`;
      }
    }
    
    return api.get(url, { params: filters });
  },
};

export const projectsApi = {
  getProjects: () => {
    return api.get('/projects/');
  },
  
  getProject: (projectId: string) => {
    return api.get(`/projects/${projectId}`);
  },
};

export const servicesApi = {
  getServices: (projectId: string) => {
    return api.get(`/services/project/${projectId}`);
  },
  
  getService: (serviceId: string) => {
    return api.get(`/services/${serviceId}`);
  },
};

export const metricsApi = {
  getCpuMetrics: (projectId: string, serviceId?: string) => {
    const url = serviceId 
      ? `/metrics/cpu/service/${serviceId}` 
      : `/metrics/cpu/project/${projectId}`;
    
    return api.get(url);
  },
};

// Test execution and analysis API endpoints
export const testsApi = {
  // Run a test in a Docker container
  runTest: (testData: {
    project_id: string;
    service_id: string;
    test_path: string;
    test_id?: string;
    environment?: Record<string, string>;
    options?: Record<string, any>;
  }) => {
    return api.post('/tests/run', testData);
  },
  
  // Get test run status
  getTestRun: (testRunId: string) => {
    return api.get(`/tests/run/${testRunId}`);
  },
  
  // Get all test runs for a project
  getProjectTestRuns: (projectId: string) => {
    return api.get(`/tests/project/${projectId}`);
  },
  
  // Get all test runs for a service
  getServiceTestRuns: (serviceId: string) => {
    return api.get(`/tests/service/${serviceId}`);
  },
  
  // Analyze a test run with Gemini AI
  analyzeTestRun: (analysisRequest: {
    test_run_id: string;
    include_logs?: boolean;
    analysis_type?: string;
  }) => {
    return api.post('/tests/analyze', analysisRequest);
  },
  
  // Get existing analysis for a test run
  getTestAnalysis: (testRunId: string) => {
    return api.get(`/tests/analyze/${testRunId}`);
  },
};

// Questions API endpoints
export const questionsApi = {
  // Submit a new question
  submitQuestion: (questionData: {
    title: string;
    content: string;
    user_email?: string;
  }) => {
    return api.post('/questions', questionData);
  },
  
  // Get all questions (admin only or user's own questions)
  getQuestions: (all: boolean = false) => {
    return api.get('/questions', { params: { all } });
  },
  
  // Get a specific question by ID
  getQuestion: (questionId: string) => {
    return api.get(`/questions/${questionId}`);
  },

  // Update question status (admin only)
  updateQuestionStatus: (questionId: string, status: string) => {
    return api.patch(`/questions/${questionId}/status`, { status });
  },
};