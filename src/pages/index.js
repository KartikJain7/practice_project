import Menu from "../Components/layout/Menu";
import Header from "../Components/layout/Header";
import Footer from "../Components/layout/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "../config/AuthContext";
import { frontUrl } from "@/config/config";
import {
  getLocalStorage,
  handleContentClick,
  handlePopUp,
  sidebarClass,
} from "../config/helper";
const Home = ({ userAgent }) => {
  const [popUp, setPopUp] = useState(0);
  const [collapseMenu, setCollapseMenu] = useState(0);
  const { loggedIn, setLoggedIn } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    let token = getLocalStorage();
    if (token) {
      setLoggedIn(true);
    } else {
      window.location.href = `${frontUrl}login`;
    }
  }, []);
  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, [userAgent]);
  return (
    <>
      {loggedIn ? (
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
            ></div>
            <Footer />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};
Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return { userAgent };
};
export default Home;
