import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Combined provider that wraps all SDS providers in the correct order
 * Use this at the root of your application to enable all SDS features
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <AllProviders>
 *       <YourApp />
 *     </AllProviders>
 *   );
 * }
 * ```
 */
export function AllProviders({ children }: { children?: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

/**
 * Alternative provider composition for apps that only need specific features
 *
 * @example
 * ```tsx
 * // E-commerce app with auth and products
 * function EcommerceApp() {
 *   return (
 *     <AuthProvider>
 *       <ShoppingApp />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
