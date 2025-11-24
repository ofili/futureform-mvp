# DevOps & Deployment Guide

## Overview
We use a **Feature Branch Workflow** with automated CI/CD.

- **`dev`**: The main integration branch. All feature branches merge here.
- **`main`**: The production branch. Deploys automatically to Vercel.

## Workflow

### 1. Start a New Feature
Always create a new branch from `dev`:
```bash
git checkout dev
git pull origin dev
git checkout -b feature/my-new-feature
```

### 2. Development
- Make changes and commit often.
- Run tests locally before pushing: `npm test`

### 3. Pull Request
- Push your feature branch: `git push origin feature/my-new-feature`
- Open a Pull Request (PR) to merge into **`dev`**.
- **CI Checks**: GitHub Actions will automatically run tests and linting.
- **Review**: Get code review approval.

### 4. Merge to `dev`
- Once approved and CI passes, merge the PR into `dev`.
- This updates the staging/development environment.

### 5. Deployment to Production
- To deploy to production, open a PR from **`dev`** to **`main`**.
- Once merged, Vercel will automatically build and deploy the new version.

## CI/CD Pipeline
Configured in `.github/workflows/ci.yml`:
- **Triggers**: Pushes to `main`, `dev`, and all PRs.
- **Jobs**:
  - `build`: Verifies the app builds successfully.
  - `test`: Runs the test suite.
  - `lint`: Checks code quality.
