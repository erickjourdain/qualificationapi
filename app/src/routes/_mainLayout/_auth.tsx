import { useEffect } from 'react';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getCurrentUser, setAuthorisation } from '@/utils/apiCall';
import { useAuth } from '@/hooks/auth';
import { User } from '@/gec-tripetto';

export const Route = createFileRoute('/_mainLayout/_auth')({
  loader: async ({ context }) => {
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
    throw redirect({ to: "/login" })
  },
  component: Auth,
})

function Auth() {

  // Hook de gestion des autorisations
  const auth = useAuth();
  // Hook de récupération des données
  const user = Route.useLoaderData();

  // Mise à jour des données utilisateurs
  useEffect(() => {
    auth.login(user);
  }, [user]);
  
  return <Outlet />
}