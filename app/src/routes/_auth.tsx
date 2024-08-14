import { useEffect } from "react";
import { useAtom } from "jotai";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { sfEqual } from "spring-filter-query-builder";
import Loading from "@/components/Loading";
import ServerError from "@/components/ServerError";
import { router } from "@/App";
import { getCurrentUser, getForms, setAuthorisation } from "@/utils/apiCall";
import { useAuth } from "@/hooks/auth";
import { FormAPI, FormsAPI, User } from "@/gec-tripetto";
import { formsAtom } from "@/stores/mainStore";

export const Route = createFileRoute("/_auth")({
  loader: async ({ context }) => {
    if (context.auth.user) return context.auth.user;
    const token = localStorage.getItem("token") || null;
    if (token) {
      setAuthorisation(token);
      const { data: user } = await context.queryClient.fetchQuery({
        queryKey: ["currenUser", token],
        queryFn: getCurrentUser,
      });
      return user as User;
    } else throw redirect({ to: "/login" });
  },
  onError: () => {
    throw redirect({ to: "/login" });
  },
  component: Auth,
});

function Auth() {
  // Hook de gestion des autorisations
  const auth = useAuth();
  // Hook de stockage des formulaires
  const [formulaires, setFormulaires] = useAtom(formsAtom);
  // Hook de récupération des données
  const user = Route.useLoaderData();

  // Mise à jour des données utilisateurs
  useEffect(() => {
    async function login() {
      await auth.login(user);
      await router.invalidate();
    }
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Chargement des formulaires dans la session
  const { data, hasNextPage, fetchNextPage, error, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["getFormulaires"],
      queryFn: async ({ pageParam }) => {
        const filter = sfEqual("valide", "true").toString();
        const formulaires = await getForms(filter, pageParam);
        return formulaires.data as FormsAPI;
      },
      initialPageParam: 1,
      getNextPageParam: (forms: FormsAPI) =>
        forms.hasNext ? forms.page + 1 : undefined,
    });

  // Mise à jour du tableau des produits suite récupération des données
  useEffect(() => {
    const forms: FormAPI[] = [];
    data?.pages.map((f) =>
      f.data.map((data) => {
        forms.push(data);
      }),
    );
    setFormulaires(forms);
    if (hasNextPage) fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Sauvegarde des formaulaires dans la session
  useEffect(() => {
    sessionStorage.setItem("formualaires", JSON.stringify(formulaires));
  }, [formulaires]);

  if (isLoading) return <Loading />;

  if (isError) return <ServerError error={error} />;

  return <Outlet />;
}
