import Menu from "../../../Components/layout/Menu";
import React, { useState, useEffect } from "react";
import { backendUrl } from "../../../config/config";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "../../../Components/layout/Header";
import Footer from "../../../Components/layout/Footer";
import {
  tkndetails,
  handleContentClick,
  handlePopUp,
  sidebarClass,
} from "../../../config/helper";
import {
  deleteModal as DeleteModal,
  successToast as SuccessToast,
} from "@/Components/deletePopUp";
import { searchFilter as SearchFilter } from "@/Components/searchFilter";
import { pagination as Pagination } from "@/Components/pagination";

const templates = ({ userAgent }) => {
  // useStates;
  const [searchFilter, setSearchFilter] = useState(false);
  const [deletSuccMsg, setDeletSuccMsg] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [data, setData] = useState([]);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [pages, setPages] = useState([]);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const [popUp, setPopUp] = useState(0);
  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [id, setId] = useState("");
  const [contactName,setContactName]=useState("")
  const [contactPhone,setContactPhone]=useState("")
 
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [pagesArray, setPagesArray] = useState([]);
  // useEffects;
  useEffect(() => {
    let object = tkndetails();
    getPages(object.id);
  }, []);
  useEffect(() => {
    allContacts();
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
  const searchFunc = async () => {
    try {
      const response = await axios.post(`${backendUrl}searchContacts`, {
        name,
        city,
        state,contactName,contactPhone
      });
      const data = response.data;
      if (data.status_code === 0) {
        setData(data.data);
      }
    } catch (error) {
      console.error(error, "error");
    }
  };
  const defaultButton = async () => {
    try {
      const response = await axios.get(`${backendUrl}contactListLength`, {});
      const data = response.data;
      if (data.status_code === 0 && data.status_message === "success") {
        const totalRows = data.data[0].totalrows;
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

  const allContacts = () => {
    axios
      .get(`${backendUrl}getAllContacts`, {
        params: {
          firstlimit: firstPostIndex,
          secondlimit: postsPerPage,
        },
      })
      .then((response) => {
        const data = response.data;
        if (data.status_code == 0 && data.status_message == "success") {
          setData(data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const excel = async () => {
    try {
      const response = await axios.post(`${backendUrl}contactsExcel`, {
        data,
      });

    
      window.location.href = response.data;
    } catch (error) {
      console.error(error, "error");
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
                  <h1>Contacts</h1>
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
                      <h3 className="card-title">Contact List</h3>
                      {pagesArray.includes(14) && (
                        <div className="card-tools">
                          <a href="#" className="btn btn-tool btn-lg">
                            <i
                              onClick={() => {
                                excel();
                              }}
                              className="fas fa-download"
                            ></i>
                          </a>
                        </div>
                      )}
                    </div>
                    <div
                      className="card-body"
                      style={isMobile == 1 ? { overflowX: "scroll" } : {}}
                    >
                      {pagesArray.includes(10) && (
                        <button
                          type="button"
                          className="btn btn-sm bg-gradient-success"
                          style={{
                            width: "120px",
                            marginBottom: "20px",
                          }}
                          onClick={() => {
                            router.push(
                              "/directory/contacts/action",
                              undefined,
                              {
                                shallow: true,
                              }
                            );
                          }}
                        >
                          Add Contact
                        </button>
                      )}
                      {pagesArray.includes(13) && (
                        <button
                          type="button"
                          className="btn btn-sm bg-gradient-success"
                          style={{
                            width: "120px",
                            marginBottom: "20px",
                            marginLeft: "20px",
                          }}
                          onClick={() => {
                            setSearchFilter(!searchFilter);
                          }}
                        >
                          {searchFilter ? `Hide Search` : `Search`}
                        </button>
                      )}

                      <SearchFilter
                        check={searchFilter}
                        setName={setName}
                        setCity={setCity}
                        setState={setState}
                        callFunction={() => searchFunc()}
                        city={city}
                        state={state}
                        name={name}
                        cntctPhn={contactPhone}
                        cntctName={contactName}
                        setCntctPhn={setContactPhone}
                        setCntctName={setContactName}
                      />
                      <table
                        id="example1"
                        className="table table-bordered table-striped"
                        style={isMobile ? { width: "max-content" } : {}}
                      >
                        <thead>
                          <tr>
                            <th>Serial No.</th>
                            <th>Name</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>State</th>
                            <th>User Name </th>
                            <th>Act</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.length > 0 &&
                            data.map((item, dataItemIndex) => {
                              return (
                                <tr key={dataItemIndex}>
                                  <td>{dataItemIndex + 1}</td>
                                  <td>{item.name}</td>
                                  <td>{item.phone}</td>
                                  <td>{item.location}</td>
                                  <td>{item.city}</td>
                                  <td>{item.state}</td>
                                  <td>{item.created_by}</td>

                                  <td>
                                    {pagesArray.includes(11) && (
                                      <i
                                        className="fas fa-pen"
                                        style={{ marginRight: "10px" }}
                                        onClick={() => {
                                          router.push(
                                            "/directory/contacts/action?id=" +
                                              item.id +
                                              "",
                                            undefined,
                                            {
                                              shallow: true,
                                            }
                                          );
                                        }}
                                      ></i>
                                    )}
                                    {pagesArray.includes(12) && (
                                      <i
                                        className="fas fa-trash"
                                        onClick={() => {
                                          setDeletePopUp(true);
                                          setId(item.id);
                                        }}
                                      ></i>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    <div className="card-footer clearfix">
                      <Pagination pgArr={pages} crntPgState={setCurrentPage} />
                    </div>
                  </div>

                  <DeleteModal
                    enableCond={deletePopUp}
                    setState={setDeletePopUp}
                    contactId={id}
                    setSuccessState={setDeletSuccMsg}
                  />

                  <SuccessToast
                    enableCond={deletSuccMsg}
                    setState={setDeletSuccMsg}
                    redirectPath={`/directory/contacts`}
                  />
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
templates.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return { userAgent };
};
export default templates;
