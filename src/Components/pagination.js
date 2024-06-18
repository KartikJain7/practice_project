export const pagination = ({ pgArr, crntPgState }) => {
  return (
    <ul className="pagination pagination-sm float-right">
      <li className="page-item">
        <a className="page-link">&laquo;</a>
      </li>
      {pgArr.map((item, index) => (
        <li className="page-item" key={index}>
          <a className="page-link" onClick={() => crntPgState(item)}>
            {item}
          </a>
        </li>
      ))}
      <li className="page-item">
        <a className="page-link">&raquo;</a>
      </li>
    </ul>
  );
};
