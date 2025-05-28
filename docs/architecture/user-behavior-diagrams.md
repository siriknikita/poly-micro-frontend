# User Behavior Diagrams

This document contains UML diagrams illustrating the expected user behavior and
flow through the Poly Micro Manager application.

## Monitoring Dashboard Flow

The monitoring dashboard is a crucial component allowing users to observe and
manage microservices in real-time.

### Metric Exploration Flow

```mermaid
sequenceDiagram
    title Metrics Exploration Flow

    actor User
    participant ServiceDetails
    participant Metrics

    User->>ServiceDetails: Click on metrics tab
    ServiceDetails->>Metrics: Request service metrics
    Metrics-->>User: Display performance graphs
    User->>Metrics: Adjust time range
    Metrics-->>User: Update metrics visualization
```

### Service Selection Flow

```mermaid
sequenceDiagram
    title Service Selection Flow

    actor User
    participant MicroserviceList
    participant ServiceDetails

    User->>MicroserviceList: Select microservice
    MicroserviceList->>ServiceDetails: Request service details
    ServiceDetails-->>User: Display service overview
```

### Alert Management Flow

```mermaid
sequenceDiagram
    title Alert Management Flow

    actor User
    participant ServiceDetails
    participant Alerts

    User->>ServiceDetails: Click on alerts tab
    ServiceDetails->>Alerts: Request active alerts
    Alerts-->>User: Display alerts list
    User->>Alerts: Acknowledge alert
    Alerts-->>User: Update alert status
```

### Dashboard Customization Flow

```mermaid
sequenceDiagram
    title Dashboard Customization

    actor User
    participant Dashboard

    User->>Dashboard: Customize view
    Dashboard-->>User: Save preference
    User->>Dashboard: Export dashboard data
    Dashboard-->>User: Download report
```

## User Authentication Flow

### Login Flow

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated

    state Unauthenticated {
        [*] --> LoginPage
        LoginPage --> AttemptLogin: Submit credentials
        AttemptLogin --> LoginFailed: Invalid credentials
        AttemptLogin --> LoginSuccessful: Valid credentials
        LoginFailed --> LoginPage: Try again
        LoginPage --> RegistrationPage: Register link
        RegistrationPage --> AttemptRegistration: Submit registration
        AttemptRegistration --> RegistrationFailed: Invalid information
        AttemptRegistration --> RegistrationSuccessful: Valid information
        RegistrationFailed --> RegistrationPage: Try again
        RegistrationSuccessful --> LoginPage: Redirect to login
    }
```

### Registration Flow

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated

    state Unauthenticated {
        [*] --> RegistrationPage
        RegistrationPage --> AttemptRegistration: Submit registration
        AttemptRegistration --> RegistrationFailed: Invalid information
        AttemptRegistration --> RegistrationSuccessful: Valid information
        RegistrationFailed --> RegistrationPage: Try again
        RegistrationSuccessful --> LoginPage: Redirect to login
    }
```

### Logout Flow

```mermaid
stateDiagram-v2
    [*] --> Authenticated
    Authenticated --> Logout: Logout button
    Logout --> Unauthenticated
```

## Microservice Testing Workflow

```mermaid
flowchart TD
    A[Start] --> B{Is test suite available?}
    B -->|Yes| C[Select test suite]
    B -->|No| D[Create new test suite]
    D --> E[Configure test parameters]
    C --> E
    E --> F[Run tests]
    F --> G{Tests passed?}
    G -->|Yes| H[Generate report]
    G -->|No| I[Debug failed tests]
    I --> J[Make code adjustments]
    J --> F
    H --> K[Export results]
    K --> L[End]
```

More diagrams will be added to document additional user flows as the application
evolves.
