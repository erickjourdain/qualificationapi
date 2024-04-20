import React, { useState } from "react";
import Utilisateurs from "../components/admin/Utilisateurs";
import Formulaires from "../components/admin/Formulaires";
import { useMenu } from "../layout/AdminLayout";

const Admin = () => {

  const { menu } = useMenu();

  const selectedMenu = () => {
    switch (menu) {
      case "formulaires":
        return <Formulaires />;
      case "utilisateurs":
        return <Utilisateurs />;
      default:
        return <></>;
    }
  }

  return selectedMenu();
};

export default Admin;
