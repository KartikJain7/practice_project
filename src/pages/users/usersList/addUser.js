import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../../config/config";
import { useRouter } from "next/router";
import Header from "../../../Components/layout/Header";
import Menu from "../../../Components/layout/Menu";
import Footer from "../../../Components/layout/Footer";
import {
  tkndetails,
  checkAccPhnNo,
  checkEmail,
  checkPassword,
  getRandomString,
  handleContentClick,
  handlePopUp,
  sidebarClass,
} from "../../../config/helper";

const addUser = ({ userAgent }) => {
  //all use states
  const [popUp, setPopUp] = useState(0);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneInputError, setPhoneInputError] = useState(0);
  const [passwordInputError, setPasswordInputError] = useState(0);
  const [emailInputError, setEmailInputError] = useState(0);
  const [typeError, setTypeError] = useState(0);
  const [emailError, setEmailError] = useState(0);
  const [role, setRole] = useState("");

  const [rolesDropdownList, setRolesDropdownList] = useState([]);
  const [createdBy, setCreatedBy] = useState("");
  const { query } = useRouter();
  const [userId, setUserId] = useState("");
  const [updateSalt, setUpdateSalt] = useState("");
  const [passwordChecker, setPasswordChecker] = useState("");
  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  //use Effects

  useEffect(() => {
    let loggedInUserName = tkndetails();
    let userName = loggedInUserName.name;
    setCreatedBy(userName);
  }, []);
  useEffect(() => {
    if (!router.isReady) return;
    if (query.id) {
      getAccountDetails(query.id);
      setUserId(query.id);
    }
  }, [router.isReady]);

  useEffect(() => {
    getUserRoles();
  }, []);
  useEffect(() => {
    checkInputs();
  }, [name, email, phone, password, role]);
  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, [userAgent]);
  //functions
  const checkInputs = () => {
    let error = false;
    if (name === "" && typeError == 1) {
      error = true;
    }

    if (email === "" && typeError == 1) {
      error = true;
    }

    if (phone === "" && typeError == 1) {
      error = true;
    }

    if (password === "" && typeError == 1) {
      error = true;
    }
    if (role == null && typeError == 1) {
      error = true;
    }

    if (error === false) {
      setTypeError(0);
    } else {
      setTypeError(1);
    }
  };
  const getAccountDetails = async (id) => {
    if (id) {
      await axios
        .get(`${backendUrl}getAccDetails/${id}`)
        .then((response) => {
          if (
            response.data.status_code == 0 &&
            response.data.status_message == "success"
          ) {
            setName(response.data.accDetailData[0].user_name);
            setEmail(response.data.accDetailData[0].email_id);
            setPhone(response.data.accDetailData[0].phone);
            setPassword(response.data.accDetailData[0].password);
            setRole(response.data.accDetailData[0].role_id);

            setUpdateSalt(response.data.accDetailData[0].salt);
            setPasswordChecker(response.data.accDetailData[0].password);
          }
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
        setRolesDropdownList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = async () => {
    let error = false;
    if (name == "") {
      error = true;
    }

    if (email == "") {
      error = true;
    }

    if (phone == "") {
      error = true;
    }

    if (password == "") {
      error = true;
    }

    if (emailInputError == 1) {
      error = true;
    }

    if (passwordInputError == 1) {
      error = true;
    }

    if (phoneInputError == 1) {
      error = true;
    }
    if (role == null) {
      error = true;
    }

    if (error == false) {
      await axios
        .post(`${backendUrl}submitUserDetails`, {
          name: name,
          email: email,
          phone: phone,
          password: password,
          role_id: role,

          createdBy: createdBy,
          salt: getRandomString(15),
        })
        .then((response) => {
          if (
            response.data.status_code == 0 &&
            response.data.status_message == "success"
          ) {
            router.push("/users/usersList", undefined, {
              shallow: true,
            });
          }
          if (
            response.data.status_code == 1 &&
            response.data.status_message == "error"
          ) {
            setEmailError(1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setTypeError(1);
    }
  };
  const onUpdate = async () => {
    let error = false;
    if (name == "") {
      error = true;
    }

    if (email == "") {
      error = true;
    }

    if (phone == "") {
      error = true;
    }

    if (emailInputError == 1) {
      error = true;
    }

    if (passwordInputError == 1) {
      error = true;
    }

    if (phoneInputError == 1) {
      error = true;
    }
    if (role == "") {
      error = true;
    }

    if (error == false) {
      let updateObj = {
        name: "",
        email: "",
        phone: "",
        id: "",
        password: "",
        role: "",
      };
      if (passwordChecker === password) {
        updateObj = {
          name: name,
          email: email,
          phone: phone,
          id: userId,
          password: password,
          role: role,

          salt: updateSalt,
        };
      } else {
        let newSalt = getRandomString(15);
        updateObj = {
          name: name,
          email: email,
          phone: phone,
          id: userId,
          password: password,
          role: role,

          salt: newSalt,
        };
      }

      await axios
        .put(`${backendUrl}updateUsrDetailsAdmin`, updateObj)
        .then((response) => {
          if (
            response.data.status_code == 0 &&
            response.data.status_message == "success"
          ) {
            router.push("/users/usersList", undefined, {
              shallow: true,
            });
          }
          if (
            response.data.status_code == 1 &&
            response.data.status_message == "error"
          ) {
            setEmailError(1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setTypeError(1);
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
                  <h1>User</h1>
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
                        <h3 className="card-title">Edit User</h3>
                      ) : (
                        <h3 className="card-title">Add New User</h3>
                      )}
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Name*</label>
                          <input
                            value={name}
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Name"
                            style={{
                              borderColor:
                                typeError === 1 && role.length === 0
                                  ? "red"
                                  : "none",
                            }}
                            onChange={(e) => {
                              setName(e.target.value);
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">
                            Mobile Number*
                          </label>
                          <input
                            value={phone}
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Mobile Number"
                            style={{
                              borderColor:
                                typeError === 1 && phoneInputError == 1
                                  ? "red"
                                  : "none",
                            }}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setPhoneInputError(checkAccPhnNo(e.target.value));
                            }}
                          />
                          {phoneInputError == 1 && (
                            <span className="text-red">
                              Please enter numericals only and a minimum length
                              of 10 digits.
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">
                            Email Address*
                          </label>
                          <input
                            value={email}
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Email Address"
                            style={{
                              borderColor:
                                typeError == 1 && emailInputError == 1
                                  ? "red"
                                  : "none",
                            }}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailInputError(checkEmail(e.target.value));
                            }}
                          />
                          {emailInputError == 1 && (
                            <span className="text-red">
                              Please enter correct email address
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputEmail1">Password*</label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Password"
                            style={{
                              borderColor:
                                typeError == 1 && passwordInputError == 1
                                  ? "red"
                                  : "none",
                            }}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setPasswordInputError(
                                checkPassword(e.target.value)
                              );
                            }}
                          />
                          {passwordInputError == 1 && (
                            <span className="text-red">
                              We require a password that contains atleast 8
                              characters a uppercase and lowercase letter and a
                              number and special character.
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="exampleInputPassword1">Role*</label>
                          <select
                            className="form-control"
                            onChange={(e) => {
                              setRole(e.target.value);
                            }}
                            style={{
                              borderColor:
                                typeError === 1 && role.length === 0
                                  ? "red"
                                  : "none",
                            }}
                            value={role}
                          >
                            <option value="">--Please Select Role--</option>

                            {rolesDropdownList.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          {typeError == 1 && (
                            <span className="text-red">
                              Please fill out all the mandatory fields correctly
                            </span>
                          )}
                        </div>

                        {emailError == 1 && (
                          <span className="text-red">
                            Email Id already exists.
                          </span>
                        )}
                      </div>

                      <div className="card-footer">
                        {query.id ? (
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
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              onSubmit();
                            }}
                          >
                            Submit
                          </button>
                        )}

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
addUser.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return { userAgent };
};
export default addUser;
