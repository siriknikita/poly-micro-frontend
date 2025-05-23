# Running Tests

Before running the tests, you need to make sure all dependencies are installed. Run the following
command:

```bash
npm install
```

## Running Unit and Integration Tests

To run all unit and integration tests:

```bash
npm test
```

To run tests in watch mode (recommended during development):

```bash
npm run test:watch
```

To run tests with the UI:

```bash
npm run test:ui
```

To generate coverage reports:

```bash
npm run test:coverage
```

## Setting Up the Development Environment

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open a new terminal and run the tests:
   ```bash
   npm test
   ```

## Troubleshooting

If you encounter any issues, try the following:

1. Make sure all dependencies are installed:

   ```bash
   npm install
   ```

2. Ensure TypeScript types are properly resolved:

   ```bash
   npm install @types/node
   ```

3. If you're having issues with Playwright:

   ```bash
   npx playwright install
   ```

4. Clear test cache:

   ```bash
   npx vitest --clearCache
   ```

5. If you see TypeScript errors related to paths or imports, check that the path aliases in
   `tsconfig.app.json` and `vitest.config.ts` match.
