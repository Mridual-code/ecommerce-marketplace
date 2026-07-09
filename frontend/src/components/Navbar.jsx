import { Link } from "react-router-dom";

function Navbar({ user, setUser }) {
  const logout = () => {
    localStorage.removeItem("autocart_token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Auto<span>Cart</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {user?.role === "Customer" && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/customer">Dashboard</Link>
          </>
        )}

        {user?.role === "Admin" && (
          <Link to="/admin">Dashboard</Link>
        )}

        {user?.role === "Manager" && (
          <Link to="/manager">Dashboard</Link>
        )}

        {!user ? (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        ) : (
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;