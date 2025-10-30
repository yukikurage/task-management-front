# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 frontend application for task management, using the App Router architecture. The project uses React 19.2, TypeScript, and Tailwind CSS v4 for styling.

## Development Commands

### Running the Development Server
```bash
npm run dev
```
The app will be available at http://localhost:3000

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

### Linting
```bash
npm run lint
```

## Architecture

### Framework & Routing
- **Next.js 16 with App Router**: Uses the `app/` directory for file-based routing
- **React Server Components**: Default component model unless 'use client' directive is specified
- **TypeScript**: Strict mode enabled with target ES2017

### Styling
- **Tailwind CSS v4**: Configured via `postcss.config.mjs` using `@tailwindcss/postcss`
- Custom CSS in `app/globals.css`
- Built-in dark mode support via Tailwind's `dark:` prefix

### Fonts
- Uses Next.js Font Optimization with Geist and Geist Mono fonts
- Font variables: `--font-geist-sans` and `--font-geist-mono`

### Path Aliases
- `@/*` maps to the root directory (configured in `tsconfig.json`)
- Example: `import { Component } from "@/components/component"`

### ESLint Configuration
- Uses modern flat config format (`eslint.config.mjs`)
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Project Structure

```
app/               # Next.js App Router directory
├── layout.tsx     # Root layout with font configuration
├── page.tsx       # Home page component
└── globals.css    # Global styles
public/            # Static assets (images, fonts, etc.)
```

## Key Technical Details

- **TypeScript Config**: Uses `react-jsx` transform (not `preserve`)
- **Module Resolution**: Set to `bundler` mode for Next.js compatibility
- **Strict Mode**: Enabled for better type safety
- **React Version**: 19.2.0 (latest with React Compiler support)
