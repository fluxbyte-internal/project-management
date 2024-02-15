import { UserRoleEnumValue } from '@backend/src/schemas/enums';
import AdminDashboard from './adminDashboard';
import ManagerDashboard from './managerDashboard';
import { useUser } from '@/hooks/useUser';

function Dashboard() {
  const { user } = useUser();

  return (
    <>
      {user?.userOrganisation[0]?.role === UserRoleEnumValue.ADMINISTRATOR ? (
        <>
          {' '}
          <AdminDashboard />
        </>
      ) : user?.userOrganisation[0]?.role ===
        UserRoleEnumValue.PROJECT_MANAGER ? (
        <>
          <ManagerDashboard />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
export default Dashboard;
