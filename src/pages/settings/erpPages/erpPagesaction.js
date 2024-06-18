import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../../config/config";
import {
  handleContentClick,
  handlePopUp,
  sidebarClass,
} from "../../../config/helper";
import { useRouter } from "next/router";
import Menu from "../../../Components/layout/Menu";
import Header from "../../../Components/layout/Header";
import Footer from "../../../Components/layout/Footer";
import { FormInput, FormInputErr } from "@/Components/formInput";
const editType = ({ userAgent }) => {
  //all use states
  const [moduleNameRef, setModuleNameRef] = useState("");
  const [subModuleIcon, setSubModuleIcon] = useState("");
  const [moduleLeftSideIcon, setModuleLeftSideIcon] = useState("");
  const [moduleRightSideIcon, setModuleRightSideIcon] = useState("");
  const [pageName, setPageName] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [subModuleName, setSubModuleName] = useState("");
  const [action, setAction] = useState("");
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [typeError, setTypeError] = useState(0);
  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [popUp, setPopUp] = useState(0);
  const router = useRouter();
  const { query } = useRouter();

  //use Effects

  useEffect(() => {
    if (!router.isReady) return;
    if (query.id) {
      editSchedule(query.id);
      setId(query.id);
    }
  }, [router.isReady]);

  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, [userAgent]);
  useEffect(() => {
    checkInputs();
  }, [
    moduleLeftSideIcon,
    moduleRightSideIcon,
    subModuleIcon,
    moduleName,
    subModuleName,

    pageName,
    status,
    moduleNameRef,
  ]);

  //functions
  const checkInputs = () => {
    setTypeError(
      (subModuleName == "" ||
        moduleName == "" ||
        pageName == "" ||
        moduleLeftSideIcon == "" ||
        moduleRightSideIcon == "" ||
        subModuleIcon == "" ||
        status == "" ||
        moduleNameRef == "") &&
        typeError == 1
        ? 1
        : 0
    );
  };

  const handleSubmit = async (requestData, url) => {
    try {
      const response = await axios.post(url, requestData);
      response.data.status_code === 0 &&
        response.data.status_message === "success" &&
        router.push("/settings/erpPages", undefined, {
          shallow: true,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    const requestData = {
      subModuleIcon,
      moduleRightSideIcon,
      moduleLeftSideIcon,
      status,
      moduleNameRef,
      moduleName,
      action,
      subModuleName,
      pageName,
    };

    const hasError =
      subModuleName == "" ||
      moduleName == "" ||
      pageName == "" ||
      moduleLeftSideIcon == "" ||
      moduleRightSideIcon == "" ||
      subModuleIcon == "" ||
      status == "" ||
      moduleNameRef == "";

    if (!hasError) {
      await handleSubmit(requestData, `${backendUrl}addErpNewPage`);
    } else {
      setTypeError(1);
    }
  };

  const onUpdate = async () => {
    const requestData = {
      subModuleIcon,
      moduleRightSideIcon,
      moduleLeftSideIcon,
      status,
      moduleName,
      moduleNameRef,
      action,
      subModuleName,
      pageName,
      id,
    };

    const hasError =
      subModuleName == "" ||
      moduleName == "" ||
      pageName == "" ||
      moduleLeftSideIcon == "" ||
      moduleRightSideIcon == "" ||
      subModuleIcon == "" ||
      status == "" ||
      moduleNameRef == "";

    if (!hasError) {
      await handleSubmit(requestData, `${backendUrl}updateExistingErpPage`);
    } else {
      setTypeError(1);
    }
  };

  const editSchedule = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}editErpPage/${id}`);
      const data = response.data[0];

      setModuleName(data.module_name);
      setSubModuleName(data.sub_module_name);
      setAction(data.action);
      setStatus(data.status);
      setModuleLeftSideIcon(data.module_icon);
      setModuleRightSideIcon(data.module_p_icon);
      setSubModuleIcon(data.sub_module_name_icon);
      setPageName(data.page_name_ref);
      setModuleNameRef(data.module_name_ref);
      setId(data.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`sidebar-mini ${sidebarClass({ collapseMenu })}`}>
      <div
        className="wrapper"
        onClick={() => {
          handlePopUp({ popUp, setPopUp });
        }}
      >
        <Header
          popUp={popUp}
          setPopUp={setPopUp}
          collapseMenu={collapseMenu}
          setCollapseMenu={setCollapseMenu}
        />
        <Menu />
        <div
          className="content-wrapper"
          onClick={() =>
            handleContentClick({ collapseMenu, isMobile, setCollapseMenu })
          }
        >
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>ERP Pages</h1>
                </div>
                <div className="col-sm-6"></div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6">
                  <div className="card ">
                    <div className="card-header">
                      {query.id ? (
                        <h3 className="card-title">Edit Page</h3>
                      ) : (
                        <h3 className="card-title">Add New Page</h3>
                      )}
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <div className="card-body">
                        <FormInput
                          label={"Module Name*"}
                          value={moduleName}
                          state={setModuleName}
                          condition={typeError === 1 && moduleName.length === 0}
                        />

                        <FormInput
                          label={"Sub-Module Name*"}
                          value={subModuleName}
                          state={setSubModuleName}
                          condition={
                            typeError === 1 && subModuleName.length === 0
                          }
                        />

                        <FormInput
                          label={"Action*"}
                          value={action}
                          state={setAction}
                          condition={typeError === 1 && action.length === 0}
                        />

                        <FormInput
                          label={"Module Icon Left Side*"}
                          value={moduleLeftSideIcon}
                          state={setModuleLeftSideIcon}
                          condition={
                            typeError === 1 && moduleLeftSideIcon.length === 0
                          }
                        />

                        <FormInput
                          label={"Sub-Module icon*"}
                          value={subModuleIcon}
                          state={setSubModuleIcon}
                          condition={
                            typeError === 1 && subModuleIcon.length === 0
                          }
                        />

                        <FormInput
                          label={"Module Icon Right Side*"}
                          value={moduleRightSideIcon}
                          state={setModuleRightSideIcon}
                          condition={
                            typeError === 1 && moduleRightSideIcon.length === 0
                          }
                        />
                        <FormInput
                          label={"Page Name*"}
                          value={pageName}
                          state={setPageName}
                          condition={typeError === 1 && pageName.length === 0}
                        />
                        <FormInput
                          label={" Module Name Reference*"}
                          value={moduleNameRef}
                          state={setModuleNameRef}
                          condition={
                            typeError === 1 && moduleNameRef.length === 0
                          }
                        />

                        <div className="form-group">
                          <label htmlFor="exampleInputPassword1">Status*</label>
                          <select
                            className={`form-control ${
                              typeError === 1 && status.length === 0
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={(e) => {
                              setStatus(e.target.value);
                            }}
                            value={status}
                          >
                            <option value="">--Please Choose Status--</option>
                            <option value="0">Disable</option>
                            <option value="1">Enable</option>
                          </select>
                        </div>
                        <FormInputErr condition={typeError} />
                      </div>

                      <div className="card-footer">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            query.id ? onUpdate() : onSubmit();
                          }}
                        >
                          {query.id ? "Update" : "Submit"}
                        </button>
                        <button
                          type="submit"
                          className="btn btn-default float-right"
                          onClick={() => {
                            router.push("/settings/erpPages", undefined, {
                              shallow: true,
                            });
                          }}
                        >
                          Back
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
editType.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return { userAgent };
};
export default editType;
