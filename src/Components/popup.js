import axios from "axios";
import { tkndetails, convrtDateTwlveHr, logoutUser } from "../config/helper";
import { useEffect, useState } from "react";
import { backendUrl, frontUrl } from "@/config/config";
import { useRouter } from "next/router";

const popUpBox = () => {
  const [name, setName] = useState("");
  const router = useRouter();
  const [usersAccId, setUsersAccId] = useState("");
  const [lastLoginTime, setLastLoginTime] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    let object = tkndetails();
    getAccountDetails(object.id);
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
            setUsersAccId(response.data.accDetailData[0].id);
            setName(response.data.accDetailData[0].user_name);
            setEmail(response.data.accDetailData[0].email_id);
            setPhone(response.data.accDetailData[0].phone);
            setLastLoginTime(
              response.data.accDetailData[0].last_login_datetime
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <>
      <div className="container">
        <div className="side-popup">
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right show">
            <span className="dropdown-item dropdown-header">Hey! {name}</span>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item">
              <i className="fas fa-envelope mr-2"></i>
              <span className="float-right text-muted text-sm">{email}</span>
            </a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item">
              <i className="fas fa-phone mr-2"></i>
              <span className="float-right text-muted text-sm">{phone}</span>
            </a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item">
              <i className="fas fa-user mr-2"></i>
              <span className="float-right text-muted text-sm">
                {convrtDateTwlveHr(lastLoginTime)}
              </span>
            </a>
            <div className="dropdown-divider"></div>
            <a
              className="dropdown-item dropdown-footer"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <button
                className="btn btn-sm bg-gradient-primary"
                onClick={() => {
                  router.push("/profile", undefined, {
                    shallow: true,
                  });
                }}
              >
                Profile
              </button>
              <button
                className="btn btn-sm bg-gradient-primary"
                onClick={() => {
                  localStorage.clear("tkn");
                  localStorage.clear("_expiredTime");
                  window.location.href = `${frontUrl}login`;
                  logoutUser(usersAccId);
                }}
              >
                Log Out
              </button>
            </a>
          </div>
        </div>

        <div className="main-content"></div>
      </div>
    </>
  );
};
export default popUpBox;
