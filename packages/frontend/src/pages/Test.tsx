import { useNavigate } from "react-router-dom";

function Test() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="grid place-content-center">
      <span className="text-3xl">Test</span>
      <button className="button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}

export default Test;
