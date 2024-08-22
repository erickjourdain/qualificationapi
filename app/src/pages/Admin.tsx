import React, { useState } from "react";
import Utilisateurs from "../components/admin/Utilisateurs";
import Formulaires from "../components/admin/Formulaires";
import Rapports from "../components/admin/Rapports";
import { useMenu } from "../layout/AdminLayout";

const Admin = () => {

  const { menu } = useMenu();

  const selectedMenu = () => {
    switch (menu) {
      case "formulaires":
        return <Formulaires />;
      case "utilisateurs":
        return <Utilisateurs />;
      case "rapports":
        return <Rapports />;
      default:
        return <></>;
    }
  }

  return selectedMenu();
};

export default Admin;
