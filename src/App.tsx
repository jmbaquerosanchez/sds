import { Footer, Header } from "compositions";
import { AllProviders, useAuth } from "data";
import { Demo } from "./ds/examples/Demo";
import { FAQs } from "./ds/examples/FAQs";
import { PanelSections } from "./ds/examples/PanelSections";
import { PricingGrid } from "./ds/examples/PricingGrid";
import { ProductDetails } from "./ds/examples/ProductDetails";
import { ProductGrid } from "./ds/examples/ProductGrid";
import { WelcomeHero } from "./ds/examples/WelcomeHero";

function AppContent() {
  const { user, login, logout } = useAuth();

  return (
    <>
      <Header user={user} login={login} logout={logout} />
      <Demo />
      <WelcomeHero />
      <PanelSections />
      <PricingGrid />
      <FAQs />
      <ProductDetails />
      <ProductGrid />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AllProviders>
      <AppContent />
    </AllProviders>
  );
}

export default App;
