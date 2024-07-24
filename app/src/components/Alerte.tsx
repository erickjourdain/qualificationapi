import { useAtom } from "jotai";
import { Alert, Snackbar } from "@mui/material";
import { alertAtom } from "@/stores/mainStore";

const Alerte = () => {

  // Chargement de l'état Atom des alertes
  const [alerte, setAlerte] = useAtom(alertAtom);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setAlerte(null);
  };

  return ( alerte &&
    <Snackbar open={!!alerte} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{horizontal: "center", vertical: "top"}}>
      <Alert onClose={handleClose} severity={alerte.severite} sx={{ width: "100%" }} >
        {alerte.message}
      </Alert>
    </Snackbar>
  );

}

export default Alerte;