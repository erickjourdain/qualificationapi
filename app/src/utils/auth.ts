import { includes } from "lodash";
import { useAtomValue } from "jotai";
import { loggedUser } from "../atomState";

const isAdmin = () => {
  const user = useAtomValue(loggedUser);
  return user?.role === "ADMIN";
}

const isCreator = () => {
  const user = useAtomValue(loggedUser);
  return includes(["ADMIN", "CREATOR"], user?.role);
}

const isUser = () => {
  const user = useAtomValue(loggedUser);
  return includes(["ADMIN", "CREATOR", "USER"], user?.role);
};

const isLogged = () => {
  const user = useAtomValue(loggedUser);
  return !user
}

export { isAdmin, isCreator, isUser, isLogged };
