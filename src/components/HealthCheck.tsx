import { useState, useEffect } from 'react';
import { authApi } from '../utils/api';

const HealthCheck = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Checking connection to backend...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isConnected = await authApi.testConnection();
        if (isConnected) {
          setStatus('success');
          setMessage('Backend connection successful! Health check passed.');
        } else {
          setStatus('error');
          setMessage('Failed to connect to backend. Health check failed.');
        }
      } catch (error) {
        console.error('Health check error:', error);
        setStatus('error');
        setMessage(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    checkHealth();
  }, []);

  return (
    <div 
      style={{ 
        padding: '1rem', 
        margin: '1rem', 
        borderRadius: '8px',
        backgroundColor: status === 'loading' ? '#f5f5f5' : 
                         status === 'success' ? '#e6ffe6' : '#ffe6e6',
        border: `1px solid ${status === 'loading' ? '#ddd' : 
                            status === 'success' ? '#4CAF50' : '#f44336'}`,
        maxWidth: '500px'
      }}
    >
      <h3 style={{ margin: '0 0 0.5rem 0' }}>
        Backend Health Check
      </h3>
      <p style={{ margin: '0.5rem 0' }}>
        {message}
      </p>
      {status === 'loading' && (
        <div style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', 
                      border: '3px solid #f3f3f3', borderTop: '3px solid #3498db', 
                      animation: 'spin 1s linear infinite' }}></div>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default HealthCheck;
