import { NavLink, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const handleLogin  = () =>{
        localStorage.setItem('Token', 'test');
        navigate('/');
    }
  return (
    <>
        <button onClick={handleLogin}>Login</button>
        <NavLink to='/'>Protected route</NavLink>
    </>
  )
}

export default Login