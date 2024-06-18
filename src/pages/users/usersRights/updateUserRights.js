import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../../config/config";
import { useRouter } from "next/router";
import Header from "../../../Components/layout/Header";
import Menu from "../../../Components/layout/Menu";
import Footer from "../../../Components/layout/Footer";
import {
  tkndetails,
  handleContentClick,
  handlePopUp,
  sidebarClass,
} from "../../../config/helper";
const updateRights = ({ userAgent }) => {
  //all use states
  const [popUp, setPopUp] = useState(0);
  const [usrMangmntData, setUsrMangmntData] = useState([]);
  const { query } = useRouter();
  const router = useRouter();
  const [usrRightsArr, setUsrRightsArr] = useState([]);
  const [userId, setUserId] = useState("");
  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  //use Effects

  useEffect(() => {
    if (!router.isReady) return;
    if (query.id) {
      getModuleName();
      setUserId(query.id);
      getCurrentUsrRights(query.id);
    }
  }, [router.isReady]);
  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, [userAgent]);
  //functions
  const getModuleName = async () => {
    axios
      .get(`${backendUrl}moduleName`)
      .then((response) => {
        setUsrMangmntData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCurrentUsrRights = async (id) => {
    axios
      .get(`${backendUrl}getcurntUsrRght/${id}`)
      .then((response) => {
        const data = response.data;
        if (data.status_code == 0 && data.status_message == "success") {
          setUsrRightsArr(data.array);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateUserRights = (id) => {
    if (usrRightsArr.includes(id)) {
      var index = usrRightsArr.indexOf(id);

      usrRightsArr.splice(index, 1);
    } else {
      usrRightsArr.push(id);
    }
  };
  const onUpdate = () => {
    axios
      .put(`${backendUrl}updateUsersRights`, {
        rightsArr: usrRightsArr,
        id: userId,
      })
      .then((response) => {
        const data = response.data;
        if (data.status_code == 0 && data.status_message == "success") {
          router.push("/users/usersList", undefined, {
            shallow: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
                  <h1>User Management</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="card card-default">
              {usrMangmntData.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="card-header">
                    <h3 className="card-title">{item.moduleName}</h3>
                    <div className="card-tools"></div>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div
                      className="card-body"
                      style={{ margin: "20px 20px 20px 20px" }}
                    >
                      <div className="row" style={{ minHeight: "100px" }}>
                        <div className="col-md-12">
                          <div
                            className="form-group"
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}
                          >
                            {item.pageNameArr.map((item, index) =>
                              usrRightsArr.includes(item.id) ? (
                                <div className="checkbos-sec" key={index}>
                                  <input
                                    type="checkbox"
                                    onChange={() => {
                                      updateUserRights(item.id);
                                    }}
                                    defaultChecked
                                  />
                                  <label
                                    style={{
                                      padding: "5px 5px",
                                      margin: "5px 5px",
                                    }}
                                  >
                                    {item.page_name}
                                  </label>
                                </div>
                              ) : (
                                <div className="checkbos-sec" key={index}>
                                  <input
                                    type="checkbox"
                                    onChange={() => {
                                      updateUserRights(item.id);
                                    }}
                                  />
                                  <label
                                    style={{
                                      padding: "5px 5px",
                                      margin: "5px 5px",
                                    }}
                                  >
                                    {item.page_name}
                                  </label>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </React.Fragment>
              ))}

              <div className="card-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onUpdate();
                  }}
                >
                  Update
                </button>

                <button
                  type="submit"
                  className="btn btn-default float-right"
                  onClick={() => {
                    router.push("/users/usersList", undefined, {
                      shallow: true,
                    });
                  }}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};
updateRights.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return { userAgent };
};
export default updateRights;
