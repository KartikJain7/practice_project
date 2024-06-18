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
import { FormInput, FormInputErr, FormSelect } from "@/Components/formInput";
const editType = ({ userAgent }) => {
  //all use states
  const [cityName, setCityName] = useState("");
  const [id, setId] = useState("");
  const [typeError, setTypeError] = useState(0);
  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [popUp, setPopUp] = useState(0);
  const router = useRouter();
  const { query } = useRouter();
  const [stateName, setStateName] = useState("");
  const [statesArr, setStatesArr] = useState([]);
  //use Effects

  useEffect(() => {
    if (!router.isReady) return;
    if (query.id) {
      editSchedule(query.id);
      setId(query.id);
    }
  }, [router.isReady]);
  useEffect(() => {
    getStateCityList();
  }, []);
  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, [userAgent]);
  useEffect(() => {
    checkInputs();
  }, [
   cityName
  ]);

  //functions
  const getStateCityList = async () => {
    await axios
      .get(`${backendUrl}stateList`)
      .then((response) => {
       setStatesArr(response.data.stateArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkInputs = () => {
    setTypeError(
      (cityName=="") &&
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
        router.push("/settings/cities", undefined, {
          shallow: true,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    const requestData = {
     cityName,stateName
    };

    const hasError =
     cityName==""

    if (!hasError) {
      await handleSubmit(requestData, `${backendUrl}addNewCityName`);
    } else {
      setTypeError(1);
    }
  };

  const onUpdate = async () => {
    const requestData = {
     cityName,stateName,
      id,
    };

    const hasError =
      cityName == "";

    if (!hasError) {
      await handleSubmit(requestData, `${backendUrl}updateCityName`);
    } else {
      setTypeError(1);
    }
  };

  const editSchedule = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}editCityName/${id}`);
      const data = response.data[0];

     setCityName(data.cityName)
      setId(data.cityId);
      setStateName(data.stateId)
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
                  <h1>Cities</h1>
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
                        <h3 className="card-title">Edit City Name</h3>
                      ) : (
                        <h3 className="card-title">Add New City Name</h3>
                      )}
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <div className="card-body">
                        <FormInput
                          label={"City Name*"}
                          value={cityName}
                          state={setCityName}
                          condition={typeError === 1 && cityName.length === 0}
                        />
<FormSelect
                        label={"State*"}
                        optionsArr={statesArr}
                        value={stateName}
                        state={setStateName}
                        condition={typeError===1 && stateName == ""}
                      />
                       

                        

                       

                      

                     
                      
                       

                        
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
                            router.push("/settings/cities", undefined, {
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
