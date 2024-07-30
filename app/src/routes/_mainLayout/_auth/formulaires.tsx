import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import Formulaires from '@components/Formulaires';
import { getForms } from '@/utils/apiCall';
import { FormsAPI } from '@/gec-tripetto';

const formSearchSchema = z.object({
  page: z.optional(z.number()),
  search: z.optional(z.string()),
});

type FormSearchSchema = z.infer<typeof formSearchSchema>

export const Route = createFileRoute('/_mainLayout/_auth/formulaires')({
  component: () => <Formulaires />,
  validateSearch: (search: Record<string, unknown>): FormSearchSchema => formSearchSchema.parse(search),
  loaderDeps: ({ search }) => ({ page: search.page || 1, search: search.search || null }),
  loader: async ({ deps, context }) => {
    const { data } = await context.queryClient.fetchQuery({
      queryKey: ["getForms"],
      queryFn: () => getForms(null, (deps) ? deps.page : 1),
    });
    return data as FormsAPI;
  },
  onError: ({ error }) => {
    console.error(error);
  }
})