import { http, HttpResponse } from 'msw';
import { mockTestItems, mockTestOutput } from './mockData';

// Define handlers for MSW to intercept API requests
export const handlers = [
  // GET available microservices
  http.get('/api/microservices', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: 'ms1', name: 'Auth Service', type: 'microservice', children: [] },
        { id: 'ms2', name: 'User Service', type: 'microservice', children: [] },
        { id: 'ms3', name: 'Payment Service', type: 'microservice', children: [] },
      ],
    });
  }),

  // GET microservice by ID
  http.get('/api/microservices/:id', ({ params }) => {
    const { id } = params;

    const microservice = {
      id,
      name: id === 'ms1' ? 'Auth Service' : id === 'ms2' ? 'User Service' : 'Payment Service',
      type: 'microservice',
      children: mockTestItems.filter((item) => item.type === 'function'),
    };

    return HttpResponse.json({ success: true, data: microservice });
  }),

  // GET test items
  http.get('/api/tests', () => {
    return HttpResponse.json({
      success: true,
      data: mockTestItems,
    });
  }),

  // GET test output
  http.get('/api/tests/:id/output', ({ params }) => {
    const { id } = params;

    return HttpResponse.json({
      success: true,
      data: {
        ...mockTestOutput,
        id: String(id),
      },
    });
  }),

  // POST run test
  http.post('/api/tests/:id/run', () => {
    return HttpResponse.json({
      success: true,
      message: 'Test started successfully',
    });
  }),

  // Error fallback handler for any unhandled requests
  http.all('*', ({ request }) => {
    console.error(`Unhandled request: ${request.method} ${request.url}`);
    return HttpResponse.json(
      { success: false, error: 'An error occurred', message: 'Failed to fetch data' },
      { status: 500 },
    );
  }),
];
