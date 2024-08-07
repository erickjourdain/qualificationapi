import Nouvelle from "@/components/opportunites/Nouvelle";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/opportunites/nouvelle")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isUser) throw redirect({ to: "/forbidden" });
  },
  component: Nouvelle,
});
