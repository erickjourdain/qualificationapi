import { QueryClient } from "@tanstack/react-query";
import { AppAuthContext } from "./appAuthContext";

export interface AppRouterContext {
  queryClient: QueryClient;
  auth: AppAuthContext;
}
