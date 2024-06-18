const Footer = () => {
  let year = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <div className="float-right d-none d-sm-block">
        <b>Version</b> 0.0.1
      </div>
      <strong>
        Copyright © {year} <a href="">Developed By KRITIKA CHAWLA</a>.
      </strong>
      All rights reserved.
    </footer>
  );
};

export default Footer;
