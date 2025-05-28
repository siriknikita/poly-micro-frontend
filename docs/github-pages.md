# GitHub Pages Documentation

This project's documentation is available on GitHub Pages at:
`https://siriknikita.github.io/poly-micro-frontend-demo/`

## About the Documentation

The documentation is automatically deployed to GitHub Pages whenever changes are
made to files in the `docs/` directory on the main branch. This is handled by a
GitHub Actions workflow.

## Local Development

There are several ways to run the documentation locally for development
purposes:

### Option 1: Using npx (Recommended)

This method doesn't require global installation:

```bash
cd docs
npx docsify-cli serve
```

### Option 2: Using a local installation

```bash
cd docs
npm init -y
npm install docsify-cli --save-dev
npx docsify-cli serve
```

### Option 3: Global installation (may require elevated permissions)

```bash
# Using sudo (on Linux/macOS)
sudo npm install -g docsify-cli
cd docs
docsify serve

# OR using npm with a custom global directory
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g docsify-cli
cd docs
docsify serve
```

After running any of these commands, open your browser and navigate to
`http://localhost:3000`

## Documentation Structure

The documentation is organized by feature components:

- **Authentication**: User login and registration components
- **Monitoring**: Components for monitoring microservice health
- **Pipelining**: CI/CD pipeline management components
- **Testing**: Automated testing components
- **Shared Components**: Reusable UI components
- **Core Components**: Main layout and structural components
- **Import Guide**: Guidelines for importing components correctly

## Contributing to Documentation

When adding new documentation:

1. Create markdown files in the appropriate directory under `docs/`
2. Update the sidebar navigation if needed (`_sidebar.md`)
3. Use relative links for navigation between documentation pages
4. Include code examples where appropriate

## Troubleshooting

If the documentation is not updating after pushing changes:

1. Check the GitHub Actions workflow status in the repository's Actions tab
2. Ensure your changes were pushed to the main branch
3. Verify that the changes were made to files in the `docs/` directory
4. Check if there are any errors in the workflow logs

### Common Issues

#### "Get Pages site failed" or "Not Found" Error

This error occurs when GitHub Pages hasn't been properly enabled in your
repository settings. To fix this:

1. Go to your GitHub repository:
   `https://github.com/siriknikita/poly-micro-frontend-demo`
2. Click on "Settings" (tab at the top)
3. Scroll down to the "Pages" section in the left sidebar
4. Under "Build and deployment":
   - For "Source", select "GitHub Actions"
   - Click "Save"
5. If you're still encountering issues, try these additional steps:
   - Go to the "Actions" tab in your repository
   - Find the failed workflow run
   - Click "Re-run all jobs"
   - If needed, create a small change to any file in the `docs/` directory to
     trigger a new workflow run

Note: GitHub Pages might take a few minutes to set up after enabling it for the
first time.

#### Permission Issues with npm Install

If you encounter permission issues when running `npm install -g docsify-cli`
locally, use one of the alternative methods described in the "Local Development"
section above.
