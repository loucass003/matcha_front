import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useActivate } from "../../../api/auth/activate";
import { IMutationError } from "../../../api/types";
import { IResponseError } from "../../../commons/types/errors/ResponseError";
import { useAlert } from "../../../hooks/alert";
import { AppAlert } from "../../commons/AppAlert";

interface ActivateParams {
  token: string;
}

export function Activate() {
  const { token: activationToken } = useParams<ActivateParams>();
  const { mutate: activate, loading } = useActivate();
  const { state: alert, error } = useAlert();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    activate({ activationToken })
      .then(() => enqueueSnackbar("Account activated", { variant: "success" }))
      .catch(({ data }: IMutationError<IResponseError>) =>
        error(data.message, -1)
      );
  }, []);

  return (
    <div>
      <AppAlert state={alert} />
      ACTIVATION PAGE {loading ? "activating ..." : ""}
    </div>
  );
}
