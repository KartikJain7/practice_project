import Menu from "../../../Components/layout/Menu";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { backendUrl, frontUrl } from "../../../config/config";
import Header from "../../../Components/layout/Header";
import Footer from "../../../Components/layout/Footer";
import {
  tkndetails,
  handleContentClick,
  handlePopUp,
  sidebarClass,
  checkAccPhnNo,
} from "../../../config/helper";
import { FormSelect, FormInput, FormInputErr, FormInputPhone } from "@/Components/formInput";

const templates = ({ userAgent }) => {
  //all use states
  const [collapseMenu, setCollapseMenu] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { query } = useRouter();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phoneCount, setPhoneCount] = useState([]);
  const [phone, setPhone] = useState([]);
  const [statesArr, setStatesArr] = useState([]);
  const [cityArr, setCityArr] = useState([]);
  const [usrNameArr, setUsrNameArr] = useState([]);
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [address, setAddress] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [id, setId] = useState("");
  const [userId, setUserId] = useState("");
  const [contactFormErr, setContactFormErr] = useState(false);
  const [popUp, setPopUp] = useState(0);
  const paramArr = [name, phone, address, cityName, createdBy, stateName];
  //all useEffects
  useEffect(() => {
    getStateCityList();
  }, [stateName]);

  useEffect(() => {
    getUserNames();
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (query.id) {
      getContactInfo(query.id);
      setId(query.id);
    }
  }, [router.isReady]);

  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, [userAgent]);
  useEffect(() => {
    checkInputs();
  }, [name, phone, address, cityName, stateName]);

  //functions
  const getStateCityList = async () => {
    await axios
      .post(`${backendUrl}cityStateList`, {
        stateName,
      })
      .then((response) => {
        setCityArr(response.data.cityArr);
        setStatesArr(response.data.stateArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getUserNames = async () => {
    await axios
      .get(`${backendUrl}userNames`, {
        stateName,
      })
      .then((response) => {
        const array = response.data.map((item, index) => ({
          name: item.user_name,
          id: item.user_name,
        }));
        setUsrNameArr(array);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getContactInfo = async (id) => {
    await axios
      .get(`${backendUrl}contactInfo/${id}`)
      .then((response) => {
     
        const data = response.data;
       
        setName(data.name);
        setPhone(data.phoneArra);
        setPhoneCount(data.phoneArra)
        setAddress(data.location);
        setCityName(data.city);
        setStateName(data.state);
        setCreatedBy(data.created_by);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkInputs = () => {
    contactFormErr &&
      setContactFormErr(
        paramArr.some((input) => input === "") || phone.every(checkAccPhnNo)
          ? true
          : false
      );
  };
  

  const onSubmit = () => {
    const error =
      paramArr.some((input) => input === "") || phone.every(checkAccPhnNo)
        ? true
        : false;
    setContactFormErr(error);
    if (error == false) {
      axios
        .post(`${backendUrl}addNewContact`, {
          paramArr,
        })
        .then((response) => {
          const resp = response.data;
          if (resp.status_code === 0) {
            router.push("/directory/contacts", undefined, {
              shallow: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handlePhoneChange = (event, index) => {
   
    const newPhoneList = [...phone]; 
    newPhoneList[index] = event.target.value; 
    setPhone(newPhoneList); 
  };
  const onUpdate = () => {
    let updateArr = [name, phone, address, cityName, stateName, createdBy, id];
    const error =
      updateArr.some((input) => input === "")  || phone.every(checkAccPhnNo)
        ? true
        : false;
    setContactFormErr(error);
    if (error == false) {
      axios
        .put(`${backendUrl}updateContact`, {
          updateArr,
        })
        .then((response) => {
          const resp = response.data;
          resp.status_code == 0 &&
            router.push("/directory/contacts", undefined, {
              shallow: true,
            });
        })
        .catch((error) => {
          console.log(error);
        });
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
                  <h1>Contact</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="card card-default">
              <div className="card-header">
                <h3 className="card-title">
                  {query.id ? `Edit Contact` : `Add Contact`}
                </h3>
              </div>

              <form onSubmit={(e)=>{
e.preventDefault()
              }}>
                <div className="card-body">
                  <div className="row">
                  <div className="col-md-6">
                  <FormInput
                        label={"Name*"}
                        value={name}
                        state={setName}
                        condition={contactFormErr && name == ""}
                      />
                      <FormSelect
                        label={"State*"}
                        optionsArr={statesArr}
                        value={stateName}
                        state={setStateName}
                        condition={contactFormErr && stateName == ""}
                      />
                      <FormSelect
                        label={"User Name*"}
                        optionsArr={usrNameArr}
                        value={createdBy}
                        state={setCreatedBy}
                        condition={contactFormErr && createdBy == ""}
                      />
                    </div>
                    <div className="col-md-6">
                      <FormInput
                        label={"Address"}
                        value={address}
                        state={setAddress}
                        condition={contactFormErr && address == ""}
                      />
                      <FormSelect
                        label={"City*"}
                        optionsArr={cityArr}
                        value={cityName}
                        state={setCityName}
                        condition={contactFormErr && cityName == ""}
                      />
                       <label htmlFor="exampleInputEmail1">Phone*</label>
                      <div className="input-group">
     
     <input
       type="text"
       value={phone[0]}
       className={`form-control ${contactFormErr && checkAccPhnNo(phone[0]) ? "is-invalid" : ""}`}
       id="exampleInputEmail1"
       placeholder="Primary Phone"
       onChange={(event) => handlePhoneChange(event, 0)}
     />
     <div className="input-group-btn">
<button type="button" className="btn btn-success" onClick={()=>{
     const newPhoneCount = [...phone, ""];
     setPhone(newPhoneCount);
}}><i className="fa fa-plus"></i></button>
</div>
     
   </div>
                     {
  phone.map((item, index) => (

    <> 
    {index>0 &&  <div key={index} className="input-group" style={{marginTop:"10px"}}>
     
     <input
       type="text"
       value={item}
       className={`form-control ${contactFormErr && checkAccPhnNo(item) ? "is-invalid" : ""}`}
       id="exampleInputEmail1"
       placeholder={`Phone No. ${index+1}`  } 
       onChange={(event) => handlePhoneChange(event, index)}
     />
     
     
   </div>}
   </>







    

  ))
}
                    </div>
                   
                   
                   
                  </div>

                  <FormInputErr condition={contactFormErr} />
                  <div className="card-footer">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        query.id ? onUpdate() : onSubmit();
                      }}
                    >
                      {query.id ? `Update` : `Submit`}
                    </button>

                    <button
  className="btn btn-default float-right"
  onClick={() => {
  
     window.location.href = `${frontUrl}directory/contacts`;
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
