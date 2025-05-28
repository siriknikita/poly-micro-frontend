# Release Management System

The Poly Micro Manager includes an automatic release management system that
notifies users of new releases in a Discord-style format. This document explains
how to use and manage the system.

## Features

- **Automatic Notifications**: Users are automatically notified of new releases
  they haven't acknowledged
- **Release Notes**: Detailed release notes with version information, changes,
  and improvements
- **User Acknowledgment**: Users can acknowledge releases to dismiss
  notifications
- **Release History**: Users can view the history of all previous releases
- **Dark Theme Support**: The release notification system adapts to the
  application's theme
- **CI/CD Integration**: Automatic release notes generation using Git tags

## How It Works

1. When a new version is deployed, a release record is created in the database
2. Users who haven't acknowledged the release will see a notification badge
3. Clicking the notification opens a modal with release details
4. Users can acknowledge the release to dismiss the notification

## Managing Releases

### Creating a New Release

When deploying a new version, use the `createNewRelease` function from the
`releaseManager` utility:

```typescript
import { createNewRelease } from './utils/releaseManager';

await createNewRelease(
  '1.3.0', // Version number
  'May 2025 Update', // Title
  'This update brings several new features and improvements.', // Description
  [
    {
      type: 'feature',
      description: 'Added new CI/CD pipeline integration',
    },
    {
      type: 'improvement',
      description: 'Enhanced microservice discovery process',
    },
    {
      type: 'fix',
      description: 'Fixed issue with project selection',
    },
  ],
);
```

### Change Types

The system supports four types of changes:

- `feature`: New features (displayed with ✨)
- `improvement`: Improvements to existing features (displayed with 📈)
- `fix`: Bug fixes (displayed with 🔧)
- `breaking`: Breaking changes (displayed with ⚠️)

### Utility Functions

The `releaseManager.ts` utility provides several functions for managing
releases:

- `createNewRelease`: Creates a new release and sets it as the latest
- `getAllReleases`: Gets all releases ordered by date (newest first)
- `getLatestRelease`: Gets the latest release
- `hasUserAcknowledgedLatestRelease`: Checks if a user has acknowledged the
  latest release
- `acknowledgeRelease`: Marks a release as acknowledged by a user

## Integration with CI/CD

### Using Git Tags

The release management system integrates with your CI/CD pipeline using Git
tags:

1. **Creating Tags**: When you're ready to release a new version, create and
   push a Git tag:

   ```bash
   git tag v1.3.0
   git push origin v1.3.0
   ```

2. **Automatic Workflow**: The GitHub Actions workflow in
   `.github/workflows/release-update.yml` will:

   - Trigger when a tag starting with 'v' is pushed
   - Extract the version number from the tag
   - Generate release notes from commit messages
   - Update the releases.json file
   - Commit and push the changes

3. **When to Apply Tags**:
   - When you've completed a set of features for a new version
   - When you're ready to deploy a new release to users
   - When you want to mark a significant milestone in your project

### Commit Message Format

The system extracts release notes from commit messages based on their prefixes:

- `feat:` → Feature
- `fix:` → Fix
- `improve:`, `refactor:`, `perf:` → Improvement
- `BREAKING CHANGE:` → Breaking change

Example commit messages:

```
feat: Add new dashboard component
fix: Resolve authentication issue
improve: Optimize database queries
BREAKING CHANGE: Refactor API endpoints
```

### Manual Release Creation

You can also manually create releases using the `createNewRelease` function:

```typescript
import { createNewRelease } from './utils/releaseManager';

await createNewRelease(
  '1.3.0',
  'New Release Title',
  'Description of the release',
  [
    { type: 'feature', description: 'New feature description' },
    { type: 'fix', description: 'Bug fix description' },
  ],
);
```

## Database Schema

The release management system uses the following database tables:

- `releases`: Stores information about each release
- `userAcknowledgments`: Tracks which users have acknowledged which releases

## Customization

### Theme Support

The release notification system automatically adapts to the application's theme
(light or dark mode). The components use the `useTheme` hook to detect the
current theme and apply appropriate styling.

### Component Customization

The appearance and behavior of the release notification system can be customized
by modifying:

- `ReleaseModal.tsx`: The modal that displays release details
- `ReleaseNotification.tsx`: The notification badge that appears when there's a
  new release
- `ReleaseContext.tsx`: The context provider that manages the release state

### Styling

The components use Tailwind CSS for styling. You can customize the appearance by
modifying the CSS classes in the component files.

## Troubleshooting

If releases are not showing up:

1. **Check the browser console** for errors
2. **Use the built-in debug panel** (click "Show Debug" in the bottom-left
   corner)
3. **Verify your releases.json file** is correctly formatted
4. **Check that the file is accessible** from the configured source
5. **Inspect the database** using the browser's developer tools (IndexedDB)

### Common Issues

- **No releases showing**: Make sure your releases.json file is properly
  formatted and accessible
- **Release notification not appearing**: Check if the user has already
  acknowledged the latest release
- **Theme not applying correctly**: Ensure the useTheme hook is properly
  integrated
