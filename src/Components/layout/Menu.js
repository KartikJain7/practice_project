import React, { useEffect, useState } from "react";
import { tkndetails } from "../../config/helper";
import { frontUrl } from "../../config/config";
import axios from "axios";
import { backendUrl } from "../../config/config";
import {
  getLocalStorage,
  checkTokenExpirationMiddleware,
  IdleTimer,
  logoutUser,
} from "../../config/helper";

const Menu = () => {
  //useStates
  const [checkboxParameters, setCheckboxParameters] = useState([]);
  const [checkboxSubParameters, setCheckboxSubParameters] = useState([]);
  const [name, setName] = useState("");
  const [pagesArray, setPagesArray] = useState([]);
  const [moduleParent, setModuleParent] = useState("");
  const [activesMenu, setActivesMenu] = useState({
    moduleName: "",
    status: false,
  });
  const [activesSubMenu, setActivesSubMenu] = useState({
    moduleName: "",
    status: false,
  });
  const [urlModuleKey, setUrlModuleKey] = useState("");
  const [urlSubModuleKey, setUrlSubModuleKey] = useState("");
  //useEffects
  useEffect(() => {
    let token = getLocalStorage();
    if (!token) {
      window.location.href = `${frontUrl}login`;
      localStorage.clear("_expiredTime");
    } else {
      let object = tkndetails();

      setName(object.name);

      checkTokenExpirationMiddleware();
      const timer = new IdleTimer({
        timeout: 1440,
        onTimeout: () => {
          localStorage.clear("tkn");
          localStorage.clear("_expiredTime");
          window.location.href = `${frontUrl}login`;
          logoutUser(object.id);
        },
        onExpired: () => {
          localStorage.clear("tkn");
          localStorage.clear("_expiredTime");
          window.location.href = `${frontUrl}login`;
          logoutUser(object.id);
        },
      });

      return () => {
        timer.cleanUp();
      };
    }
  }, []);
  useEffect(() => {
    activeMenuState();
    getMenu();
  }, []);
  //functions

  const activeMenuState = () => {
    let currentMenuOpt = window.location.href.split("/");
    if (currentMenuOpt.length > 0) {
      setUrlModuleKey(currentMenuOpt[3]);

      getParentName(currentMenuOpt[3]);

      setUrlSubModuleKey(currentMenuOpt[4]);
    }
  };
  const getParentName = (moduleName) => {
    if (moduleName != "")
      axios
        .get(`${backendUrl}getParentModule/${moduleName}`)
        .then((response) => setModuleParent(response.data))
        .catch((err) => console.log(err));
  };

  const getMenu = () => {
    let data = localStorage.getItem("_datasss");
    axios
      .post(`${backendUrl}decryptData`, {
        data: data,
      })
      .then((response) => {
        setPagesArray(response.data);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  };

  const handleMenuClick = (item) => {
    if (checkboxParameters.includes(item)) {
      var index = checkboxParameters.indexOf(item);

      checkboxParameters.splice(index, 1);
    } else {
      checkboxParameters.push(item);
    }

    setActivesMenu((prevState) => ({
      moduleName: item,
      status: !prevState.status,
    }));
  };
  const handleSubMenuClick = (item) => {
    if (checkboxSubParameters.includes(item)) {
      var index = checkboxSubParameters.indexOf(item);

      checkboxSubParameters.splice(index, 1);
    } else {
      checkboxSubParameters.push(item);
    }
    setActivesSubMenu((prevState) => ({
      moduleName: item,
      status: !prevState.status,
    }));
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a className="brand-link">
        <img
          src={`${frontUrl}images/user.png`}
          alt="Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text font-weight-light">Welcome! {name}</span>
      </a>

      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {pagesArray.length > 0 &&
              pagesArray.map((item, index) => (
                <React.Fragment key={index}>
                  <li
                    className={
                      checkboxParameters.includes(item.moduleName) ||
                      moduleParent == item.moduleName
                        ? `nav-item menu-is-opening menu-open `
                        : `nav-item `
                    }
                  >
                    <a
                      onClick={(e) => {
                        handleMenuClick(item.moduleName);
                      }}
                      className={
                        checkboxParameters.includes(item.moduleName) ||
                        moduleParent == item.moduleName
                          ? "nav-link active"
                          : "nav-link"
                      }
                    >
                      <i className={`${item.moduleLeftIcon}`} />
                      <p>
                        {item.moduleName}
                        <i className={`${item.moduleRightIcon}`} />
                      </p>
                    </a>
                    <ul className="nav nav-treeview">
                      {item.pageNameArr.map((pageItem, pageIndex) => (
                        <React.Fragment key={pageIndex}>
                          <li
                            className={
                              pageItem.subModeArr.length == 0
                                ? checkboxSubParameters.includes(
                                    pageItem.page_name
                                  ) || urlSubModuleKey == pageItem.page_name_url
                                  ? "nav-item menu-is-opening menu-open"
                                  : "nav-item"
                                : checkboxSubParameters.includes(
                                    pageItem.page_name
                                  ) || urlModuleKey == pageItem.module_url
                                ? "nav-item menu-is-opening menu-open"
                                : "nav-item"
                            }
                            style={{ marginLeft: "15px" }}
                          >
                            <a
                              className={
                                pageItem.subModeArr.length == 0
                                  ? checkboxSubParameters.includes(
                                      pageItem.page_name
                                    ) ||
                                    urlSubModuleKey == pageItem.page_name_url
                                    ? "nav-link active"
                                    : "nav-link"
                                  : checkboxSubParameters.includes(
                                      pageItem.page_name
                                    ) || urlModuleKey == pageItem.module_url
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                              onClick={(e) => {
                                handleSubMenuClick(pageItem.page_name);
                              }}
                              href={
                                pageItem.subModeArr.length == 0
                                  ? `/${pageItem.module_url}/${pageItem.page_name_url}`
                                  : undefined
                              }
                            >
                              <i className={`${pageItem.page_icon}`} />
                              <p>
                                {pageItem.page_name}
                                {pageItem.subModeArr.length > 0 && (
                                  <i className={`${item.moduleRightIcon}`} />
                                )}
                              </p>
                            </a>
                            <ul className="nav nav-treeview">
                              {pageItem.subModeArr.map((subItem, pageIndex) => (
                                <React.Fragment key={pageIndex}>
                                  <li
                                    className="nav-item"
                                    style={{ marginLeft: "30px" }}
                                  >
                                    <a
                                      className={
                                        urlSubModuleKey == subItem.page_name_url
                                          ? "nav-link active"
                                          : "nav-link"
                                      }
                                      href={`/${subItem.module_url}/${subItem.page_name_url}`}
                                    >
                                      <i className={`${subItem.icon}`} />
                                      <p>{subItem.name}</p>
                                    </a>
                                  </li>
                                </React.Fragment>
                              ))}
                            </ul>
                          </li>
                        </React.Fragment>
                      ))}
                    </ul>
                  </li>
                </React.Fragment>
              ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Menu;
