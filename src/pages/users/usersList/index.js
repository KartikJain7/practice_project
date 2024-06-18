import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../../config/config";
import { useRouter } from "next/router";
import Header from "../../../Components/layout/Header";
import Menu from "../../../Components/layout/Menu";
import Footer from "../../../Components/layout/Footer";
import {
  tkndetails,
  convrtDateTwlveHr,
  handleContentClick,
  handlePopUp,
  sidebarClass,
} from "../../../config/helper";

const userView = ({ userAgent }) => {
  //all use states
  const [popUp, setPopUp] = useState(0);
  const router = useRouter();
  const [usersListData, setUsersListData] = useState([]);
  const [noDataFound, setNoDataFound] = useState(0);
  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [pagesArray, setPagesArray] = useState([]);
  //use Effects

  useEffect(() => {
    getUsrList();
  }, []);
  useEffect(() => {
    let object = tkndetails();
    getPages(object.id);
  }, []);
  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, [userAgent]);
  //functions
  const getPages = (id) => {
    if (id) {
      axios
        .get(`${backendUrl}getUserActionRights/${id}`)
        .then((response) => {
          const flattenedArray = response.data.map((item) => item.id).flat();

          setPagesArray(flattenedArray);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getUsrList = async () => {
    await axios
      .get(`${backendUrl}getUsrList`)
      .then((response) => {
        if (
          response.data.status_code === 0 &&
          response.data.status_message === "success"
        ) {
          setUsersListData(response.data.userData);
        } else if (
          response.data.status_code === 1 &&
          response.data.status_message === "err"
        ) {
          setNoDataFound(1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onUpdate = async (status, usersId) => {
    if (status == 1) {
      if (usersId) {
        await axios
          .put(`${backendUrl}updateUsersStatus`, {
            status: 0,
            id: usersId,
          })
          .then((response) => {
            if (
              response.data.status_code == 0 &&
              response.data.status_message == "success"
            ) {
              router.reload("/users/usersList");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    if (status == 0) {
      if (usersId) {
        await axios
          .put(`${backendUrl}updateUsersStatus`, {
            status: 1,
            id: usersId,
          })
          .then((response) => {
            if (
              response.data.status_code == 0 &&
              response.data.status_message == "success"
            ) {
              router.reload("/users/usersList");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
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
                  <h1>Users List</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">List</h3>
                    </div>

                    <div className="card-body" style={{ overflowX: "scroll" }}>
                      {pagesArray.includes(4) && (
                        <button
                          type="button"
                          className="btn btn-block bg-gradient-success"
                          style={{ width: "80px", margin: "0px 0px 10px 0px " }}
                          onClick={() => {
                            router.push("/users/usersList/addUser", undefined, {
                              shallow: true,
                            });
                          }}
                        >
                          Add
                        </button>
                      )}

                      <table
                        id="example1"
                        className="table table-bordered table-striped"
                        style={{ width: "max-content" }}
                      >
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th>Name</th>
                            <th>Email Id</th>
                            <th>Mobile Phone</th>
                            <th>Role</th>
                            <th>Last Login Time</th>
                            <th>Created By</th>
                            <th>Status</th>
                            {pagesArray.includes(16) && <th>Update Status</th>}
                            {pagesArray.includes(5) && <th>Act</th>}
                            {pagesArray.includes(15) && <th>Update Rights</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {usersListData.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.user_name}</td>
                              <td>{item.email_id}</td>
                              <td>{item.phone}</td>

                              <td>{item.roles}</td>

                              {item.last_login_datetime !=
                              "0000-00-00 00:00:00" ? (
                                <td>
                                  {convrtDateTwlveHr(item.last_login_datetime)}
                                </td>
                              ) : (
                                <td>0000-00-00 00:00:00</td>
                              )}
                              <td>{item.created_by}</td>
                              {item.user_status == 1 ? (
                                <td>
                                  <label className="badge badge-success">
                                    Enable
                                  </label>
                                </td>
                              ) : (
                                <td>
                                  <label className="badge badge-danger">
                                    Disable
                                  </label>
                                </td>
                              )}
                              {pagesArray.includes(16) && (
                                <td>
                                  <i
                                    onClick={() => {
                                      onUpdate(item.user_status, item.id);
                                    }}
                                  >
                                    <img
                                      src={
                                        item.user_status == 1
                                          ? "../../images/on-button.png"
                                          : "../../images/switch.png"
                                      }
                                    />
                                  </i>
                                </td>
                              )}
                              {pagesArray.includes(5) && (
                                <td>
                                  <i
                                    className="nav-icon fas fa-edit"
                                    onClick={() => {
                                      router.push(
                                        "/users/usersList/addUser?id=" +
                                          item.id +
                                          "",
                                        undefined,
                                        {
                                          shallow: true,
                                        }
                                      );
                                    }}
                                  ></i>
                                </td>
                              )}
                              {pagesArray.includes(15) && (
                                <td>
                                  <i
                                    className="nav-icon fas fa-edit"
                                    onClick={() => {
                                      router.push(
                                        "/users/usersRights/updateUserRights?id=" +
                                          item.id +
                                          "",
                                        undefined,
                                        {
                                          shallow: true,
                                        }
                                      );
                                    }}
                                  ></i>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
userView.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return { userAgent };
};
export default userView;
