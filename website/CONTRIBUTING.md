# Contributing to O.G. Agency Infrastructure

First off, thank you for contributing! As a member of Group CS16, this document outlines our standard procedures for developing the O.G. Agency platform.

## Development Workflow

1. **Branching Strategy:**
   * `main`: Production-ready code only.
   * `dev`: Integration branch for active development.
   * `feature/*`: For new features (e.g., `feature/user-auth`).
   * `bugfix/*`: For bug fixes (e.g., `bugfix/nav-alignment`).

2. **Making Changes:**
   * Ensure you pull the latest changes from `dev` before starting.
   * Create a new branch: `git checkout -b feature/your-feature-name`
   * Write clean, documented code and follow the existing code style.
   * Test your changes locally before committing.

3. **Commit Messages:**
   * Use clear, descriptive commit messages.
   * Example: `feat: add user authentication via next-auth`
   * Example: `fix: resolve mobile navigation overflow issue`
   * Example: `chore: update dependencies`

4. **Pull Requests:**
   * Open a PR against the `dev` branch, not `main`.
   * Fill out the PR template completely if one is available.
   * Ensure the project builds successfully (`npm run build`) before requesting a review.
   * At least one other team member must approve the PR before merging.

## Tech Stack Guidelines

* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS with utility functions (`cn` from `clsx` and `tailwind-merge`).
* **State Management:** Zustand (Prefer local state `useState` where global state is unnecessary).
* **Forms & Validation:** `react-hook-form` paired with `zod`.

Happy coding!
