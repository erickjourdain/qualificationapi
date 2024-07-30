import { QueryClient } from "@tanstack/react-query";
import { User } from "./user";

export interface AppRouterContext {
  queryClient: QueryClient,
  user: User | null,
}
