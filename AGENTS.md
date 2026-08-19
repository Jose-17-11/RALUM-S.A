# Agent Directives & Architecture

## System Overview
Automotive radiator catalog and workshop landing page built with Astro, React, and Tailwind CSS, deployed to Cloudflare Pages.

## Core Directives
1. **Primary Task:** Generate and maintain comprehensive technical documentation (JSDoc, inline architecture comments, and `README.md`).
2. **Token Efficiency:** Do not read external asset files or binary files. Rely strictly on `src/data/products.js` and `src/components/` structure.
3. **Language:** Write code comments, explanations, and documentation in Spanish.
4. **Git Convention:** Use Conventional Commits standard (e.g., `docs(readme): update project documentation`).