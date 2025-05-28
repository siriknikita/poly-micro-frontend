# SonarQube & SonarScanner Integration

This documentation provides detailed information about the SonarQube and
SonarScanner integration in the Poly Micro Manager frontend application.

## Recent Update

Unfortunately, the SonarQube and SonarScanner integration has been removed from
the project. This was done because currently it does not support TypeScript v5
integration (since year 2023). No further updates will be made to this
documentation.

## Overview

[SonarQube](https://www.sonarqube.org/) is an open-source platform for
continuous inspection of code quality to perform automatic reviews with static
analysis of code to detect bugs, code smells, and security vulnerabilities. Our
setup runs SonarQube and SonarScanner in Docker containers, making it easy to
analyze code quality without installing additional software on your local
machine.

## Features

- **Code Quality Analysis**: Identifies bugs, vulnerabilities, and code smells
- **Security Vulnerability Detection**: Identifies security issues in your code
- **Code Coverage Tracking**: Tracks test coverage for your codebase
- **Technical Debt Management**: Helps identify and manage technical debt
- **CI/CD Integration**: Seamlessly integrates with your CI/CD pipeline

## Architecture

The setup consists of two main components:

1. **SonarQube Server**: Runs the SonarQube application that stores analysis
   results and provides a web interface to view them.
2. **SonarScanner**: Analyzes the codebase and sends the results to the
   SonarQube server.

Both components run in separate Docker containers, defined in the
`docker-compose.sonarqube.yml` file.

## Prerequisites

- Docker and Docker Compose (for local containerized setup)
- Node.js (v16+)
- npm or yarn
- SonarQube server (can be self-hosted or SonarCloud)

## Files Structure

- `docker-compose.sonarqube.yml` - Docker Compose configuration for SonarQube
  and SonarScanner
- `Dockerfile.sonarscanner` - Dockerfile for building the SonarScanner image
- `sonar-project.properties` - SonarQube project configuration
- `scripts/wait-for-sonarqube.sh` - Script to wait for SonarQube to be ready
  before running analysis
- `scripts/run-sonarqube.sh` - Convenience script to run the entire analysis
  process

## Setup Instructions

### Option A: Using Docker (Recommended for local development)

To analyze your code with SonarQube using our Docker setup:

```bash
./scripts/run-sonarqube.sh
```

This script will:

1. Clean up any previous SonarQube containers
2. Generate test coverage reports
3. Start the SonarQube server
4. Wait for SonarQube to be fully up and running
5. Run the SonarScanner to analyze your code
6. Make the results available at http://localhost:9000

Default credentials for SonarQube are:

- Username: admin
- Password: admin

You'll be prompted to change the password on first login.

### Option B: Using SonarCloud (Recommended for teams)

1. Create an account on [SonarCloud](https://sonarcloud.io/)
2. Create a new organization or join an existing one
3. Create a new project for your repository
4. Generate a token for authentication

### Option C: Self-hosted SonarQube (For enterprise environments)

1. Download SonarQube from the
   [official website](https://www.sonarqube.org/downloads/)
2. Install and run SonarQube following the
   [installation guide](https://docs.sonarqube.org/latest/setup/install-server/)
3. Access SonarQube at `http://localhost:9000` (default)
4. Create a new project and generate a token

### SonarScanner Installation (for non-Docker setup)

#### Global Installation

```bash
npm install -g sonar-scanner
```

#### Project-level Installation

```bash
npm install --save-dev sonar-scanner
```

## Viewing Analysis Results

1. Open http://localhost:9000 in your browser
2. Log in with your credentials
3. Navigate to the "Projects" section to see the Poly Micro Frontend project
4. Click on the project to view detailed analysis results

## Project Configuration

The SonarScanner is configured in `sonar-project.properties`:

```properties
# Project identification
sonar.projectKey=poly-micro-frontend
sonar.projectName=Poly Micro Frontend
sonar.projectVersion=1.0.0

# Source code location
sonar.sources=src
sonar.tests=src/__tests__

# Test file patterns
sonar.test.inclusions=**/*.test.tsx,**/*.test.ts

# Coverage reports
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Exclude files from analysis
sonar.exclusions=**/node_modules/**,**/*.test.tsx,**/*.test.ts,**/e2e/**,**/coverage/**,**/dist/**,**/*.stories.tsx

# Encoding of the source code
sonar.sourceEncoding=UTF-8
```

This configuration:

- Sets the project key, name, and version
- Defines source and test directories
- Specifies test file patterns
- Configures coverage report paths
- Excludes certain files and directories from analysis
- Sets the source encoding

## GitHub Actions Integration

To automatically run SonarQube analysis on every pull request and push to the
main branch, add the following GitHub Actions workflow file:

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch: # Allow manual triggering

jobs:
  sonarqube:
    name: SonarQube Analysis
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Fetch all history for proper SCM integration

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:coverage

      - name: SonarQube Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

Make sure to add your `SONAR_TOKEN` to your GitHub repository secrets.

## Running SonarScanner Locally (without Docker)

To run the SonarScanner locally:

1. Generate code coverage report:

   ```bash
   npm run test:coverage
   ```

2. Run SonarScanner:

   ```bash
   sonar-scanner
   ```

3. View results on your SonarQube server or SonarCloud.

## Understanding SonarQube Reports

SonarQube provides several metrics to assess your code quality:

### 1. Quality Gate

The Quality Gate is a set of conditions that determines whether your code meets
the quality requirements. It can be:

- **Passed**: Your code meets all conditions
- **Failed**: Your code doesn't meet one or more conditions

### 2. Key Metrics

- **Bugs**: Code issues that represent potential bugs
- **Vulnerabilities**: Security issues in your code
- **Code Smells**: Maintainability issues
- **Coverage**: Percentage of code covered by tests
- **Duplications**: Percentage of duplicated code
- **Technical Debt**: Estimated time to fix all code smells

### 3. Issue Severity Levels

- **Blocker**: Issues that must be fixed immediately
- **Critical**: Issues that should be addressed as soon as possible
- **Major**: Issues of significant concern
- **Minor**: Issues of minor concern
- **Info**: Informational issues

## Customizing Analysis

### Adding Custom Rules

To add custom rules:

1. Log in to SonarQube
2. Go to Administration > Quality Profiles
3. Create a new profile or clone an existing one
4. Add or modify rules as needed
5. Set your custom profile as the default for your project

### Excluding Files

To exclude additional files from analysis, modify the `sonar.exclusions`
property in `sonar-project.properties`:

```properties
sonar.exclusions=**/node_modules/**,**/*.test.tsx,**/*.test.ts,**/e2e/**,**/coverage/**,**/dist/**,**/your-excluded-path/**
```

### Changing Quality Gates

Quality Gates determine when a project is considered passing or failing:

1. Log in to SonarQube
2. Go to Administration > Quality Gates
3. Create a new gate or modify the existing one
4. Set conditions for passing/failing
5. Assign the gate to your project

## Best Practices

1. **Run analysis regularly**: Incorporate SonarQube analysis into your daily
   development workflow
2. **Fix issues incrementally**: Address issues systematically, focusing on
   high-severity ones first
3. **Maintain high test coverage**: Aim for at least 80% test coverage
4. **Use Quality Gates**: Set up quality gates to prevent merging code with
   serious issues
5. **Review SonarQube reports before merging**: Make SonarQube analysis part of
   your code review process
6. **Set up custom rules**: Configure SonarQube to match your project's specific
   requirements

## Troubleshooting

### SonarQube Won't Start

If SonarQube fails to start:

```bash
docker-compose -f docker-compose.sonarqube.yml logs sonarqube
```

Common issues:

- Insufficient memory: SonarQube requires at least 2GB of RAM
- Port conflict: Ensure port 9000 is not in use by another application

### SonarScanner Fails

If SonarScanner fails:

```bash
docker-compose -f docker-compose.sonarqube.yml logs sonarscanner
```

Common issues:

- SonarQube not ready: The wait script should handle this, but you might need to
  increase wait time
- Missing coverage reports: Ensure tests are run before analysis
- Permission issues: Check that Docker has permission to access your project
  files

### Other Common Issues

1. **Connection Errors**:

   - Ensure your SONAR_TOKEN is correctly set
   - Check that your SonarQube server is accessible

2. **Analysis Fails**:

   - Check SonarQube logs for details
   - Ensure you have sufficient permissions

3. **Coverage Not Showing**:
   - Verify the path to coverage report is correct
   - Ensure tests are generating coverage reports properly

## Stopping SonarQube

To stop SonarQube and clean up resources:

```bash
docker-compose -f docker-compose.sonarqube.yml down -v
```

The `-v` flag removes volumes, which will delete all analysis data. Omit this
flag if you want to preserve data between runs.

## Continuous Integration

To integrate SonarQube analysis in your CI pipeline:

1. Set up a SonarQube server (either self-hosted or SonarCloud)
2. Add the following to your CI configuration:

```yaml
# Example GitHub Actions workflow
sonarqube:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
      with:
        fetch-depth: 0
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    - name: Install dependencies
      run: npm ci
    - name: Run tests with coverage
      run: npm run test:coverage
    - name: SonarQube Scan
      uses: SonarSource/sonarqube-scan-action@master
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

## SonarQube Analysis Results

This section showcases the results of our SonarQube code quality analysis,
highlighting the project's adherence to best practices and code quality
standards.

### Overall Code Quality

![Overall Code Quality](./assets/sonarqube/overall-code-quality.jpg)

## Conclusion

This SonarQube and SonarScanner setup provides a comprehensive code quality
analysis solution for the Poly Micro Frontend project. Regular analysis will
help maintain high code quality as the project evolves.

## References

- [SonarQube Documentation](https://docs.sonarqube.org/latest/)
- [SonarScanner Documentation](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)
- [SonarQube JavaScript Rules](https://rules.sonarsource.com/javascript/)
