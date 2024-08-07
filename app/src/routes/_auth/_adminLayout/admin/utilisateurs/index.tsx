import { createFileRoute, redirect } from "@tanstack/react-router";
import Utilisateurs from "@components/admin/Utilisateurs";

export const Route = createFileRoute("/_auth/_adminLayout/admin/utilisateurs/")(
  {
    beforeLoad: ({ context }) => {
      if (!context.auth.isAdmin) throw redirect({ to: "/forbidden" });
    },
    component: Utilisateurs,
  },
);
