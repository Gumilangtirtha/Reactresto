import React from 'react';
import Nav from '../Nav';

const Layout = ({ children }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 bg-light min-vh-100">
          <Nav />
        </div>
        <div className="col-md-10 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
