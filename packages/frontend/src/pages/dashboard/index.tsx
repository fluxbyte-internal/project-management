import { useUser } from "@/hooks/useUser";
import AdminDashboard from "./adminDashboard";
import ManagerDashboard from "./managerDashboard";
// import { Redirect } from 'react-router-dom';
function Dashboard() {
  const { user } = useUser();

  return(
    <>
      {user?.userOrganisation[0]?.role === "ADMINISTRATOR" ? (<> <AdminDashboard /></>) : (<><ManagerDashboard/></>)}
    </>
  );
}
export default Dashboard;