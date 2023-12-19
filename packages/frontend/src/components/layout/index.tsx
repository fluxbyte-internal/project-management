import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
function Layout() {
  return (
    <>
      <div className="overflow-hidden">
        <div>
          <NavBar />
        </div>
        <div id="detail" className="h-[calc(100vh-3.5rem)] mt-14 flex flex-col overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
