import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function Layout() {
  return (
    <>
      <div className="overflow-hidden">
        <div>
          <NavBar />
        </div>

        <div id="detail" className="mt-14 flex justify-center">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
