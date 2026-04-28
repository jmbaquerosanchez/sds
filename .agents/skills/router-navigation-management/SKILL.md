# SKILL: React Router Navigation Management

## Quick Reference

**Stack**: `BrowserRouter` → `AllProviders` → `AppContent` → `Switch` with `Route`/`ProtectedRoute`  
**Router**: React Router v5  
**Auth Gate**: `ProtectedRoute` wrapper checks `isAuthenticated`  
**Hydration**: Wait for `useAuth().isHydrated === true` before rendering routes

### Key Files

- Routes: [src/app/core/components/App/App.tsx](../core/components/App/App.tsx)
- Constants: [src/app/core/router/routes.ts](../core/router/routes.ts)
- Header Nav: [src/app/core/components/AppHeader/AppHeader.tsx](../core/components/AppHeader/AppHeader.tsx)

## Use Cases

Adding routes | Protected routes | Navigation links | Dynamic routes | Programmatic navigation

## Current Routes

| Path            | Constant                 | Component            | Access        | Module                                                                    |
| --------------- | ------------------------ | -------------------- | ------------- | ------------------------------------------------------------------------- |
| `/`             | `ROUTES.HOME`            | N/A                  | Public        | Redirects to `/about`                                                     |
| `/about`        | `ROUTES.ABOUT`           | `AboutPage`          | Public        | [modules/about](../modules/about/pages/AboutPage.tsx)                     |
| `/contact-us`   | `ROUTES.CONTACT`         | `ContactPage`        | Public        | [modules/contact](../modules/contact/pages/ContactPage.tsx)               |
| `/pricing`      | `ROUTES.PRICING`         | `PricingPage`        | Public        | [modules/pricing](../modules/pricing/pages/PricingPage.tsx)               |
| `/products`     | `ROUTES.PRODUCTS`        | `ProductsPage`       | **Protected** | [modules/products](../modules/products/pages/ProductsPage.tsx)            |
| `/products/:id` | `ROUTES.PRODUCT_DETAILS` | `ProductDetailsPage` | **Protected** | [modules/products](../modules/products/pages/ProductDetailsPage.tsx)      |
| `/waiting-list` | `ROUTES.WAITING_LIST`    | `WaitingListPage`    | Public        | [modules/waiting-list](../modules/waiting-list/pages/WaitingListPage.tsx) |

## Implementation Patterns

### 1. Add Public Route

```typescript
// 1. Define constant in src/app/core/router/routes.ts
export const ROUTES = {
  NEW_FEATURE: "/new-feature",
};

// 2. Register in App.tsx inside Switch
<Route path={ROUTES.NEW_FEATURE} component={NewFeaturePage} />

// 3. Add to header navigation
<Link to={ROUTES.NEW_FEATURE}>New Feature</Link>
```

### 2. Add Protected Route

```typescript
// Same as public, but use ProtectedRoute
<ProtectedRoute
  path={ROUTES.NEW_FEATURE}
  component={NewFeaturePage}
  isAuthenticated={isAuthenticated}
  redirectPath={ROUTES.ABOUT}
/>
```

### 3. Dynamic Routes with Parameters

```typescript
// Define: PRODUCT_DETAILS: '/products/:id'

// Build URL:
const url = ROUTES.PRODUCT_DETAILS.replace(":id", productId);

// Access params:
const { id } = useParams<{ id: string }>();
```

### 4. Programmatic Navigation

```typescript
const history = useHistory();

// Navigate
history.push(ROUTES.PRODUCTS);

// With state
history.push(url, { from: "search" });

// Go back
history.goBack();
```

### 5. Conditional Navigation

```typescript
const { isAuthenticated } = useAuth();

{isAuthenticated ? (
  <Link to={ROUTES.PRODUCTS}>Products</Link>
) : (
  <Link to={ROUTES.WAITING_LIST}>Join</Link>
)}
```

### 6. Active Route Detection

```typescript
const { pathname } = useLocation();
const isActive = pathname === ROUTES.ABOUT;
```

## Rules

### ✅ Required

- Use route constants from `routes.ts`
- Export page components as default
- Use `<Link to>` not `<a href>`
- Place pages in `src/app/modules/<feature>/pages`
- Use `.replace()` for dynamic URL segments
- Wait for `isHydrated` before rendering protected routes

### ❌ Forbidden

- Hardcoding paths
- Skipping ProtectedRoute wrapper for auth pages
- Mixing React Router versions
- Creating routes in DS demo ([src/App.tsx](../../App.tsx))

## Troubleshooting

| Issue                                | Cause                               | Solution                                              |
| ------------------------------------ | ----------------------------------- | ----------------------------------------------------- |
| Protected route redirects on refresh | Routes render before auth hydration | Verify `AppContent` checks `isHydrated`               |
| 404 on direct URL in production      | Server doesn't rewrite deep links   | Configure hosting to serve `index.html` for all paths |
| Route doesn't match                  | Order in `Switch` matters           | Place specific routes before generic ones             |
| Link doesn't navigate                | Using `<a href>`                    | Use `<Link to>` from `react-router-dom`               |

## ProtectedRoute Implementation

```typescript
// From App.tsx
interface ProtectedRouteProps extends RouteProps {
  isAuthenticated: boolean;
  redirectPath?: string;
}

function ProtectedRoute({
  component: Component,
  isAuthenticated,
  redirectPath = ROUTES.HOME,
  ...rest
}: ProtectedRouteProps) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to={redirectPath} />
      }
    />
  );
}
```

## Change Checklist

When adding/modifying routes:

- [ ] Add constant to `routes.ts`
- [ ] Create page in `src/app/modules/<feature>/pages`
- [ ] Register in `App.tsx` with correct access level
- [ ] Add navigation link if needed
- [ ] Test direct URL access (hard refresh)
- [ ] Test auth protection if protected route
- [ ] Update route table in this SKILL
- [ ] Verify route order in `Switch`
