import { useNavigate } from "react-router-dom";

function Test() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "grid",
        placeContent: "center",
      }}
    >
      <h1>Test</h1>
      <button className="button" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}

export default Test;
