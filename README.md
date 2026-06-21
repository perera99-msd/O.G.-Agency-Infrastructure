# 🏢 O.G. Agency Digital Transformation Infrastructure 🚀

> **A Next-Generation Unified Platform for Visa & Manpower Processing**

Welcome to the central monorepo for the **O.G. Agency Digital Transformation Project**. This repository houses all the core components—from the public-facing storefront to the highly secure admin dashboard, backed by a robust unified architecture.

Developed with ❤️ and ☕ by **Development Team CS16, University of Bedfordshire**.

---

## 🌟 Executive Summary

O.G. Agency (managed by Mr. Wasantha) is transitioning from manual, paper-heavy visa and manpower processing to a fully automated, ultra-secure digital ecosystem. This platform aims to:
- **Automate** client communications and inquiries via an AI Chatbot.
- **Streamline** application processes through a dedicated Customer PWA.
- **Secure** highly sensitive documents using cutting-edge storage (Cloudflare + Blockchain Vault).
- **Centralize** operations through an Admin Dashboard with strict role-based privacy..

---

## 🏗️ Technical Architecture & Stack

This project is built using a **Monorepo Strategy**, housing all 5 logical parts within a single repository for streamlined CI/CD, easier testing, and unified dependency management.

### 🧩 Core Components

| Component | Description | Technology Stack |
| :--- | :--- | :--- |
| 🌐 **Public Website** | Digital storefront, service listings, automated News/Blog page, AI Chatbot. | Next.js, React, Tailwind CSS |
| 📱 **Customer PWA** | Portal for applicants (CV upload, progress tracking, secure doc upload). | Next.js / Vite, PWA |
| 🛡️ **Admin Dashboard**| Secure control center for staff, role-based privacy, content management. | Next.js, React |
| ⚙️ **Unified Backend** | Single backend serving all three frontends, managing logic & integration. | Node.js, Express/NestJS |
| 🤖 **AI & Automation** | CV extraction, matchmaking, chatbot logic, n8n for news aggregation. | Python, n8n, Custom AI Models |

### 🗄️ Data & Security
- **Authentication & Database**: Firebase (Google Auth, Email/Password, Firestore).
- **Storage & Security**: Cloudflare combined with a Blockchain Wallet/Vault for immutable document storage.

---

## 📂 File Structure

The monorepo is structured systematically to maintain separation of concerns while keeping everything strictly in one place.

```text
O.G.-Agency-Infrastructure/
├── 🌐 website/               # Next.js Public Website (Storefront & Chatbot)
├── 📱 mobile-application/    # Next.js/Vite Customer PWA
├── 🛡️ admin-dashboard/       # Next.js Admin Control Center
├── ⚙️ backend/               # Node.js Unified Backend API
├── 🤖 ai-bot/                # AI services (CV parsing, Matching, n8n Engine)
├── 📜 README.md              # Project overview (You are here)
├── ⚖️ LICENSE                # Proprietary License information
├── 🤝 CONTRIBUTING.md        # Contribution guidelines for Team CS16
├── 🛡️ SECURITY.md            # Security protocols and incident response
└── 🧑‍⚖️ CODE_OF_CONDUCT.md     # Team behavioral guidelines
```

---

## 🚀 Getting Started

*(Detailed setup instructions for each service will be found in their respective directories as development progresses.)*

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.10+ for AI modules)
- **Firebase CLI**
- **Docker** (for local n8n and DB emulation)

### Quick Start
1. **Clone the repository:** *(Restricted access)*
   ```bash
   git clone <repo-url>
   cd O.G.-Agency-Infrastructure
   ```
2. **Install dependencies:**
   *(Run installation commands in each respective directory or use a monorepo tool like Turborepo/Yarn Workspaces)*
   ```bash
   cd backend && npm install
   ```
3. **Environment Variables:**
   Obtain the `.env` keys from the Development Team Lead and place them in the root of the respective modules. Never commit `.env` files.

---

## 📅 Agile Project Management

This project is executed using **Agile Scrum Methodology** over a 10-week timeline, prioritizing high-risk technical features (like the Blockchain Vault and Database architecture) in the early sprints.

**Team Roles (CS16):**
- 🧑‍💼 **Project Manager:** Oversees sprint goals and team velocity.
- ⚠️ **Risk Manager:** Mitigates technical and business risks (e.g., Vault architecture).
- 🧪 **Quality Manager:** Ensures strict QA and CI/CD pipeline integrity.
- 📅 **Scheduling Manager:** Manages timelines, standups, and sprint reviews.
- 🚀 **Start-up Manager:** Handles deployments, infrastructure scaling, and client handoffs.

---

## ⚖️ License & Confidentiality

**PROPRIETARY & CONFIDENTIAL**
This source code cannot be accessed, used, or distributed without explicit permission. **"Cannot get codes without asking."**
Refer to the [LICENSE](./LICENSE) file for more details.

---
*Created by Development Team CS16, University of Bedfordshire* 🎓
