import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../config/config";
import { useRouter } from "next/router";
import Header from "../Components/layout/Header";
import Menu from "../Components/layout/Menu";
import Footer from "../Components/layout/Footer";
import {
  tkndetails,
  checkEmail,
  checkAccPhnNo,
  checkPassword,
  getRandomString,
  handleContentClick,
  handlePopUp,
  sidebarClass,
} from "../config/helper";

const userAccount = ({ userAgent }) => {
  //all use states
  const [popUp, setPopUp] = useState(0);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneInputError, setPhoneInputError] = useState(false);
  const [passwordInputError, setPasswordInputError] = useState(false);
  const [emailInputError, setEmailInputError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [usersAccId, setUsersAccId] = useState("");
  const [salt, setSalt] = useState("");
  const [passwordChecker, setPasswordChecker] = useState("");
  const [roleName, setRoleName] = useState("");

  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  //use Effects

  useEffect(() => {
    let loggedInUserName = tkndetails();
    let usersId = loggedInUserName.id;
    setUsersAccId(usersId);
    getAccountDetails(usersId);
  }, []);
  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, [userAgent]);
  useEffect(() => {
    checkInputs();
  }, [name, email, phone, password]);

  //functions
  const checkInputs = () => {
    typeError &&
      setTypeError(
        [name, email, phone, password].some((input) => input === "")
          ? true
          : false
      );
  };

  const getAccountDetails = async (id) => {
    if (!id) {
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}getAccDetails/${id}`);
      const data = response.data;
      if (data.status_code === 0 && data.status_message === "success") {
        const accDetailData = data.accDetailData[0];
        const { user_name, email_id, phone, password, salt, roles } =
          accDetailData;

        setName(user_name);
        setEmail(email_id);
        setPhone(phone);
        setPassword(password);
        setSalt(salt);
        setPasswordChecker(password);
        setRoleName(roles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdate = async () => {
    if (
      name === "" ||
      email === "" ||
      phone === "" ||
      emailInputError ||
      passwordInputError ||
      phoneInputError
    ) {
      setTypeError(true);
      return;
    }
    let updateObj = {
      name: name,
      email: email,
      phone: phone,
      id: usersAccId,
      password: passwordChecker === password ? password : password,
      salt: passwordChecker === password ? salt : getRandomString(15),
    };

    try {
      const response = await axios.put(
        `${backendUrl}updateUsrDetails`,
        updateObj
      );
      const data = response.data;
      if (data.status_code === 0 && data.status_message === "success") {
        router.push("/", undefined, {
          shallow: true,
        });
      } else if (data.status_code === 1 && data.status_message === "error") {
        setEmailError(1);
      }
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
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1>Profile</h1>
                </div>
              </div>
            </div>
          </section>

          <section className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-3">
                  <div className="card card-primary card-outline">
                    <div className="card-body box-profile">
                      <div className="text-center">
                        <img
                          className="profile-user-img img-fluid img-circle"
                          src="../../images/user.png"
                          alt="User profile picture"
                        />
                      </div>
                      <h3 className="profile-username text-center">{name}</h3>
                      <p className="text-muted text-center">{roleName}</p>
                      <ul className="list-group list-group-unbordered mb-3">
                        <li className="list-group-item">
                          <i className="fas fa-envelope mr-3"></i>
                          <a className="float-right">{email}</a>
                        </li>
                        <li className="list-group-item">
                          <i className="fas fa-phone mr-2"></i>
                          <a className="float-right">{phone}</a>
                        </li>
                        <li className="list-group-item">
                          <i className="fas fa-user mr-2"></i>
                          <a className="float-right">{roleName}</a>
                        </li>
                      </ul>
                      <a href="#" className="btn btn-success btn-block">
                        <b>Online</b>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-md-9">
                  <div className="card">
                    <div className="card-header p-1">
                      <a className="nav-link" href="#">
                        Account Detail
                      </a>
                    </div>

                    <div className="tab-pane" id="settings">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label htmlFor="exampleInputPassword4">
                                  Name*
                                </label>
                                <input
                                  value={name}
                                  type="text"
                                  className={`form-control ${
                                    name == "" ? "is-invalid" : ""
                                  }`}
                                  id="inputName"
                                  placeholder="Name"
                                  onChange={(e) => {
                                    setName(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group">
                                <label htmlFor="exampleInputPassword4">
                                  Mobile*
                                </label>
                                <input
                                  value={phone}
                                  type="text"
                                  className={`form-control ${
                                    phoneInputError ? "is-invalid" : ""
                                  }`}
                                  id="exampleInputEmail1"
                                  placeholder="Mobile Number"
                                  onChange={(e) => {
                                    setPhone(e.target.value);
                                    setPhoneInputError(
                                      checkAccPhnNo(e.target.value)
                                    );
                                  }}
                                />
                                {phoneInputError && (
                                  <span className="text-red">
                                    Please enter numericals only and a minimum
                                    length of 10 digits.
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group">
                                <label htmlFor="exampleInputName1">
                                  Email*
                                </label>
                                <input
                                  value={email}
                                  type="text"
                                  className={`form-control ${
                                    emailInputError ? "is-invalid" : ""
                                  }`}
                                  id="exampleInputEmail1"
                                  placeholder="Email Address"
                                  onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailInputError(
                                      checkEmail(e.target.value)
                                    );
                                  }}
                                />
                                {emailInputError && (
                                  <span className="text-red">
                                    Please enter correct email address
                                  </span>
                                )}
                              </div>
                              <div className="form-group">
                                <label htmlFor="exampleInputEmail3">
                                  Password*
                                </label>
                                <input
                                  type="text"
                                  className={`form-control ${
                                    passwordInputError ? "is-invalid" : ""
                                  }`}
                                  id="exampleInputEmail1"
                                  placeholder="Password"
                                  onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordInputError(
                                      checkPassword(e.target.value)
                                    );
                                  }}
                                />
                                {passwordInputError && (
                                  <span className="text-red">
                                    We require a password that contains atleast
                                    8 characters a uppercase and lowercase
                                    letter and a number and special character.
                                  </span>
                                )}
                              </div>
                              {typeError && (
                                <span className="text-red">
                                  Please fill out all the mandatory fields
                                  correctly
                                </span>
                              )}
                              {emailError && (
                                <span className="text-red">
                                  Email Id already exists
                                </span>
                              )}
                            </div>
                            <div className="App"></div>
                          </div>

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
                                router.push("/", undefined, {
                                  shallow: true,
                                });
                              }}
                            >
                              Back
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
};
userAccount.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return { userAgent };
};
export default userAccount;
