# Automatic Release Management System

This document explains how to set up and use the automatic release management system for the Poly
Micro Manager application.

## Overview

The release management system automatically notifies users of new releases in a Discord-style
format. It includes:

1. **Discord-style notifications** with version information and release notes
2. **Dark theme support** that adapts to your application's theme
3. **CI/CD integration** using Git tags for automatic release notes generation
4. **Multiple data sources** - can fetch release information from:
   - A local JSON file in your repository
   - A GitHub repository

## Release File Structure

Releases are defined in a JSON file located at `releases/releases.json` with the following
structure:

```json
{
  "releases": [
    {
      "version": "1.2.0",
      "releaseDate": "2025-04-25",
      "title": "April 2025 Update",
      "description": "This update brings several new features...",
      "changes": [
        {
          "type": "feature",
          "description": "Added new microservice testing capabilities"
        },
        {
          "type": "fix",
          "description": "Fixed authentication issues"
        }
      ]
    }
  ]
}
```

## Automatic Updates with Git Tags

### Understanding Git Tags

Git tags are references that point to specific points in Git history, typically used to mark release
versions. Unlike branches, tags don't change once created - they're like snapshots of your
repository at a specific commit.

### When to Apply Tags

Apply tags when:

- You've completed a set of features that constitute a new version
- You're ready to deploy a new release to users
- You want to mark a significant milestone in your project

A common pattern is to follow [Semantic Versioning](https://semver.org/):

- **v1.0.0**: Initial release
- **v1.1.0**: Added new features
- **v1.1.1**: Bug fixes
- **v2.0.0**: Breaking changes

### Using Tags for Release Management

1. **Create a tag** when you're ready to release a new version:

   ```bash
   git tag v1.3.0
   ```

2. **Push the tag** to your remote repository:

   ```bash
   git push origin v1.3.0
   ```

3. **Automatic workflow** will trigger and update your release notes

### Option 1: GitHub Actions Workflow

The project includes a GitHub Actions workflow at `.github/workflows/release-update.yml` that
automatically:

1. Triggers when you push a tag starting with 'v' (e.g., v1.3.0)
2. Extracts the version number from the tag
3. Analyzes commit messages to generate release notes based on commit types:
   - `feat:` → feature
   - `fix:` → fix
   - `improve:` / `refactor:` / `perf:` → improvement
   - `BREAKING CHANGE:` → breaking change
4. Updates the releases.json file
5. Commits and pushes the changes

### Option 2: Manual Script

You can also manually update releases using the script at `.github/scripts/update-release.js`:

```bash
# Make the script executable (if not already)
chmod +x .github/scripts/update-release.js

# Run the script with required parameters
./.github/scripts/update-release.js --version=1.3.0 --title="May 2025 Update" --description="This update includes new features and improvements"
```

You can also specify a JSON file containing the changes:

```bash
# Create a changes.json file in the releases directory with your release changes
./.github/scripts/update-release.js --version=1.3.0 --title="May 2025 Update" --changes=./releases/changes.json
```

### Option 3: GitHub Repository Integration

The system can also fetch releases directly from your GitHub repository. To use this method:

1. Update the `githubPath` in `src/utils/releaseSync.ts` with your repository information:

```typescript
const githubPath = 'your-username/your-repo/main/releases/releases.json';
```

2. Ensure your releases.json file is committed to the specified path in your repository.

## Manual Updates

You can also manually update the releases file:

1. Edit `releases/releases.json` to add a new release entry
2. Commit and push the changes to your repository

## How It Works

1. When the application starts, it automatically syncs releases from the configured source
2. New releases are added to the database with the latest version marked as current
3. Users who haven't acknowledged the latest release will see a notification
4. Clicking the notification opens a modal with release details
5. Users can acknowledge the release to dismiss the notification

## Theme Support

The release management system automatically adapts to your application's theme (light or dark mode):

- **Light Mode**: Clean, white background with blue accents
- **Dark Mode**: Dark background with adjusted colors for better contrast and readability

The system uses the application's existing `useTheme` hook to detect the current theme and apply
appropriate styling. No additional configuration is needed - it works out of the box.

## Customization

You can customize the appearance and behavior of the release notification system by modifying:

- `ReleaseModal.tsx`: The modal that displays release details
- `ReleaseNotification.tsx`: The notification badge
- `releaseSync.ts`: The synchronization logic

The components use Tailwind CSS for styling, making it easy to adjust colors, spacing, and other
visual elements.

## Troubleshooting

If releases are not showing up:

1. Check the browser console for errors
2. Use the built-in debug panel (click "Show Debug" in the bottom-left corner)
3. Verify that your releases.json file is correctly formatted
4. Check that the file is accessible from the configured source
5. Inspect the database using the browser's developer tools (IndexedDB)

### Common Issues

- **No releases showing**: Make sure your releases.json file is properly formatted and accessible
- **Release notification not appearing**: Check if the user has already acknowledged the latest
  release
- **Theme not applying correctly**: Ensure the useTheme hook is properly integrated
- **Git tag workflow not triggering**: Verify you've pushed the tag correctly with
  `git push origin v1.3.0`

For more detailed information, refer to the
[release management documentation](./docs/release-management.md).
