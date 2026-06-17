# 🛡️ Security Policy

Security is the **absolute highest priority** for the O.G. Agency Digital Transformation. Because we process highly sensitive client documents (Passports, Visas, Medical Records, National IDs), we must adhere to the strictest security standards.

## Supported Versions

Currently, the project is under active development. Only the `main` branch will eventually receive security patches once deployed.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ❌ (In Development)|

## 🚨 Reporting a Vulnerability

If you discover any security vulnerability in the architecture, codebase, or infrastructure (especially concerning the Blockchain Vault, Firebase Auth, or Cloudflare storage), please **do not** open a public issue or discuss it in public spaces.

Instead, report it immediately via the following steps:
1. Direct Message the **Risk Manager** and the **Project Manager** on the team communication channel.
2. Provide a detailed summary of the vulnerability, including steps to reproduce.
3. The team will assess the risk and aim to deploy a `hotfix` immediately.

## 🔐 Core Security Mandates

All developers in **Team CS16** must adhere to the following:

- **No Hardcoded Secrets:** Never commit passwords, API keys, or JWT secrets to the repository. Use environment variables exclusively.
- **Zero Trust:** The Admin Dashboard must verify the role of the user on *every* request to the Unified Backend.
- **Document Immutability:** Any document uploaded to the Blockchain Vault must be treated as highly classified. Only authorized API routes can read/write to the vault.
- **Dependencies:** Keep dependencies updated. Do not introduce new third-party libraries without a security review by the Risk Manager.
- **CORS & Rate Limiting:** The backend must restrict CORS to our specific deployed domains and implement strict rate limiting to prevent DDoS and brute-force attacks.

Thank you for helping keep O.G. Agency's data safe! 🔒
