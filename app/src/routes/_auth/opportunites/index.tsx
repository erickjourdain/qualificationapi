import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { sfLike, sfOr } from "spring-filter-query-builder";
import Liste from "@/components/opportunites/Liste";
import { HeadersAPI } from "@/gec-tripetto";
import { getHeaders } from "@/utils/apiCall";
import ServerError from "@/components/ServerError";

const formSearchSchema = z.object({
  page: z.optional(z.number()),
  search: z.optional(z.string()),
});

type FormSearchSchema = z.infer<typeof formSearchSchema>;

export const Route = createFileRoute("/_auth/opportunites/")({
  component: Liste,
  validateSearch: (search: Record<string, unknown>): FormSearchSchema =>
    formSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({
    page: search.page || 1,
    search: search.search || "",
  }),
  loader: async ({ deps, context }) => {
    const { data } = await context.queryClient.fetchQuery({
      queryKey: ["opportunites", deps.page, deps.search],
      queryFn: () => {
        let filter = "";
        const include = [
          "id",
          "uuid",
          "societe",
          "nom",
          "prenom",
          "createur",
          "projet",
          "opportunite",
          "createdAt",
        ];
        if (deps.search && deps.search.length) {
          filter = sfOr([
            sfLike("projet", deps.search),
            sfLike("opportunite", deps.search),
            sfLike("societe", deps.search),
          ]).toString();
        }
        return getHeaders(deps ? deps.page : 1, filter, include);
      },
    });
    return data as HeadersAPI;
  },
  errorComponent: ({ error }) => {
    return <ServerError error={error} />;
  },
});
