import Select from "react-select";
export const multiSelect = ({
  check,
  label,
  selectedValue,
  setSelectedValue,
  optionsArray,
}) => {
  function handleSelectedValue(data) {
    setSelectedValue(data);
  }
  const isAllOptionSelected = selectedValue.some(
    (option) => option.value === "All"
  );
  const optionsWithDisabledAll = optionsArray.map((option) => ({
    ...option,
    isDisabled:
      option.value === "All" ? selectedValue.length > 0 : isAllOptionSelected,
  }));
  return (
    <>
      {check ? (
        <div className="filter-filter">
          <label>{label}</label>
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
      ) : (
        <></>
      )}
    </>
  );
};
