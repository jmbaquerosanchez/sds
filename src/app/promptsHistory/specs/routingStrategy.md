# Routing Strategy

## 1. Overview

- **Router stack**: The production app is mounted in [src/main.tsx](../../main.tsx) and renders [src/app/core/components/App/App.tsx](../core/components/App/App.tsx). Routing is powered by `react-router-dom` v5 (`BrowserRouter`, `Switch`, `Route`, `Redirect`).
- **Providers first, router second**: `BrowserRouter` wraps the entire tree; inside it, `AllProviders` registers auth, data, and feature contexts so hooks like `useAuth()` can safely run inside route components.
- **Persistent layout**: `AppHeader` and `Footer` live outside `Switch`, guaranteeing a consistent shell across every path. Only the middle slot changes per route.
- **Auth hydration gate**: Before rendering any route, `AppContent` waits for `AuthProvider` to finish hydrating the stored session; until then it renders a placeholder section so protected routes don’t mis-fire redirects on hard refreshes.
- **Design-system demo app**: The legacy [src/App.tsx](../../App.tsx) is just a design-system showcase and is **not** part of the routed experience; ignore it when modifying navigation logic.

## 2. Route Inventory

Keep this table synchronized with the live router. Every time a path, component, or access rule changes, update the inventory in the same pull request so downstream consumers stay accurate.
| Path | Constant | Component | Module Location | Access | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | `ROUTES.HOME` | N/A | N/A | Public | Immediate redirect to `/about` to keep deeper links canonical.
| `/about` | `ROUTES.ABOUT` | `AboutPage` | [src/app/modules/about/pages/AboutPage.tsx](../modules/about/pages/AboutPage.tsx) | Public | Primary marketing overview page; becomes the effective landing route.
| `/contact-us` | `ROUTES.CONTACT` | `ContactPage` | [src/app/modules/contact/pages/ContactPage.tsx](../modules/contact/pages/ContactPage.tsx) | Public | Uses shared form primitives; no special guards.
| `/pricing` | `ROUTES.PRICING` | `PricingPage` | [src/app/modules/pricing/pages/PricingPage.tsx](../modules/pricing/pages/PricingPage.tsx) | Public | Pure content route, ideal place to upsell upgrades before auth.
| `/products` | `ROUTES.PRODUCTS` | `ProductsPage` | [src/app/modules/products/pages/ProductsPage.tsx](../modules/products/pages/ProductsPage.tsx) | **Protected** | Wrapped by `ProtectedRoute`; requires `useAuth().user` truthy.
| `/products/:id` | `ROUTES.PRODUCT_DETAILS` | `ProductDetailsPage` | [src/app/modules/products/pages/ProductDetailsPage.tsx](../modules/products/pages/ProductDetailsPage.tsx) | **Protected** | Detailed view with add-to-cart flow, reviews, and newsletter form.
| `/waiting-list` | `ROUTES.WAITING_LIST` | `WaitingListPage` | [src/app/modules/waiting-list/pages/WaitingListPage.tsx](../modules/waiting-list/pages/WaitingListPage.tsx) | Public | Collects emails pre-launch; open to everyone.

## 3. Routing Mechanics

### 3.1 Router composition

1. `BrowserRouter` manages history (HTML5 pushState) so deep links work on refresh if the host server rewrites to `index.html`.
2. `AllProviders` supplies app-wide contexts (auth, pricing, products). Every route component can call hooks from `app/core/hooks` without re-registering providers.
3. `AppContent` draws the persistent header/footer and, once `useAuth().isHydrated` is truthy, renders the `Switch` with ordered routes. While hydration runs, it shows a lightweight loading section to prevent premature redirects.

### 3.2 Public routes

- Defined with `<Route path={ROUTES.X} component={Page} />`.
- Route ordering matters because `Switch` returns the first match.
- Components live under `src/app/modules/<feature>/pages`. Co-locating maintains domain boundaries (feature owns its page).

### 3.3 Protected routes

- `ProtectedRoute` (declared inside [App.tsx](../core/components/App/App.tsx)) extends `RouteProps` with `isAuthenticated` and optional `redirectPath`.
- It renders the target component when `isAuthenticated` is truthy; otherwise it issues `<Redirect to={redirectPath}>` (defaults to `/`).
- Authentication source: `useAuth()` from `app/core/hooks` (fed by `AllProviders`). Logging in/out happens through `AppHeader` actions, so auth state is centralized.
- Route evaluation only happens after `isHydrated` is true, guaranteeing that storage-backed sessions are respected even on direct URL entries.
- Currently only `/products` and `/products/:id` are gated, but the helper can wrap any route that should require auth.

### 3.4 Redirect behavior

- Visiting `/` triggers `Redirect exact from={ROUTES.HOME} to={ROUTES.ABOUT}` ensuring analytics and bookmarks point to `/about`.
- There is **no** catch-all (`*`) route yet, so unknown paths render nothing. If you add one, place it last in the `Switch`.

### 3.5 Building deep links

- Prefer string helpers over hardcoded paths when generating links. For example, [ProductsGrid](../modules/products/components/ProductsGrid/ProductsGrid.tsx) builds detail URLs with `ROUTES.PRODUCT_DETAILS.replace(":id", product.id)` so the list and router stay in sync.
- When adding new dynamic routes, expose template strings (e.g., `/resources/:resourceId`) through `ROUTES` and follow the same `replace` pattern or wrap it in a small helper function if used broadly.

## 4. Extending the Router

1. **Add a constant** in [src/app/core/router/routes.ts](../core/router/routes.ts) to keep path strings centralized.
2. **Create a page** under `src/app/modules/<feature>/pages` so feature logic stays modular. Export the page as a default export.
3. **Register the route** inside `AppContent`:
   - Public: `<Route path={ROUTES.NEW} component={NewPage} />`
   - Auth-only: `<ProtectedRoute path={ROUTES.NEW} component={NewPage} isAuthenticated={isAuthenticated} redirectPath={ROUTES.ABOUT} />`
4. **Update navigation UI** (e.g., `AppHeader` menus) so users can reach the new route; the router itself will still work without this, but UX will suffer.
5. **Consider redirects** whenever you replace an existing path—add `<Redirect>` entries before the rest of the `Switch` to avoid flicker.

## 5. Constraints & Future Work

- **React Router v5**: Because we rely on `Switch` and `component` props, migrating to v6 would require `Routes` + `element` changes plus updating `ProtectedRoute` to wrap `ElementType` children. Plan a dedicated upgrade before mixing APIs.
- **No 404 / fallback**: Add a final `<Route component={NotFoundPage} />` once a design exists.
- **SSR compatibility**: Current setup assumes a single-page app served via Vite dev server or static hosting with rewrite support. If SSR is needed, routing logic must move server-side or adopt `StaticRouter`.
- **Nested layouts**: Everything currently shares a single shell. Introduce nested routers or layout routes if feature-specific chrome becomes necessary.

## 6. Quick Reference

- **Entry point**: [src/main.tsx](../../main.tsx)
- **Router config**: [src/app/core/components/App/App.tsx](../core/components/App/App.tsx)
- **Route constants**: [src/app/core/router/routes.ts](../core/router/routes.ts)
- **Auth hook**: [src/app/core/hooks/useAuth.ts](../core/hooks/useAuth.ts)
- **Providers**: [src/app/core/providers/AllProviders.tsx](../core/providers/AllProviders.tsx)

Use this document as the single source of truth for how navigation currently works and how to evolve it safely.
