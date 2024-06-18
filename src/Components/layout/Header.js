import { useRouter } from "next/router";
import PopUpBox from "../popup";
import { useEffect } from "react";
import { tkndetails, logoutUser } from "@/config/helper";
import axios from "axios";
import { backendUrl, frontUrl } from "@/config/config";
const Header = ({ popUp, setPopUp, collapseMenu, setCollapseMenu }) => {
  const router = useRouter();
  useEffect(() => {
    let object = tkndetails();
    if(object){
    let usersId = object.id;

    getAccountDetails(usersId)};
  }, []);
  const getAccountDetails = async (id) => {
    if (id) {
      await axios
        .get(`${backendUrl}getAccDetails/${id}`)
        .then((response) => {
        
          if (
            response.data.status_code == 0 &&
            response.data.status_message == "success"
          ) {
            if (response.data.accDetailData[0].user_status == 0) {
              localStorage.clear("tkn");
              localStorage.clear("_expiredTime");
              window.location.href = `${frontUrl}login`;
              logoutUser(response.data.accDetailData[0].id);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <div
      onClick={() => {
        if (popUp == 1) {
          setPopUp(0);
        }
      }}
    >
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
              onClick={() => {
                setCollapseMenu(!collapseMenu);
              }}
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a
              href="#"
              onClick={() => {
                router.push("/", undefined, {
                  shallow: true,
                });
              }}
              className="nav-link"
            >
              Home
            </a>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">
            <a
              className="nav-link"
              data-widget="control-sidebar"
              data-controlsidebar-slide="true"
              role="button"
              onClick={() => {
                setPopUp(!popUp);
              }}
            >
              <i className="fas fa-th-large" />
            </a>
          </li>
        </ul>
      </nav>
      <div> {popUp == 1 ? <PopUpBox /> : <></>}</div>
    </div>
  );
};

export default Header;
