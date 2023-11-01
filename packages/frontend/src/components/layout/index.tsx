import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
