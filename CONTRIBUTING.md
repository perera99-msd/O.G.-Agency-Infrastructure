# 🤝 Contributing to O.G.

First off, thank you for being a part of **Development Team CS16, University of Bedfordshire**! 🎉

This document outlines the standard operating procedures and workflows for contributing to the O.G. Agency Digital Transformation monorepo. Since this is a proprietary, highly secure project, strict adherence to these guidelines is mandatory.

---

## 🔒 Confidentiality & Security First

- **Never** commit sensitive data (API keys, Firebase credentials, client data, `.env` files).
- Always ensure you are on a secure network when working with production or staging databases.
- All code changes must be peer-reviewed due to the sensitive nature of the data we handle (Passports, Visas, Medical Records).

## 🌿 Branching Strategy (Git Flow)

We follow a strict Git Flow methodology:

- `main` - **Production-ready code.** Only updated via Pull Requests.
- `develop` - **Active development branch.** Integration branch for features.
- `feature/<ticket-id>-<short-desc>` - For new features (e.g., `feature/OGA-12-auth-setup`).
- `bugfix/<ticket-id>-<short-desc>` - For bug fixes.
- `hotfix/<ticket-id>-<short-desc>` - For urgent production fixes.

## 🛠️ Development Workflow

1. **Assign yourself a task** from the Sprint Backlog (managed by the Scheduling Manager).
2. **Create a new branch** off `develop` (or `main` for hotfixes).
   ```bash
   git checkout -b feature/OGA-45-blockchain-vault develop
   ```
3. **Write your code.** Ensure you follow the architecture guidelines for the specific component (Next.js, Node.js, Python).
4. **Commit your changes** using Conventional Commits.
   ```bash
   git commit -m "feat(backend): implement secure document upload endpoint"
   ```
5. **Push your branch** and open a Pull Request (PR) against the `develop` branch.
6. **Request a Review** from the Quality Manager and at least one other peer.

## ✅ Pull Request Requirements

- **Descriptive Title:** Follow conventional commits (e.g., `fix(pwa): resolve UI glitch on CV upload`).
- **Linked Tickets:** Mention the Jira/Trello ticket number.
- **Testing:** Include tests for any new logic. The CI/CD pipeline must pass before merging.
- **Approvals:** Requires at least 1 approval from a core team member before squash & merging.

## 🎨 Code Style & Quality

- **Linting & Formatting:** We use ESLint and Prettier. Run `npm run lint` before committing.
- **Type Safety:** TypeScript is heavily preferred/required for the Frontends and Backend to prevent runtime errors.
- **Documentation:** Update `README.md` or component documentation if your PR introduces architectural changes.

---

*Let's build something amazing together!* 🚀
