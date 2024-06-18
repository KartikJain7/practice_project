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
import { FormInput } from "@/Components/formInput";

const erpPages = ({ userAgent }) => {
  // useStates;
  const [data, setData] = useState([]);
  const router = useRouter();
  const [popUp, setPopUp] = useState(0);
  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [pagesArray, setPagesArray] = useState([]);
  const [cityName,setCityName]=useState('')
  // useEffects;
  useEffect(() => {
    let object = tkndetails();
    getPages(object.id);
  }, []);
  useEffect(() => {
    cityList();
  }, [cityName]);



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


  const cityList = () => {
    axios
      .get(`${backendUrl}getCityList`, {
        params: {
          name:cityName
         
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
                  <h1>Cities</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                  <div class="col-sm-2">
                  <FormInput
              label={`Enter City Name`}
              value={cityName}
              state={setCityName}
            />
</div>
                    <div className="card-body" >
                      {pagesArray.includes(20) && (
                        <button
                          type="button"
                          className="btn btn-block bg-gradient-success"
                          style={{ width: "80px", margin: "0px 0px 10px 0px " }}
                          onClick={() => {
                            router.push(
                              "/settings/cities/action",
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
                        
                      >
                        <thead className="text-center">
                          <tr>
                            <th>Serial No.</th>
                            <th>City Name</th>
                            <th>State</th>
                           
                           
                            {pagesArray.includes(19) && <th>Edit</th>}
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {data.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.cityName}</td>
                                <td>{item.stateName}</td>

                               
                               
                                {pagesArray.includes(19) && (
                                  <td>
                                    <i
                                      className="nav-icon fas fa-edit"
                                      onClick={() => {
                                        router.push(
                                          "/settings/cities/action?id=" +
                                            item.cityId +
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
