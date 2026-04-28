# App Specification Document

## Overview

This document defines the specifications for the web application located in the `/app` folder. It is designed for AI consumption and provides clear guidelines for development decisions.

## Project Structure

```
sds-poc/                    # Root project directory
├── app/                    # Web application (THIS SCOPE)
├── ds/                     # Design System library
├── package.json            # Dependencies and scripts
├── .env files              # Environment configuration
└── app/specs/
    ├── AppSpec.md         # This file
    └── FEArchitecture.md  # General architectural guidelines
```

## Scope

**This specification covers ONLY the `/app` folder.**

- Design System components are consumed from `/ds` (sibling directory)
- Environment configuration is managed at project root (`sds-poc/`)
- All architectural decisions must align with `FEArchitecture.md`

## Technology Stack

### Core Dependencies

Reference `package.json` in project root for:

- React version and related packages
- Build tools and bundlers
- Testing frameworks
- Other runtime dependencies

### State Management

**Server State**: TanStack Query (React Query)

- Handles all server-side data fetching
- Manages caching strategies
- Handles request deduplication
- Provides loading/error states

### Routing

**React Router** is used for all navigation and routing needs. The version is defined in the package.json file in the proyect root folder.

## Environment Configuration

**Location**: Project root (`sds-poc/`)

## Design System Integration

**Source**: `/ds` folder (sibling to `/app`)

**Guidelines:**

- All UI components must be sourced from the Design System
- Follow Design System theming and styling conventions
- Do not create custom components that duplicate DS functionality
- Reference DS documentation for component APIs

## Ignore folders

The folders `src/ds/examples` `src/ds/data` should be ignored for any implementation done on the app folder

## Architectural Principles

**Reference Document**: `FEArchitecture.md` (same directory)

All implementation decisions MUST comply with the architectural guidelines defined in `FEArchitecture.md`.

**When conflicts arise:**

1. Consult `FEArchitecture.md` first
2. If ambiguous, request clarification
3. Document the decision and rationale

## Development Guidelines

### Server State (TanStack Query)

- Use for ALL API calls and server data
- Define query keys consistently
- Implement proper error boundaries
- Configure cache invalidation strategies
- Leverage optimistic updates where appropriate

### Routing (React Router)

- Organize routes logically
- Implement lazy loading for code splitting
- Handle 404 and error routes
- Manage route-based data loading

### Design System Usage

- Import components from DS package
- Use DS theming tokens (CSS variables from `theme.css`)
- Follow DS component composition patterns
- Respect DS accessibility guidelines

---

**Note**: This is a living document. When ambiguities are identified during development, request clarification through the interview process and update this specification accordingly.
