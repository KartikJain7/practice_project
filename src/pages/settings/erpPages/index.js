import { useState, useEffect } from "react";
import { backendUrl } from "../../../config/config";
import axios from "axios";
import { useRouter } from "next/router";
import Menu from "../../../Components/layout/Menu";
import Header from "../../../Components/layout/Header";
import Footer from "../../../Components/layout/Footer";
import {
  tkndetails,
  handleContentClick,
  handlePopUp,
  sidebarClass,
} from "../../../config/helper";

const erpPages = ({ userAgent }) => {
  // useStates;
  const [data, setData] = useState([]);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(15);
  const [pages, setPages] = useState([]);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const [popUp, setPopUp] = useState(0);
  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [pagesArray, setPagesArray] = useState([]);
  // useEffects;
  useEffect(() => {
    let object = tkndetails();
    getPages(object.id);
  }, []);
  useEffect(() => {
    allErpPages();
  }, [firstPostIndex]);

  useEffect(() => {
    defaultButton();
  }, []);

  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, [userAgent]);
  // functions;
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
  const defaultButton = async () => {
    try {
      const response = await axios.get(`${backendUrl}erpPagesCount`);

      if (
        response.data.status_code === 0 &&
        response.data.status_message === "success"
      ) {
        const totalRows = response.data.data[0].totalrows;
        const totalPages = Math.ceil(totalRows / postsPerPage);

        const newPages = Array.from(
          { length: totalPages },
          (_, index) => index + 1
        );

        setPages(newPages);
      }
    } catch (error) {
      console.error(error, "error");
    }
  };

  const allErpPages = () => {
    axios
      .get(`${backendUrl}getErpPagesData`, {
        params: {
          firstlimit: firstPostIndex,
          secondlimit: postsPerPage,
        },
      })
      .then((response) => {
        if (
          response.data.status_code == 0 &&
          response.data.status_message == "success"
        ) {
          setData(response.data.data);
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
                  <h1>ERP Pages</h1>
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
                      <h3 className="card-title">Pages</h3>

                      <div className="card-tools">
                        <ul className="pagination pagination-sm float-right">
                          <li className="page-item">
                            <a className="page-link" href="#">
                              &laquo;
                            </a>
                          </li>
                          {pages.map((item, index) => {
                            return (
                              <li className="page-item" key={index}>
                                <a
                                  className="page-link"
                                  href="#"
                                  onClick={() => {
                                    setCurrentPage(item);
                                  }}
                                >
                                  {item}
                                </a>
                              </li>
                            );
                          })}

                          <li className="page-item">
                            <a className="page-link" href="#">
                              &raquo;
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="card-body" style={{ overflowX: "scroll" }}>
                      {pagesArray.includes(17) && (
                        <button
                          type="button"
                          className="btn btn-block bg-gradient-success"
                          style={{ width: "80px", margin: "0px 0px 10px 0px " }}
                          onClick={() => {
                            router.push(
                              "/settings/erpPages/erpPagesaction",
                              undefined,
                              {
                                shallow: true,
                              }
                            );
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
                            <th>Serial No.</th>
                            <th>Module Name</th>
                            <th>Sub-Module Name</th>
                            <th>Action</th>
                            <th>Module Icon Left Side</th>
                            <th>Module Icon Right Side</th>
                            <th>Sub-Module icon</th>
                            <th>Page Name</th>
                            <th>Status</th>
                            {pagesArray.includes(18) && <th>Edit</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.module_name}</td>
                                <td>{item.sub_module_name}</td>

                                <td>{item.action}</td>
                                <td>{item.module_icon}</td>
                                <td>{item.module_p_icon}</td>
                                <td>{item.sub_module_name_icon}</td>
                                <td>{item.page_name_ref}</td>
                                {item.status == 1 ? (
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
                                {pagesArray.includes(18) && (
                                  <td>
                                    <i
                                      className="nav-icon fas fa-edit"
                                      onClick={() => {
                                        router.push(
                                          "/settings/erpPages/erpPagesaction?id=" +
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
                            );
                          })}
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
erpPages.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return { userAgent };
};
export default erpPages;
