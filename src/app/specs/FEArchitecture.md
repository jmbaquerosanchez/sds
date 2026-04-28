# Frontend Architecture Guide

This document defines the complete architecture, patterns, and conventions for frontend projects. An LLM should be able to use this document along with a feature specification to generate complete, production-ready code including components, tests, and Storybook stories.

## Modern React Best Practices (2025/2026)

This architecture follows current React ecosystem standards:

✅ **Component Patterns**
- Function declarations instead of `React.FC` (more flexible, better DX)
- Named exports for components, default exports for pages
- No unnecessary `React` imports (modern JSX transform)

✅ **Performance**
- `useMemo` for context values (prevent unnecessary re-renders)
- `useCallback` for context functions (referential stability)
- Stable unique IDs for `key` props (never use array indices)

✅ **Type Safety**
- TypeScript strict mode enabled
- Interface for props and extensible objects, type for unions
- CSS Modules type safety with TypeScript plugin

✅ **Testing**
- `userEvent` instead of `fireEvent` (more realistic interactions)
- All user events are async and must be awaited
- Descriptive `data-testid` attributes for future migration to semantic queries

✅ **Styling**
- `clsx` for className merging (cleaner than template strings)
- CSS Modules for scoped styles
- CSS custom properties for design tokens

✅ **State Management**
- React Query v5 for server state
- Clear distinction between `mutate` and `mutateAsync`
- URL state preservation with updater functions

✅ **Forward Compatibility**
- Architecture is React 19 compatible
- Patterns work with both React 18 and React 19
- Ready for React 19 features (use hook, improved error boundaries)

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Naming Conventions](#naming-conventions)
3. [TypeScript Conventions](#typescript-conventions)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Styling with CSS Modules](#styling-with-css-modules)
7. [Testing Strategy](#testing-strategy)
8. [Storybook Guidelines](#storybook-guidelines)
9. [Internationalization](#internationalization)
10. [Error Handling](#error-handling)
11. [Build Configuration](#build-configuration)
12. [Required Libraries](#required-libraries)

---

## Project Structure

### Root Folders

```
src/
├── lib/           # Business-agnostic, reusable code
├── core/          # Project-specific shared code
└── modules/       # Feature modules (pages/page groups)
```

### lib/ - Business-Agnostic Code

Code in this folder should be easily portable to other projects.

```
lib/
├── components/    # Reusable UI components (Button, Input, Modal, etc.)
├── constants/     # Agnostic constants (regex patterns, generic configs)
├── hooks/         # Reusable hooks (useIsMounted, useDebounce, etc.)
├── types/         # Shared TypeScript type definitions
├── utils/         # Utility functions (color generators, formatters, etc.)
├── storybook/     # Storybook configuration and decorators
└── test/          # Test utilities and configurations (test i18n, mocks)
```

### core/ - Project-Specific Shared Code

Code that contains business logic specific to this project.

```
core/
├── components/    # Shared business components (AppHeader, Navigation, etc.)
├── constants/     # Business constants (API endpoints, feature flags)
├── context/       # Global React contexts (AuthContext, ThemeContext)
├── router/        # Routing configuration
│   └── routes.ts  # Central ROUTES object with all app routes
├── services/      # External API calls (React Query hooks)
├── types/         # Business-specific types (User, Product, etc.)
└── utils/         # Business-specific utilities
```

### modules/ - Feature Modules

A module is either a single page or a group of pages sharing a common route prefix.

**Examples:**
- `/dashboard` → single page module
- `/reports`, `/reports/domain/:domain`, `/reports/source/:source` → multi-page module

**Module Structure:**

```
modules/
└── [module-name]/
    ├── components/         # Module-specific components
    ├── constants/          # Module-specific constants
    ├── context/            # Module-specific contexts
    ├── pages/              # Page components
    ├── types/              # Module-specific types
    ├── utils/              # Module-specific utilities
    └── [ModuleName]Router.tsx  # Module router component
```

**Example:**

```
modules/
└── reports/
    ├── components/
    │   └── report-card/
    │       ├── ReportCard.tsx
    │       ├── ReportCard.module.css
    │       ├── ReportCard.stories.tsx
    │       └── ReportCard.test.tsx
    ├── pages/
    │   └── reports-list/
    │       ├── ReportsListPage.tsx
    │       ├── ReportsListPage.module.css
    │       ├── ReportsListPage.stories.tsx
    │       └── ReportsListPage.test.tsx
    └── ReportsRouter.tsx
```

---

## Naming Conventions

### Files and Folders

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.tsx | `Button.tsx`, `UserProfile.tsx` |
| Component folders | kebab-case | `user-profile/`, `report-card/` |
| CSS Modules | PascalCase.module.css | `Button.module.css` |
| Test files | PascalCase.test.tsx | `Button.test.tsx` |
| Storybook files | PascalCase.stories.tsx | `Button.stories.tsx` |
| Utility files | camelCase.ts | `formatDate.ts`, `apiHelpers.ts` |
| Type files | PascalCase.types.ts | `User.types.ts`, `Api.types.ts` |
| Constants files | camelCase.ts or SCREAMING_SNAKE_CASE.ts | `apiEndpoints.ts`, `ROUTES.ts` |
| Hook files | camelCase.ts | `useAuth.ts`, `useFetchUsers.ts` |
| Context files | PascalCase.tsx | `AuthContext.tsx`, `ThemeContext.tsx` |
| Module folders | kebab-case | `user-dashboard/`, `admin-panel/` |
| Router files | PascalCaseRouter.tsx | `ReportsRouter.tsx`, `AdminRouter.tsx` |

### Code Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `const Button = () => {}` |
| Props interfaces | PascalCase + Props suffix | `interface ButtonProps {}` |
| Custom hooks | camelCase + use prefix | `const useAuth = () => {}` |
| Utility functions | camelCase | `const formatDate = () => {}` |
| Constants | SCREAMING_SNAKE_CASE | `const API_BASE_URL = '...'` |
| Types/Interfaces | PascalCase | `type User = {}`, `interface ApiResponse {}` |
| Enums | PascalCase | `enum UserRole { Admin, User }` |
| CSS classes | kebab-case | `.button-primary`, `.user-card` |
| data-testid values | kebab-case | `data-testid="submit-button"` |

### data-testid Naming Pattern

Use descriptive, hierarchical naming that indicates:
1. **Component context** (optional)
2. **Element purpose**
3. **Action/state** (if applicable)

**Pattern:** `[context]-[element]-[action/state]`

**Examples:**
```tsx
// Basic elements
<button data-testid="submit-button">Submit</button>
<input data-testid="email-input" />

// With context
<button data-testid="login-form-submit-button">Login</button>
<input data-testid="user-profile-name-input" />

// With state/variant
<div data-testid="modal-content-loading">...</div>
<button data-testid="delete-button-disabled">Delete</button>

// Lists and items
<ul data-testid="countries-list">
  <li data-testid="country-item-0">...</li>
  <li data-testid="country-item-1">...</li>
</ul>

// Actions
<button data-testid="add-row-button">Add</button>
<button data-testid="remove-row-button">Remove</button>
<button data-testid="country-edit-button">Edit</button>
```

**Guidelines:**
- Keep testids descriptive enough to potentially map to semantic queries later
- Use the actual element type in the name when possible: `-button`, `-input`, `-link`, `-checkbox`
- For form elements, include the field name: `email-input`, `password-input`
- For actions, include the verb: `add-`, `remove-`, `edit-`, `delete-`
- For lists, use index suffix: `-item-0`, `-item-1`
- Avoid generic names like `button-1`, `div-container`

---

## TypeScript Conventions

### tsconfig.json Strict Mode

Enable strict TypeScript checking:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Interface vs Type

**Use `interface` for:**
- Component props
- Object shapes that might be extended
- Public API contracts

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface User {
  id: string;
  name: string;
  email: string;
}
```

**Use `type` for:**
- Unions and intersections
- Utility type compositions
- Function signatures
- Primitives and literals

```tsx
import { MouseEvent } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type OnClick = (event: MouseEvent<HTMLButtonElement>) => void;
type UserWithTimestamps = User & { createdAt: Date; updatedAt: Date };
```

**Type Import Pattern:**
- Import specific types from 'react' (e.g., `MouseEvent`, `ReactNode`, `ComponentProps`)
- Avoid namespace imports (`React.MouseEvent`) - use named imports instead

### Props Type Definition

Always define props inline at the top of the component file:

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
  'data-testid': testId = 'button'
}: ButtonProps) {
  // component implementation
}
```

### Type File Organization

**lib/types/** - Agnostic shared types
```typescript
// lib/types/common.types.ts
export interface PaginationParams {
  page: number;
  limit: number;
}

export type SortOrder = 'asc' | 'desc';
```

**core/types/** - Business domain types
```typescript
// core/types/User.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Option 1: Using enum (traditional approach)
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}

// Option 2: Using const assertion (modern approach - preferred)
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const;

export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];

// Then use in interface:
// role: UserRole (with enum)
// role: UserRoleType (with const assertion)
```

**Enum vs Const Assertion:**
- **Use `enum`** when you need runtime object with reverse mapping or backward compatibility
- **Use `const` with `as const`** for better tree-shaking, smaller bundles, and more flexible types (modern preference)
- Choose one approach per project for consistency
- Const assertions provide better IDE autocomplete and are more aligned with modern TypeScript patterns

**core/types/api/** - API response types
```typescript
// core/types/api/users.types.ts
export interface GetUsersResponse {
  data: User[];
  pagination: PaginationMeta;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}
```

**Module types/** - Module-specific types
```typescript
// modules/reports/types/Report.types.ts
export interface Report {
  id: string;
  title: string;
  data: ReportData;
}
```

### Type Exports

Export types from barrel files for easy imports:

```typescript
// core/types/index.ts
export * from './User.types';
export * from './Product.types';
export * from './api';
```

**Usage:**
```typescript
import { User, UserRole, GetUsersResponse } from '@/core/types';
```

---

## Component Architecture

### Component File Structure

Every component lives in its own folder with all related files:

```
component-name/
├── ComponentName.tsx           # Component implementation
├── ComponentName.module.css    # Styles
├── ComponentName.stories.tsx   # Storybook stories
└── ComponentName.test.tsx      # Tests
```

### Component Template

```tsx
// Button.tsx
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'data-testid'?: string;
}

export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className,
  'data-testid': testId = 'button'
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[variant], className)}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {label}
    </button>
  );
}
```

**Important Notes:**
- **Don't use `React.FC`** - It's discouraged by the React team. Use regular function declarations or arrow functions with explicit typing.
- **Default parameters only work with `undefined`**, not `null`. If a prop is explicitly passed as `null`, the default won't apply.
- **Use `clsx` for className merging** - It handles conditional classes and falsy values better than template strings.

### Page Component Template

Pages follow the same structure but include additional concerns. **Pages should use default exports**, while reusable components use named exports.

```tsx
// ReportsListPage.tsx
import { useTranslation } from 'react-i18next';
import { useReports } from '@/core/services/reports';
import { ReportCard } from '../../components/report-card/ReportCard';
import styles from './ReportsListPage.module.css';

interface ReportsListPageProps {
  'data-testid'?: string;
}

export default function ReportsListPage({
  'data-testid': testId = 'reports-list-page'
}: ReportsListPageProps) {
  const { t } = useTranslation('reports');
  const { data: reports, isLoading, error } = useReports();

  if (isLoading) {
    return <div data-testid={`${testId}-loading`}>{t('loading')}</div>;
  }

  if (error) {
    return <div data-testid={`${testId}-error`}>{t('error')}</div>;
  }

  return (
    <div className={styles.container} data-testid={testId}>
      <h1 className={styles.title} data-testid={`${testId}-title`}>
        {t('title')}
      </h1>
      <div className={styles.grid} data-testid={`${testId}-list`}>
        {reports?.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            data-testid={`${testId}-report-item-${report.id}`}
          />
        ))}
      </div>
    </div>
  );
}
```

**Key Pattern Notes:**
- **Always use stable unique IDs for `key` prop**, not array indices
- **Pages use default export**, components use named export
- **Remove unused React import** - JSX transform no longer requires it

### Component Organization Rules

1. **One component per file** - No multiple exports of components
2. **Co-locate related files** - Keep component, styles, tests, and stories together
3. **Export only the component** - Don't export internal helper functions
4. **Props at the top** - Define interfaces before the component
5. **Default exports for pages** - Use named exports for reusable components

---

## State Management

### When to Use Each Pattern

| Pattern | Use Case | Example |
|---------|----------|---------|
| **Local State (useState)** | Component-specific UI state | Toggle, form input, accordion open/close |
| **React Context** | App-wide state, theme, auth | `AuthContext`, `ThemeContext` |
| **React Query** | Server state, API data | Fetching users, products, reports |
| **URL State (React Router)** | Shareable, bookmarkable state | Pagination, filters, tabs |
| **Form Libraries** | Complex form state | Multi-step forms, validation |

### Local State Pattern

Use for simple UI state:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
```

### Context Pattern

Create contexts in `core/context/` for global state:

```tsx
// core/context/AuthContext.tsx
import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { User } from '@/core/types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // Implementation
    // const user = await authAPI.login(email, password);
    // setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated: !!user
  }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Performance Notes:**
- **Always memoize context values** to prevent unnecessary re-renders of all consumers
- **Use `useCallback`** for functions in context to maintain referential stability
- **Use `useMemo`** for the context value object

### React Query Pattern

Define API hooks in `core/services/`:

```tsx
// core/services/users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, GetUsersResponse, CreateUserRequest } from '@/core/types';
import { apiClient } from './apiClient';

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get<GetUsersResponse>('/users');
      return response.data.data;
    }
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserRequest) => {
      const response = await apiClient.post<User>('/users', userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}
```

**Custom Hook Best Practices:**
- Use function declarations for consistency with component patterns
- Always prefix with `use` to follow React's Rules of Hooks
- Keep hooks focused on a single responsibility

**Usage in components:**

```tsx
const { data: users, isLoading, error } = useUsers();
const createUser = useCreateUser();

// Pattern 1: Using mutateAsync (when you need to handle errors or chain operations)
const handleCreateUserAsync = async () => {
  try {
    await createUser.mutateAsync({ name: 'John', email: 'john@example.com' });
    // Success handling (e.g., show toast, redirect)
  } catch (error) {
    // Error handling specific to this call
    console.error('Failed to create user:', error);
  }
};

// Pattern 2: Using mutate (fire-and-forget, onSuccess/onError in mutation config)
const handleCreateUser = () => {
  createUser.mutate({ name: 'John', email: 'john@example.com' });
};
```

**React Query Best Practices:**
- Use `mutateAsync` when you need to handle the result (errors, success) in the component
- Use `mutate` when mutation callbacks (`onSuccess`, `onError`) handle everything
- Always invalidate or update cache after mutations for data consistency

### URL State Pattern

Use React Router for shareable state:

```tsx
const [searchParams, setSearchParams] = useSearchParams();

const page = searchParams.get('page') || '1';

// ❌ This replaces ALL params
const setPageBad = (newPage: string) => {
  setSearchParams({ page: newPage }); // Loses other params!
};

// ✅ This preserves existing params
const setPage = (newPage: string) => {
  setSearchParams(prev => {
    prev.set('page', newPage);
    return prev;
  });
};

// ✅ Alternative: spread existing params
const setPageAlt = (newPage: string) => {
  setSearchParams({ ...Object.fromEntries(searchParams), page: newPage });
};
```

**URL State Best Practices:**
- Always preserve existing search params unless explicitly removing them
- Use the updater function pattern to avoid race conditions
- Consider using a helper hook for complex URL state management

---

## Styling with CSS Modules

### CSS Module Structure

Each component has a corresponding `.module.css` file:

```css
/* Button.module.css */
.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.primary {
  background-color: #007bff;
  color: white;
}

.primary:hover {
  background-color: #0056b3;
}

.secondary {
  background-color: #6c757d;
  color: white;
}

.secondary:hover {
  background-color: #545b62;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Applying CSS Modules

```tsx
import clsx from 'clsx';
import styles from './Button.module.css';

export function Button({ variant = 'primary', className }: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[variant], className)}>
      Click me
    </button>
  );
}
```

**Styling Best Practices:**
- Use `clsx` or `classnames` library for conditional class merging
- CSS Modules provide scoped styles automatically
- Consider enabling TypeScript support for CSS Modules (see Build Configuration section)

### Global Styles

Place global styles in `src/styles/`:

```
src/styles/
├── globals.css      # Global resets, fonts, CSS variables
├── variables.css    # CSS custom properties
└── utilities.css    # Utility classes
```

### CSS Variables

Define design tokens in CSS variables:

```css
/* styles/variables.css */
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
}
```

**Usage:**

```css
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}
```

---

## Testing Strategy

### Testing Philosophy

Use `data-testid` attributes with descriptive names that can facilitate future migration to user-centric queries. Structure testids to mirror semantic meaning.

### Test File Template

```tsx
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('should render with label', () => {
      render(<Button label="Click me" onClick={() => {}} />);

      const button = screen.getByTestId('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    it('should render primary variant by default', () => {
      render(<Button label="Click me" onClick={() => {}} />);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('primary');
    });

    it('should render secondary variant when specified', () => {
      render(<Button label="Click me" onClick={() => {}} variant="secondary" />);

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('secondary');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button label="Click me" onClick={handleClick} />);

      const button = screen.getByTestId('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button label="Click me" onClick={handleClick} disabled />);

      const button = screen.getByTestId('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button label="Click me" onClick={() => {}} disabled />);

      const button = screen.getByTestId('button');
      expect(button).toBeDisabled();
    });
  });

  describe('Custom testid', () => {
    it('should use custom data-testid when provided', () => {
      render(<Button label="Click me" onClick={() => {}} data-testid="custom-button" />);

      const button = screen.getByTestId('custom-button');
      expect(button).toBeInTheDocument();
    });
  });
});
```

**Testing Best Practices:**
- **Use `userEvent` instead of `fireEvent`** - It simulates real user interactions more accurately
- **Always await user events** - `userEvent` methods are async
- **Setup userEvent per test** - Call `userEvent.setup()` in each test for isolation

### Testing Components with React Query

```tsx
// ReportsListPage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReportsListPage } from './ReportsListPage';
import * as reportsService from '@/core/services/reports';

// Mock the service
jest.mock('@/core/services/reports');

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
};

const renderWithClient = (component: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ReportsListPage', () => {
  it('should show loading state initially', () => {
    jest.spyOn(reportsService, 'useReports').mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    } as any);

    renderWithClient(<ReportsListPage />);

    expect(screen.getByTestId('reports-list-page-loading')).toBeInTheDocument();
  });

  it('should render reports when data is loaded', async () => {
    const mockReports = [
      { id: '1', title: 'Report 1' },
      { id: '2', title: 'Report 2' }
    ];

    jest.spyOn(reportsService, 'useReports').mockReturnValue({
      data: mockReports,
      isLoading: false,
      error: null
    } as any);

    renderWithClient(<ReportsListPage />);

    await waitFor(() => {
      expect(screen.getByTestId('reports-list-page-report-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('reports-list-page-report-item-1')).toBeInTheDocument();
    });
  });

  it('should show error state when query fails', () => {
    jest.spyOn(reportsService, 'useReports').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch')
    } as any);

    renderWithClient(<ReportsListPage />);

    expect(screen.getByTestId('reports-list-page-error')).toBeInTheDocument();
  });
});
```

### Testing Context

```tsx
// AuthContext.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';

const TestComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      {user && <div data-testid="user-name">{user.name}</div>}
      <button data-testid="login-button" onClick={() => login('test@test.com', 'password')}>
        Login
      </button>
      <button data-testid="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  it('should start unauthenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
  });

  it('should authenticate user on login', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });
});
```

### Test Organization

Structure tests with `describe` blocks:

1. **Rendering** - Visual states, variants, conditional rendering
2. **Interactions** - Click handlers, form submissions, user actions
3. **States** - Loading, error, success, disabled states
4. **Integration** - Component interactions with services/context
5. **Edge Cases** - Boundary conditions, error scenarios

---

## Storybook Guidelines

### Story File Template

Create multiple variants showing different states and prop combinations:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary']
    },
    disabled: {
      control: 'boolean'
    },
    onClick: { action: 'clicked' }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default state
export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary'
  }
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    variant: 'secondary'
  }
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    variant: 'primary',
    disabled: true
  }
};

export const LongLabel: Story = {
  args: {
    label: 'This is a button with a very long label',
    variant: 'primary'
  }
};

// Interactive example
export const WithState: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <Button
        label={`Clicked ${count} times`}
        onClick={() => setCount(count + 1)}
        variant="primary"
      />
    );
  }
};
```

**Note:** Import `useState` from React (not `React.useState`) when using hooks in stories:
```tsx
import { useState } from 'react';
```

### Story Requirements

Each component should have stories for:

1. **Default state** - Component with default props
2. **All variants** - Each visual variant (primary, secondary, etc.)
3. **Interactive states** - Hover, active, focus, disabled
4. **Edge cases** - Long text, empty state, error state
5. **With props** - Different prop combinations
6. **Interactive controls** - ArgTypes for all props

### Page Stories

```tsx
// ReportsListPage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ReportsListPage } from './ReportsListPage';

const meta: Meta<typeof ReportsListPage> = {
  title: 'Pages/Reports/ReportsListPage',
  component: ReportsListPage,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false }
        }
      });

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    }
  ]
};

export default meta;
type Story = StoryObj<typeof ReportsListPage>;

export const Default: Story = {
  parameters: {
    mockData: {
      reports: [
        { id: '1', title: 'Q1 Report', status: 'completed' },
        { id: '2', title: 'Q2 Report', status: 'pending' }
      ]
    }
  }
};

// Alternative: Use render function for different states
export const Loading: Story = {
  decorators: [
    (Story) => {
      // Mock the hook to return loading state
      const MockedComponent = () => {
        const { t } = useTranslation('reports');
        return <div data-testid="reports-list-page-loading">{t('loading')}</div>;
      };
      return <MockedComponent />;
    }
  ]
};

export const WithError: Story = {
  decorators: [
    (Story) => {
      const MockedComponent = () => {
        const { t } = useTranslation('reports');
        return <div data-testid="reports-list-page-error">{t('error')}</div>;
      };
      return <MockedComponent />;
    }
  ]
};

export const Empty: Story = {
  parameters: {
    mockData: {
      reports: []
    }
  }
};
```

**Storybook Best Practices:**
- Use `decorators` for wrapping stories with providers or mock contexts
- Use `parameters` for configuration and mock data
- Avoid mixing testing library concerns (`jest.spyOn`) in stories
- For different data states, use `parameters.mockData` or component-specific render functions

---

## Internationalization

### Library: react-i18next

Use react-i18next for all user-facing text.

### Translation File Structure

```
public/locales/
├── en/
│   ├── common.json
│   ├── reports.json
│   └── users.json
└── es/
    ├── common.json
    ├── reports.json
    └── users.json
```

### Translation File Example

```json
// public/locales/en/reports.json
{
  "title": "Reports",
  "loading": "Loading reports...",
  "error": "Failed to load reports",
  "empty": "No reports found",
  "actions": {
    "create": "Create Report",
    "edit": "Edit",
    "delete": "Delete"
  }
}
```

### i18next Configuration

```tsx
// lib/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

export default i18n;
```

### Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

export default function ReportsListPage() {
  const { t } = useTranslation('reports');

  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('actions.create')}</button>
    </div>
  );
}
```

### Translation Keys in data-testid

Keep testids in English, but make them descriptive:

```tsx
<button data-testid="create-report-button">
  {t('actions.create')}
</button>
```

---

## Error Handling

### Error Boundary Implementation

Create error boundaries at module and app level.

#### App-level Error Boundary

```tsx
// core/components/error-boundary/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  'data-testid'?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service (e.g., Sentry, LogRocket)
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, 'data-testid': testId = 'error-boundary' } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className={styles.container} data-testid={`${testId}-error`}>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.message}>{error?.message}</p>
          <button
            className={styles.button}
            onClick={() => window.location.reload()}
            data-testid={`${testId}-reload-button`}
          >
            Reload page
          </button>
        </div>
      );
    }

    return children;
  }
}
```

**Error Boundary Notes:**
- Class components are still required for error boundaries in React 18
- React 19 introduces new error handling hooks, but class-based boundaries remain valid
- Always log errors to a monitoring service in production
- Consider different error UIs for different module contexts

#### Module-level Error Boundary

```tsx
// modules/reports/components/reports-error-boundary/ReportsErrorBoundary.tsx
import { ReactNode } from 'react';
import { ErrorBoundary } from '@/core/components/error-boundary/ErrorBoundary';
import styles from './ReportsErrorBoundary.module.css';

interface ReportsErrorBoundaryProps {
  children: ReactNode;
}

export function ReportsErrorBoundary({ children }: ReportsErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className={styles.container} data-testid="reports-error">
          <h2>Reports Error</h2>
          <p>There was an error loading the reports module.</p>
        </div>
      }
      data-testid="reports-error-boundary"
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Error Boundary Placement

```tsx
// App.tsx - Root level
<ErrorBoundary>
  <Router>
    <Routes>
      <Route path="/reports/*" element={
        <ReportsErrorBoundary>
          <ReportsRouter />
        </ReportsErrorBoundary>
      } />
    </Routes>
  </Router>
</ErrorBoundary>
```

### React Query Error Handling

```tsx
// Handle errors at component level
const { data, error, isError } = useReports();

if (isError) {
  return (
    <div className={styles.error} data-testid="reports-query-error">
      <p>Failed to load reports: {error.message}</p>
      <button onClick={() => refetch()} data-testid="retry-button">
        Retry
      </button>
    </div>
  );
}
```

---

## Build Configuration

### data-testid in Production

**Keep data-testid attributes in production builds** - do not strip them.

### Vite Configuration Example

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
});
```

### TypeScript CSS Modules Support

For better type safety with CSS Modules, add TypeScript plugin:

```json
// tsconfig.json
{
  "compilerOptions": {
    // ... other options
    "plugins": [
      {
        "name": "typescript-plugin-css-modules"
      }
    ]
  }
}
```

This provides autocomplete and type checking for CSS Module class names.

### Path Aliases

Configure TypeScript path aliases for cleaner imports:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/lib/*": ["src/lib/*"],
      "@/core/*": ["src/core/*"],
      "@/modules/*": ["src/modules/*"]
    }
  }
}
```

**Usage:**
```typescript
import { Button } from '@/lib/components/button/Button';
import { useAuth } from '@/core/context/AuthContext';
import { ReportsRouter } from '@/modules/reports/ReportsRouter';
```

---

## Required Libraries

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "@tanstack/react-query": "^5.x",
    "react-i18next": "^13.x",
    "i18next": "^23.x",
    "i18next-http-backend": "^2.x",
    "i18next-browser-languagedetector": "^7.x",
    "clsx": "^2.x"
  },
  "devDependencies": {
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "@testing-library/react": "^14.x",
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/user-event": "^14.x",
    "vitest": "^1.x",
    "@storybook/react": "^7.x",
    "@storybook/react-vite": "^7.x",
    "@storybook/addon-essentials": "^7.x",
    "@storybook/addon-interactions": "^7.x",
    "typescript": "^5.x",
    "typescript-plugin-css-modules": "^5.x"
  }
}
```

**Key Library Purposes:**
- **clsx** - Efficient className merging utility
- **@tanstack/react-query** - Server state management
- **react-i18next** - Internationalization
- **@testing-library/user-event** - Realistic user interaction simulation
- **typescript-plugin-css-modules** - Type safety for CSS Modules

### Testing Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/lib/test/setup.ts'],
    css: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

```typescript
// src/lib/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

---

## Complete Example: Country Table Feature

Given this specification:

> A header that says "Countries", a table with 5 rows and 4 columns displaying country information (name, capital, population, region), and two buttons: one to add rows and one to remove them.

### Generated Structure

```
modules/
└── countries/
    ├── components/
    │   ├── country-table/
    │   │   ├── CountryTable.tsx
    │   │   ├── CountryTable.module.css
    │   │   ├── CountryTable.stories.tsx
    │   │   └── CountryTable.test.tsx
    │   └── country-row/
    │       ├── CountryRow.tsx
    │       ├── CountryRow.module.css
    │       ├── CountryRow.stories.tsx
    │       └── CountryRow.test.tsx
    ├── pages/
    │   └── countries-page/
    │       ├── CountriesPage.tsx
    │       ├── CountriesPage.module.css
    │       ├── CountriesPage.stories.tsx
    │       └── CountriesPage.test.tsx
    ├── types/
    │   └── Country.types.ts
    └── CountriesRouter.tsx
```

### Implementation Files

#### Country.types.ts

```typescript
// modules/countries/types/Country.types.ts
export interface Country {
  id: string;
  name: string;
  capital: string;
  population: number;
  region: string;
}
```

#### CountriesPage.tsx

```tsx
// modules/countries/pages/countries-page/CountriesPage.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { CountryTable } from '../../components/country-table/CountryTable';
import { Country } from '../../types/Country.types';
import styles from './CountriesPage.module.css';

const INITIAL_COUNTRIES: Country[] = [
  { id: '1', name: 'United States', capital: 'Washington D.C.', population: 331000000, region: 'Americas' },
  { id: '2', name: 'Japan', capital: 'Tokyo', population: 126000000, region: 'Asia' },
  { id: '3', name: 'Germany', capital: 'Berlin', population: 83000000, region: 'Europe' },
  { id: '4', name: 'Brazil', capital: 'Brasília', population: 213000000, region: 'Americas' },
  { id: '5', name: 'Australia', capital: 'Canberra', population: 26000000, region: 'Oceania' }
];

interface CountriesPageProps {
  'data-testid'?: string;
}

export default function CountriesPage({
  'data-testid': testId = 'countries-page'
}: CountriesPageProps) {
  const { t } = useTranslation('countries');
  const [countries, setCountries] = useState<Country[]>(INITIAL_COUNTRIES);

  const handleAddRow = () => {
    const newCountry: Country = {
      id: `${Date.now()}`,
      name: 'New Country',
      capital: 'New Capital',
      population: 0,
      region: 'Unknown'
    };
    setCountries([...countries, newCountry]);
  };

  const handleRemoveRow = () => {
    if (countries.length > 0) {
      setCountries(countries.slice(0, -1));
    }
  };

  return (
    <div className={styles.container} data-testid={testId}>
      <header className={styles.header}>
        <h1 className={styles.title} data-testid={`${testId}-title`}>
          {t('title')}
        </h1>
        <div className={styles.actions}>
          <button
            className={clsx(styles.addButton, styles.button)}
            onClick={handleAddRow}
            data-testid={`${testId}-add-button`}
          >
            {t('actions.addRow')}
          </button>
          <button
            className={clsx(styles.removeButton, styles.button)}
            onClick={handleRemoveRow}
            disabled={countries.length === 0}
            data-testid={`${testId}-remove-button`}
          >
            {t('actions.removeRow')}
          </button>
        </div>
      </header>

      <CountryTable
        countries={countries}
        data-testid={`${testId}-table`}
      />
    </div>
  );
}
```

#### CountryTable.tsx

```tsx
// modules/countries/components/country-table/CountryTable.tsx
import { useTranslation } from 'react-i18next';
import { Country } from '../../types/Country.types';
import { CountryRow } from '../country-row/CountryRow';
import styles from './CountryTable.module.css';

interface CountryTableProps {
  countries: Country[];
  'data-testid'?: string;
}

export function CountryTable({
  countries,
  'data-testid': testId = 'country-table'
}: CountryTableProps) {
  const { t } = useTranslation('countries');

  return (
    <table className={styles.table} data-testid={testId}>
      <thead>
        <tr data-testid={`${testId}-header-row`}>
          <th data-testid={`${testId}-header-name`}>{t('table.name')}</th>
          <th data-testid={`${testId}-header-capital`}>{t('table.capital')}</th>
          <th data-testid={`${testId}-header-population`}>{t('table.population')}</th>
          <th data-testid={`${testId}-header-region`}>{t('table.region')}</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((country) => (
          <CountryRow
            key={country.id}
            country={country}
            data-testid={`${testId}-row-${country.id}`}
          />
        ))}
      </tbody>
    </table>
  );
}
```

#### CountriesPage.test.tsx

```tsx
// modules/countries/pages/countries-page/CountriesPage.test.tsx
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import CountriesPage from './CountriesPage';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('CountriesPage', () => {
  describe('Rendering', () => {
    it('should render title', () => {
      render(<CountriesPage />);
      expect(screen.getByTestId('countries-page-title')).toBeInTheDocument();
    });

    it('should render add and remove buttons', () => {
      render(<CountriesPage />);
      expect(screen.getByTestId('countries-page-add-button')).toBeInTheDocument();
      expect(screen.getByTestId('countries-page-remove-button')).toBeInTheDocument();
    });

    it('should render table with 5 initial rows', () => {
      render(<CountriesPage />);
      expect(screen.getByTestId('countries-page-table-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('countries-page-table-row-5')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should add a row when add button is clicked', async () => {
      const user = userEvent.setup();
      render(<CountriesPage />);

      await user.click(screen.getByTestId('countries-page-add-button'));

      // New row will have a timestamp-based ID
      const rows = screen.getAllByTestId(/countries-page-table-row-/);
      expect(rows).toHaveLength(6);
    });

    it('should remove a row when remove button is clicked', async () => {
      const user = userEvent.setup();
      render(<CountriesPage />);

      await user.click(screen.getByTestId('countries-page-remove-button'));

      expect(screen.queryByTestId('countries-page-table-row-5')).not.toBeInTheDocument();
      const rows = screen.getAllByTestId(/countries-page-table-row-/);
      expect(rows).toHaveLength(4);
    });

    it('should disable remove button when no rows exist', async () => {
      const user = userEvent.setup();
      render(<CountriesPage />);

      // Remove all rows
      const removeButton = screen.getByTestId('countries-page-remove-button');
      for (let i = 0; i < 5; i++) {
        await user.click(removeButton);
      }

      expect(removeButton).toBeDisabled();
    });
  });

  describe('States', () => {
    it('should handle multiple additions', async () => {
      const user = userEvent.setup();
      render(<CountriesPage />);

      const addButton = screen.getByTestId('countries-page-add-button');
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);

      const rows = screen.getAllByTestId(/countries-page-table-row-/);
      expect(rows).toHaveLength(8);
    });
  });
});
```

#### CountriesPage.stories.tsx

```tsx
// modules/countries/pages/countries-page/CountriesPage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CountriesPage } from './CountriesPage';

const meta: Meta<typeof CountriesPage> = {
  title: 'Pages/Countries/CountriesPage',
  component: CountriesPage,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;
type Story = StoryObj<typeof CountriesPage>;

export const Default: Story = {};

export const WithCustomTestId: Story = {
  args: {
    'data-testid': 'custom-countries-page'
  }
};
```

---

## Summary Checklist

When implementing a feature using this architecture, ensure:

### File Organization
- [ ] Files follow naming conventions (PascalCase components, kebab-case folders)
- [ ] Each component has its own folder with .tsx, .module.css, .test.tsx, and .stories.tsx
- [ ] Components are organized in lib/, core/, or modules/ appropriately
- [ ] Module routers are created for page groups

### TypeScript & Types
- [ ] TypeScript strict mode is enabled and all types are properly defined
- [ ] Props interfaces are defined inline at the top of component files
- [ ] Named imports for React types (e.g., `MouseEvent`, not `React.MouseEvent`)
- [ ] Use `interface` for props, `type` for unions and intersections

### Component Patterns
- [ ] Function declarations (`export function Component`) not arrow functions
- [ ] Named exports for components, default exports for pages
- [ ] No `React.FC` usage anywhere
- [ ] No unnecessary React imports (modern JSX transform)
- [ ] Custom hooks use function declarations (`export function useCustomHook`)

### Styling
- [ ] CSS Modules are used for styling with descriptive class names
- [ ] `clsx` library used for className merging
- [ ] CSS custom properties used for design tokens

### Internationalization
- [ ] All user-facing text uses react-i18next translations
- [ ] Translation keys are organized by module/feature

### Testing
- [ ] data-testid attributes are added with descriptive, hierarchical names
- [ ] Tests use `userEvent` instead of `fireEvent`
- [ ] All user events are properly awaited
- [ ] Tests cover rendering, interactions, states, and edge cases

### Storybook
- [ ] Stories show default, variants, and edge cases
- [ ] Multiple story variants per component
- [ ] No test library concerns (`jest.spyOn`) mixed in stories
- [ ] Use `decorators` for providers and contexts

### State Management
- [ ] React Query is used for server state with hooks in core/services/
- [ ] Context values are memoized with `useMemo`
- [ ] Context functions use `useCallback`
- [ ] URL state preserves existing search params

### Performance
- [ ] Stable unique IDs used for `key` props (never array indices)
- [ ] Context values properly memoized to prevent re-renders

### Error Handling
- [ ] Error boundaries are implemented at appropriate levels
- [ ] Error boundaries log to monitoring service

### Build Configuration
- [ ] Path aliases (@/) are used for imports
- [ ] TypeScript plugin for CSS Modules configured (optional)

---

## LLM Usage Instructions

When an LLM receives this document along with a feature specification:

1. **Parse the specification** - Identify components, pages, state needs, and interactions
2. **Determine module structure** - Decide if it's a new module or fits in existing structure
3. **Generate file structure** - Create the folder/file tree following conventions
4. **Implement types first** - Define TypeScript interfaces for data structures
5. **Build components bottom-up** - Start with atomic components, then compositions
6. **Add translations** - Create i18n keys for all text
7. **Write tests** - Cover all scenarios described in the specification
8. **Create stories** - Show variants and edge cases in Storybook
9. **Implement pages** - Compose components into complete pages
10. **Create router** - Set up routing if needed

The LLM should generate **complete, production-ready code** that follows all conventions in this document without requiring further clarification.
