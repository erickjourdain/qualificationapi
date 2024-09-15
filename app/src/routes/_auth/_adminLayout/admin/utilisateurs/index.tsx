import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import Utilisateurs from "@components/admin/Utilisateurs";
import ServerError from "@/components/ServerError";
import { getUsers } from "@/utils/apiCall";
import { UsersAPI } from "@/gec-tripetto";

const formSearchSchema = z.object({
  page: z.optional(z.number()),
});

type FormSearchSchema = z.infer<typeof formSearchSchema>;

export const Route = createFileRoute("/_auth/_adminLayout/admin/utilisateurs/")(
  {
    beforeLoad: ({ context }) => {
      if (!context.auth.isAdmin) throw redirect({ to: "/forbidden" });
    },
    component: Utilisateurs,
    validateSearch: (search: Record<string, unknown>): FormSearchSchema =>
      formSearchSchema.parse(search),
    loaderDeps: ({ search }) => ({
      page: search.page || 1,
    }),
    loader: async ({ deps, context }) => {
      const { data } = await context.queryClient.fetchQuery({
        queryKey: ["users", deps.page],
        queryFn: () => {
          const include = ["id", "prenom", "nom", "validated", "role", "locked", "slug"];
          return getUsers(null, include, deps.page);
        }
      });
      return data as UsersAPI;
    },
    errorComponent: ({ error }) => {
      return <ServerError error={error} />;
    },
  },
);
