import { useRouter } from "next/router";
import axios from "axios";
import { backendUrl } from "@/config/config";
export const deleteModal = ({
  enableCond,
  setState,
  contactId,
  setSuccessState,
}) => {
  const router = useRouter();
  const deleteFunc = async () => {
    await axios
      .get(`${backendUrl}deleteContact/${contactId}`)
      .then((response) => {
        setSuccessState(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {enableCond ? (
        <div
          className="modal fade show"
          id="modal-default"
          style={{ display: "block", paddingRight: "17px" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Hey!</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p> Are You Sure You Want To Delete?</p>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-primary "
                  data-dismiss="modal"
                  onClick={() => {
                    deleteFunc();
                    setState(false);
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  type="button"
                  className="  btn btn-default"
                  onClick={() => {
                    setState(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export const successToast = ({ enableCond, setState, redirectPath }) => {
  const router = useRouter();

  return (
    <>
      {enableCond ? (
        <div id="toastsContainerTopRight" className="toasts-top-right fixed">
          <div
            className="toast bg-success fade show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="mr-auto">Alert</strong>
              <button
                data-dismiss="toast"
                onClick={() => {
                  setState(false);
                  router.reload(redirectPath);
                }}
                type="button"
                className="ml-2 mb-1 close"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="toast-body">
              Selected User Record Is Deleted Successfully.
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
