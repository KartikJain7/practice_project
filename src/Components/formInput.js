export const FormInput = ({ label, value, state, condition }) => {
  return (
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">{label}</label>
      <input
        type="text"
        value={value}
        className={`form-control ${condition ? "is-invalid" : ""}`}
        id="exampleInputEmail1"
        placeholder={label}
        onChange={(e) => {
          state(e.target.value);
        }}
      />
    </div>
  );
};
export const FormInputPhone = ({ label, value, state, condition }) => {
  return (
    <> <label htmlFor="exampleInputEmail1">{label}</label>
    <div className="input-group">
     
      <input
        type="text"
        value={value}
        className={`form-control ${condition ? "is-invalid" : ""}`}
        id="exampleInputEmail1"
        placeholder={label}
        onChange={(e) => {
          state(e.target.value);
        }}
      />
      <div className="input-group-btn">
<button type="button" className="btn btn-success"><i className="fa fa-plus"></i></button>
</div>
    </div></>
   
  );
};
export const FormSelect = ({ label, optionsArr, state, value, condition }) => {
  return (
    <div className="form-group">
      <label htmlFor="exampleInputPassword1">{label}</label>
      <select
        className={`form-control ${condition ? "is-invalid" : ""}`}
        onChange={(e) => {
          state(e.target.value);
        }}
        value={value}
      >
        <option value="" disabled={true}>
          --Please Select--
        </option>
        {optionsArr.map((item, index) => (
          <option value={item.id} key={index}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export const FormPhoneErr = ({ condition }) => {
  return condition ? (
    <span className="text-red">Enter 10 digit number.</span>
  ) : (
    <></>
  );
};

export const FormEmailErr = ({ condition }) => {
  return condition ? (
    <span className="text-red">Enter Valid Email Id.</span>
  ) : (
    <></>
  );
};
export const FormInputErr = ({ condition }) => {
  return condition ? (
    <span className="text-red">
      Please fill out all the mandatory fields correctly
    </span>
  ) : (
    <></>
  );
};

export const phoneEmailFormInput = ({
  label,
  value,
  state,
  condition,
  inputErr,
  funcName,
}) => {
  return (
    <div className="form-group">
      <label htmlFor="exampleInputEmail1">{label}</label>
      <input
        value={value}
        type="text"
        className={`form-control ${condition ? "is-invalid" : ""}`}
        id="exampleInputEmail1"
        placeholder={label}
        onChange={(e) => {
          state(e.target.value);
          inputErr(funcName(e.target.value));
        }}
      />
    </div>
  );
};
