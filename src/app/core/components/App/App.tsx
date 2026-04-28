import { AppHeader } from "app/core/components/AppHeader/AppHeader";
import { useAuth } from "app/core/hooks";
import { AllProviders } from "app/core/providers";
import { ROUTES } from "app/core/router/routes";
import AboutPage from "app/modules/about/pages/AboutPage";
import ContactPage from "app/modules/contact/pages/ContactPage";
import PricingPage from "app/modules/pricing/pages/PricingPage";
import ProductDetailsPage from "app/modules/products/pages/ProductDetailsPage";
import ProductsPage from "app/modules/products/pages/ProductsPage";
import WaitingListPage from "app/modules/waiting-list/pages/WaitingListPage";
import { Footer } from "compositions";
import { Section } from "layout";
import { Text } from "primitives";
import type { ComponentType } from "react";
import type { RouteComponentProps, RouteProps } from "react-router-dom";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

type ProtectedRouteProps = RouteProps & {
  isAuthenticated: boolean;
  redirectPath?: string;
  component: ComponentType<RouteComponentProps>;
};

function ProtectedRoute({
  component: Component,
  isAuthenticated,
  redirectPath = ROUTES.HOME,
  ...routeProps
}: ProtectedRouteProps) {
  return (
    <Route
      {...routeProps}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={redirectPath} />
        )
      }
    />
  );
}

function AppContent() {
  const { user, login, logout, isHydrated } = useAuth();
  const isAuthenticated = Boolean(user);

  return (
    <>
      <AppHeader user={user} login={login} logout={logout} />
      {isHydrated ? (
        <Switch>
          <Redirect exact from={ROUTES.HOME} to={ROUTES.ABOUT} />
          <Route path={ROUTES.CONTACT} component={ContactPage} />
          <Route path={ROUTES.ABOUT} component={AboutPage} />
          <Route path={ROUTES.PRICING} component={PricingPage} />
          <ProtectedRoute
            path={ROUTES.PRODUCT_DETAILS}
            component={ProductDetailsPage}
            isAuthenticated={isAuthenticated}
          />
          <ProtectedRoute
            exact
            path={ROUTES.PRODUCTS}
            component={ProductsPage}
            isAuthenticated={isAuthenticated}
          />
          <Route path={ROUTES.WAITING_LIST} component={WaitingListPage} />
        </Switch>
      ) : (
        <Section padding="1600" data-testid="app-hydrating">
          <Text>Loading your workspace...</Text>
        </Section>
      )}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AllProviders>
        <AppContent />
      </AllProviders>
    </BrowserRouter>
  );
}

export default App;
