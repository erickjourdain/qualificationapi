import { AxiosError } from "axios";

/**
 * Définir le message d'erreur à afficher à l'écran
 * @param error
 * @returns string message d'erreur
 */
const manageError = (error: Error | AxiosError | unknown) : string => {
  console.log(error)
  if (error instanceof AxiosError) {
    if (error.response?.data.message === "Bad credentials")
      return "Login / mot de passe incorrect";
    if (error.response?.data instanceof Array)
      return error.response?.data.join(" - ");
    if (error.response?.data.message)
      return error.response?.data.message;
    else error.message
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Une erreur inconnue s'est produite."
}

export default manageError;
