import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUser, setAuthorisation } from '@/utils/apiCall';

export const Route = createFileRoute('/_mainLayout/_auth')({
  beforeLoad: async ({ context }) => {
    const token = localStorage.getItem("token") || null;
    if (token) {
      setAuthorisation(token);
      const { data: user } = await context.queryClient.fetchQuery({
        queryKey: ["currenUser", token],
        queryFn: getCurrentUser,
      });
      context.user = user;
      console.log(context)
      if (context.user === null) {
        throw redirect({
          to: "/login"
        });
      }
    } else throw redirect({
      to: "/login"
    });
  },
  onError: () => {
    throw redirect({to: "/login"})
  },
})