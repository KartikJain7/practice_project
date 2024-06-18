import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "@/config/config";
import Select from "react-select";
import { FormInput } from "./formInput";
export const searchFilter = ({
  check,
  setName,
  setCity,
  setState,
  callFunction,
  city,
  state,
  name,cntctPhn,cntctName,setCntctPhn,setCntctName
}) => {
  
  const [phoneFilter, setPhoneFilter] = useState(false);
  const [usrNameFilter, setUsrNameFilter] = useState(false);
  const [cntctNameFilter, setCntctNameFilter] = useState(false);
  const [cityFilter, setCityFilter] = useState(false);
  const [stateFilter, setStateFilter] = useState(false);
  const [statesArr, setStatesArr] = useState([]);
  const [cityArr, setCityArr] = useState([]);
  const [userNameArr, setUserNameArr] = useState([]);
  useEffect(() => {
    
    getUserName();
  }, []);
  useEffect(() => {
    getStateCityList()
   
  }, [state]);

  const getUserName = async () => {
    await axios
      .get(`${backendUrl}userNames`)
      .then((response) => {
        const usrNameArray = response.data.map((item, index) => ({
          value: item.id,
          label: item.user_name,
          isDisabled: false,
        }));
        setUserNameArr(usrNameArray);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStateCityList = async () => {
    await axios
      .post(`${backendUrl}cityStateList`, {
        stateName: state,
      })
      .then((response) => {
       const arrayCity=response.data.cityArr.map((item,index)=>(
        {
          value: item.id,
          label: item.name,
          isDisabled: false,
        } 
       ))
        setCityArr(arrayCity);


        const arrayState=response.data.stateArr.map((item,index)=>(
          {
            value: item.id,
            label: item.name,
            isDisabled: false,
          } 
         ))
        setStatesArr(arrayState);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return check ? (
    <div>
      <div className="card-header">
      <div class="row">-
<div class="col-sm-2">

<div class="form-group">
<div class="form-check">
<input class="form-check-input" type="checkbox" onClick={()=>{setUsrNameFilter(!usrNameFilter)}} checked={usrNameFilter ? "checked":""}/>
<label class="form-check-label">User Name</label>
</div>


</div>
</div>
<div class="col-sm-2">

<div class="form-group">
<div class="form-check">
<input class="form-check-input" type="checkbox" onClick={()=>{setPhoneFilter(!phoneFilter)}} checked={phoneFilter ? "checked":""}/>
<label class="form-check-label">Phone</label>
</div>

</div>
</div>
<div class="col-sm-2">

<div class="form-group">
<div class="form-check">
<input class="form-check-input" type="checkbox" onClick={()=>{setCntctNameFilter(!cntctNameFilter)}} checked={cntctNameFilter ? "checked":""}/>
<label class="form-check-label">Contact Name</label>
</div>

</div>
</div>
<div class="col-sm-2">

<div class="form-group">
<div class="form-check">
<input class="form-check-input" type="checkbox" onClick={()=>{setStateFilter(!stateFilter)}} checked={stateFilter ? "checked":""}/>
<label class="form-check-label">State</label>
</div>

</div>

</div>
<div class="form-group">
<div class="form-check">
<input class="form-check-input" type="checkbox" onClick={()=>{setCityFilter(!cityFilter)}} checked={cityFilter ? "checked":""}/>
<label class="form-check-label">City</label>
</div>

</div>
</div>
        <div className="row">
          {usrNameFilter && <div className="firstfilterbar">
            <MultiSelect
              label={`Select User Name`}
              selectedValue={name}
              setSelectedValue={setName}
              optionsArray={userNameArr}
            />
          </div> }
          {stateFilter &&   <div className="firstfilterbar">
            <MultiSelect
              label={`Select State`}
              selectedValue={state}
              setSelectedValue={setState}
              optionsArray={statesArr}
            />
          </div>}
        {cityFilter && <div className="firstfilterbar">
            <MultiSelect
              label={`Select City`}
              selectedValue={city}
              setSelectedValue={setCity}
              optionsArray={cityArr}
            />
          </div>}
          {cntctNameFilter && <div className="firstfilterbar">
            <FormInput
              label={`Enter Name`}
              value={cntctName}
              state={setCntctName}
            />
          </div>}
          {phoneFilter && <div className="firstfilterbar" >
         
         <FormInput
           label={`Enter Phone`}
           value={cntctPhn}
           state={setCntctPhn}
           
          
         />
       </div>}
          

          <div
            className="form-group"
            style={{ paddingTop: "30px", marginLeft: "40px" }}
          >
            <button
              type="button"
              id="button-filter"
              className="btn btn-md btn-default"
              onClick={() => {
                callFunction();
              }}
            >
              <i className="fa fa-search"></i> 
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};
export const MultiSelect = ({
  label,
  selectedValue,
  setSelectedValue,
  optionsArray,
}) => {
  function handleSelectedValue(data) {
    setSelectedValue(data);
  }

  const optionsWithDisabledAll = optionsArray.map((option) => ({
    ...option,
  }));
  return (
    <>
      <div className="firstfilterbar">
        <div className="filter-filter">
          <label className="control-label" htmlFor="input-status">
            {label}
          </label>
          <Select
            value={selectedValue}
            placeholder={label}
            isMulti
            name="colors"
            options={optionsWithDisabledAll}
            onChange={handleSelectedValue}
            className="basic-multi-select"
            classNamePrefix="select"
            isSearchable={true}
          />
        </div>
      </div>
    </>
  );
};
