import { useState, useEffect } from "react";
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
const roles = ({ userAgent }) => {
  //all use states
  const [popUp, setPopUp] = useState(0);
  const router = useRouter();
  const [rolesList, setRolesList] = useState([]);
  const [pagesArray, setPagesArray] = useState([]);
  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  //use Effects

  useEffect(() => {
    getUserRoles();
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
  const getUserRoles = async () => {
    await axios
      .get(`${backendUrl}getUserRole`)
      .then((response) => {
        setRolesList(response.data);
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
                  <h1>Roles List</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="container-fluid">
              <div className="row" style={{ minHeight: "900px" }}>
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">List</h3>
                    </div>

                    <div className="card-body">
                      {pagesArray.includes(7) && (
                        <button
                          type="button"
                          className="btn btn-block bg-gradient-success"
                          style={{ width: "80px", margin: "0px 0px 10px 0px " }}
                          onClick={() => {
                            router.push("/users/role/addNewRole", undefined, {
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
                            {pagesArray.includes(8) && <th>Rights</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {rolesList.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>
                              {pagesArray.includes(8) && (
                                <td>
                                  <i
                                    className="nav-icon fas fa-edit"
                                    onClick={() => {
                                      router.push(
                                        "/users/role/roleRights?id=" +
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
roles.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return { userAgent };
};
export default roles;
