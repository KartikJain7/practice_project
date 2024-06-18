import axios from "axios";
import { frontUrl, backendUrl } from "../config/config";

export const getLocalStorage = () => {
  let token = localStorage.getItem("tkn");
  if (token && token != "" && token != undefined) {
    return true;
  } else {
    return false;
  }
};
export const checkTokenExpirationMiddleware = () => {
  const tokens = JSON.parse(localStorage.getItem("tkn"));
  var base64Url = tokens.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  var object = JSON.parse(jsonPayload);

  if (object.exp < Date.now() / 1000) {
    localStorage.clear("tkn");
    window.location.href = `${frontUrl}login`;
  }
};
export class IdleTimer {
  constructor({ timeout, onTimeout, onExpired }) {
    this.timeout = timeout;
    this.onTimeout = onTimeout;

    const expiredTime = parseInt(localStorage.getItem("_expiredTime"), 10);
    if (expiredTime > 0 && expiredTime < Date.now()) {
      onExpired();
      return;
    }

    this.eventHandler = this.updateExpiredTime.bind(this);
    this.tracker();
    this.startInterval();
  }

  startInterval() {
    this.updateExpiredTime();

    this.interval = setInterval(() => {
      const expiredTime = parseInt(localStorage.getItem("_expiredTime"), 10);
      if (expiredTime < Date.now()) {
        if (this.onTimeout) {
          this.onTimeout();
          this.cleanUp();
        }
      }
    }, 1000);
  }

  updateExpiredTime() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }
    this.timeoutTracker = setTimeout(() => {
      localStorage.setItem("_expiredTime", Date.now() + this.timeout * 1000);
    }, 300);
  }

  tracker() {
    window.addEventListener("mousemove", this.eventHandler);
    window.addEventListener("scroll", this.eventHandler);
    window.addEventListener("keydown", this.eventHandler);
  }

  cleanUp() {
    localStorage.removeItem("_expiredTime");
    clearInterval(this.interval);
    window.removeEventListener("mousemove", this.eventHandler);
    window.removeEventListener("scroll", this.eventHandler);
    window.removeEventListener("keydown", this.eventHandler);
  }
}

export const tkndetails = () => {
  let tokens = localStorage.getItem("tkn");

  if (tokens && tokens != "" && tokens != undefined) {
    var base64Url = tokens.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    var object = JSON.parse(jsonPayload);

    return object;
  }else{
    return false
  }
};

export const convertDate = (date) => {
  if (typeof date == "string") date = new Date(date);
  var day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
  var month =
    date.getMonth() + 1 <= 9
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var dateString = day + "-" + month + "-" + date.getFullYear();

  return dateString;
};
export const getPages = (id) => {
  let finalArr = [];
  if (id) {
    axios
      .get(`${backendUrl}getPagesId/${id}`)
      .then((response) => {
        for (let u = 0; u < response.data.length; u++) {
          finalArr.push(response.data[u]);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return finalArr;
  }
};
export const checkNumber = (inputtxt) => {
  if (/^[0-9]+$/.test(inputtxt)) {
    return false;
  } else {
    return true;
  }
};

export const checkEmail = (inputtxt) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputtxt)) {
    return false;
  } else {
    return true;
  }
};
export const checkPassword = (inputtxt) => {
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      inputtxt
    )
  ) {
    return false;
  } else {
    return true;
  }
};
export const convrtDateTwlveHr = (date) => {
  if (typeof date == "string") date = new Date(date);
  var day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
  var month =
    date.getMonth() + 1 <= 9
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var dateString =
    day +
    "-" +
    month +
    "-" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  let TwentyFourHourtime = dateString.split(" ");
  let timeString = TwentyFourHourtime[1].split(":");

  let TwelveHourtime = format(timeString[0], timeString[1]);

  return TwentyFourHourtime[0] + "  " + TwelveHourtime;
};
export const format = (H, M) => {
  return `${(H % 12 < 10 ? "0" : "") + (H % 12)} : ${
    (M < 10 ? "0" : "") + M
  }  ${H < 12 ? "AM" : "PM"}`;
};

export const checkAccPhnNo = (inputtxt) => {
  if (/^[0-9]+$/.test(inputtxt)) {
    if (inputtxt.length == 10) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

export const sidebarClass = ({ collapseMenu }) => {
  return collapseMenu == 0 ? "sidebar-open" : "sidebar-closed sidebar-collapse";
};
export const handlePopUp = ({ popUp, setPopUp }) => {
  if (popUp == 1) {
    setPopUp(0);
  }
};
export const handleContentClick = ({
  collapseMenu,
  isMobile,
  setCollapseMenu,
}) => {
  if (collapseMenu == 0 && isMobile) {
    setCollapseMenu(1);
  }
};

export const logoutUser = (id) => {
  axios
    .put(`${backendUrl}logout`, {
      userId: id,
    })
    .then((response) => {})
    .catch((error) => {
      console.log(error, "error");
    });
};
export const getRandomString = (length) => {
  let randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let randomNums = "12345678901234567890";
  let result = "";
  for (let e = 0; e < length; e++) {
    if (result.length < 15) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
      result += randomNums.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
    }
  }
  result += Math.floor(Date.now() / 1000);

  return result;
};
