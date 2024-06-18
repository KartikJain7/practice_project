import { useState, useEffect } from "react";
import { backendUrl } from "../config/config";
import { getLocalStorage } from "../config/helper";
import { useAuth } from "../config/AuthContext";
import axios from "axios";
export default function login() {
  const { setLoggedIn, loggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(0);

  useEffect(() => {
    let token = getLocalStorage();

    if (token && loggedIn) {
      window.location.href = "/";
    }
  }, []);
  const getPages = (id) => {
    axios
      .get(`${backendUrl}getPagesId/${id}`)
      .then((response) => {
        localStorage.setItem("_datasss", JSON.stringify(response.data));

        setTimeout((window.location.href = "/"), 5000);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };
  const postdata = async () => {
    try {
      const response = await axios.post(`${backendUrl}postlogindata`, {
        email,
        password,
      });
      const data = response.data;

      if (!data.loginData.err) {
        setLoggedIn(true);
        localStorage.setItem("tkn", JSON.stringify(data.loginData.token));
        getPages(data.loginData.data[0].id);
      }
      if (data.loginData.err) {
        setEmailError(1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="card card-outline card-primary">
          <div className="card-header text-center">
            <a href="#" className="h3">
              <b>Hello!</b>
            </a>
          </div>
          <div className="card-body">
            <p className="login-box-msg">Login to get started</p>

            <div className="input-group mb-4">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <div className="input-group mb-4">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock"></span>
                </div>
              </div>
              <div className="col-12">
                <div className="text-red">
                  {emailError == 1 && (
                    <label htmlFor="remember">Invalid Login Credentials </label>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-8"></div>

              <div className="col-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={() => {
                    postdata();
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
