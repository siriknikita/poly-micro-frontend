# Poly Micro Manager - Frontend Documentation

This documentation provides detailed information about the features, components,
and architecture of the Poly Micro Manager frontend application.

## Overview

The Poly Micro Manager is a comprehensive tool designed to manage microservices
architecture. It provides features for:

- **Authentication**: User login and registration
- **Testing**: Automated testing of microservices
- **Monitoring**: Real-time monitoring of microservice health and performance
- **Pipelining**: CI/CD pipeline management for microservices
- **Shared Components**: Reusable UI components used across the application

## Project Structure

The application follows a modular architecture with components organized by
feature and functionality:

```
src/
├── App.tsx                # Main application component
├── __tests__/             # Test files for components and hooks
├── components/            # UI components organized by feature
│   ├── auth/              # Authentication components
│   ├── index.ts           # Main export file for components
│   ├── layout/            # Layout components
│   ├── monitoring/        # Monitoring and observability components
│   │   ├── LogViewer/     # Log viewing components
│   │   ├── hooks/         # Monitoring-specific hooks
│   │   └── shared/        # Shared monitoring components
│   ├── pipelining/        # CI/CD pipeline management components
│   │   ├── blocks/        # Pipeline block components
│   │   ├── components/    # Pipelining-specific components
│   │   └── hooks/         # Pipelining-specific hooks
│   ├── shared/            # Shared UI components
│   └── testing/           # Automated testing components
│       ├── components/    # Testing-specific UI components
│       ├── constants.ts   # Testing constants
│       └── hooks/         # Testing-specific hooks
├── config/                # Application configuration
├── context/               # React context providers
│   ├── ProjectContext.tsx # Project context provider
│   └── ToastContext.tsx   # Toast notification context
├── data/                  # Data models and mock data
├── db/                    # Database interactions
├── helpers/               # Helper functions
├── hooks/                 # Application-wide custom hooks
├── index.css              # Global CSS
├── main.tsx               # Application entry point
├── types/                 # TypeScript type definitions
└── vite-env.d.ts          # Vite environment types
```

## For Developers

We provide specialized documentation for developers working on the Poly Micro
Manager project:

- [Running Tests](./for-developers/RUN_TESTS.md) - Instructions for running unit
  and integration tests
- [Release Management](./for-developers/README-RELEASE-MANAGEMENT.md) -
  Documentation for the automatic release management system
- [SonarQube Setup](./for-developers/SONARQUBE.md) - Guide for setting up
  SonarQube and SonarScanner for code quality analysis
- [Testing Strategy](./for-developers/TESTING.md) - Comprehensive overview of
  the testing strategy and approach

For more detailed information, visit the
[For Developers](./for-developers/README.md) section.

## Feature Documentation

Detailed documentation for each feature can be found in the following sections:

- [Authentication](./components/auth.md)
- [Monitoring](./components/monitoring.md)
- [Pipelining](./components/pipelining.md)
- [Shared Components](./components/shared.md)
- [Testing](./components/testing.md)
- [Core Components](./components/core.md)
- [Component Import Guide](./components/import-guide.md)

## User Guide

A comprehensive user guide is available to help you understand and use the
application effectively:

- [User Guide](./user-guide.md) - Detailed instructions for using all features
  of the application

## Implementation Details

For developers, we provide detailed implementation documentation:

- [Service Filters Implementation](./implementation/service-filters-implementation.md) -
  Technical details of the service filtering system
- [Architecture Patterns](./architecture/patterns.md) - Detailed documentation
  of design patterns and architectural approaches used in the project

## Getting Started

To understand how these components work together, start with the
[User Guide](./user-guide.md) for a high-level overview, then explore the
[Core Components](./components/core.md) documentation, which explains the main
application structure and navigation flow.

## Online Documentation

This documentation is also available online through GitHub Pages. For more
information on accessing and using the online documentation, see
[GitHub Pages Documentation](./github-pages.md).
