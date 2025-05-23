# 🚀 Poly Micro Manager - Frontend Demo

<div align="center">

![Version](https://img.shields.io/badge/version-1.9.5-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?logo=tailwind-css)
![Tests](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest)

</div>

## 📋 Overview

Poly Micro Manager is a comprehensive web application designed to simplify the management of
microservices architecture. This frontend demo showcases the user interface and core functionality
of the platform, providing tools for authentication, testing, monitoring, and CI/CD pipeline
management of microservices.

## ✨ Key Features

- **🔐 Authentication System**

  - Secure user login and registration
  - JWT-based authentication
  - Role-based access control

- **🧪 Automated Testing**

  - AI-assisted test generation and execution
  - Real-time test results visualization
  - Comprehensive test coverage reporting
  - Resizable test panels for better workflow

- **📊 Monitoring Dashboard**

  - Real-time health metrics for microservices
  - Performance analytics and visualization
  - Customizable monitoring parameters
  - Alert configuration and notification system

- **🔄 CI/CD Pipeline Management**
  - Integrated pipeline visualization
  - Deployment status tracking
  - Build and release management
  - Version control integration

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router Dom
- **State Management**: React Context API
- **Database**: Dexie (IndexedDB wrapper)
- **Testing**: Vitest, React Testing Library
- **Charts & Visualization**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Toastify

## 🏛️ Development Philosophy

### SOLID Principles in React

- **Single Responsibility Principle**: Each component has one purpose only. For example, our
  `TestItemComponent` focuses solely on rendering test items, while logic is extracted to custom
  hooks.

- **Open/Closed Principle**: Components are designed to be extended without modification through
  props and composition. This allows for flexibility without changing the core implementation.

- **Liskov Substitution Principle**: Specialized components can replace base components without
  breaking functionality. Our button components (like `IconButton`) follow this principle.

- **Interface Segregation Principle**: Props are kept focused and minimal, avoiding large monolithic
  prop objects. Components receive only what they need to function.

- **Dependency Inversion Principle**: Components depend on abstractions rather than concrete
  implementations. This is achieved through custom hooks like `useResizablePanel`, `useTestItems`,
  and `useMicroserviceNavigation`.

### Code Organization

- **Component Structure**: Components are kept small (under 150 lines) and JSX is limited to 3
  levels of nesting for readability.

- **Separation of Concerns**: Logic is extracted into custom hooks, keeping UI components focused on
  presentation.

- **Constants and Utilities**: Magic numbers, strings, and repeated values are extracted into
  constants and utility functions in dedicated directories.

- **Feature-based Organization**: Code is organized by feature rather than by type, promoting
  cohesion and discoverability.

### Clean Code Practices

- **Meaningful Naming**: Clear, descriptive names for components, functions, and variables.

- **Memoization**: Strategic use of `React.memo`, `useCallback`, and `useMemo` to optimize
  performance.

- **TypeScript**: Strict typing throughout the codebase to catch errors early and improve developer
  experience.

- **Testing**: Comprehensive test coverage with unit, component, and integration tests.

- **Consistent Styling**: CSS Modules and TailwindCSS for scoped, maintainable styling.

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/siriknikita/poly-micro-frontend-demo.git
cd poly-micro-frontend-demo

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:errors` - Run ESLint (errors only)
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode with UI
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:coverage` - Generate test coverage report

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- [📘 Main Documentation](./docs/README.md) - Overview and getting started
- [👤 User Guide](./docs/user-guide.md) - Detailed usage instructions
- [🧩 Component Documentation](./docs/components/) - UI component specifications
- [⚙️ Implementation Details](./docs/implementation/) - Technical implementation notes
- [🏛️ Architecture Patterns](./docs/architecture/patterns.md) - Design patterns used
- [💻 For Developers](./docs/for-developers/README.md) - Development guidelines

**Online Documentation**: Access the full documentation at
[https://siriknikita.github.io/poly-micro-frontend-demo/#/](https://siriknikita.github.io/poly-micro-frontend-demo/#/)

## 🧪 Testing

The project includes a comprehensive test suite with:

- Unit tests for hooks and utility functions
- Component tests using React Testing Library
- Integration tests for feature workflows

Test coverage reports can be generated with `npm run test:coverage`.

## 🐳 Docker Support

The application can be run in a Docker container:

```bash
# Build and run with Docker Compose
docker-compose up -d

# For SonarQube analysis
docker-compose -f docker-compose.sonarqube.yml up -d
```

## 🚢 CI/CD

The project uses GitHub Actions for continuous integration with automated:

- Linting (errors only)
- Test execution
- Build verification

Pull requests to the `main` branch trigger the validation workflow automatically.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Nikita Sirik - [GitHub Profile](https://github.com/siriknikita)

---

<div align="center">

**Poly Micro Manager** - Simplifying Microservices Management

</div>
