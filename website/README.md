# O.G. Agency | Digital Recruitment Platform

Welcome to the frontend repository for the **O.G.** project (Group CS16). This platform aims to modernize global employment, visa processing, and manpower recruitment using Next-Gen technologies.

## 🚀 Tech Stack

This project is built using modern, industry-standard web technologies:

*   **Framework:** [Next.js (App Router)](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animation:** [Framer Motion](https://www.framer.com/motion/)
*   **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
*   **State Management:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
*   **Icons:** [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
website/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Reusable React components
│   ├── home/             # Landing page specific components
│   ├── layout/           # Shared layout elements (Navbar, Footer)
│   └── ui/               # Generic UI components (Buttons, Inputs) - To be added
├── utils/                # Utility functions (e.g., class merging)
├── public/               # Static assets (images, fonts)
└── next.config.ts        # Next.js configuration and Security Headers
```

## 🛠️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

*   Node.js (v18.x or later)
*   npm (v9.x or later)

### Installation

1. Clone the repository and navigate to the website folder:
   ```bash
   cd website
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template and update it if necessary:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛡️ Security Features

This application implements several out-of-the-box security measures:
*   Strict TypeScript typing and Zod schema validation.
*   Next.js native security headers (`X-DNS-Prefetch-Control`, `X-XSS-Protection`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) configured in `next.config.ts`.
*   Sanitization libraries available (`xss`) for user-generated content.

## 👥 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, branching strategy, and the process for submitting pull requests to us.

---
*Developed by Group CS16*
