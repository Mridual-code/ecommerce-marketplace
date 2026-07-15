import {
  useEffect,
  useRef,
  useState
} from "react";
import {
  Link,
  useLocation
} from "react-router-dom";
import API from "../api/axios";

function Navbar({ user }) {
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [carCategories, setCarCategories] =
    useState([]);
  const [carsOpen, setCarsOpen] =
    useState(false);

  const dashboardPath =
    user?.role === "Admin"
      ? "/admin"
      : user?.role === "Manager"
        ? "/manager"
        : "/customer";

  const fetchCarCategories = async () => {
    try {
      const departmentResponse =
        await API.get("/departments");

      const carsDepartment = (
        departmentResponse.data.departments || []
      ).find(
        (department) =>
          department.name.toLowerCase() ===
          "cars"
      );

      if (!carsDepartment) {
        setCarCategories([]);
        return;
      }

      const categoryResponse = await API.get(
        `/categories?department=${carsDepartment._id}`
      );

      setCarCategories(
        categoryResponse.data.categories || []
      );
    } catch (error) {
      console.log(
        "Failed to load car categories:",
        error
      );
    }
  };

  useEffect(() => {
    fetchCarCategories();
  }, []);

  useEffect(() => {
    setCarsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setCarsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      closeDropdown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeDropdown
      );
    };
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Auto<span>Cart</span>
      </Link>

      <div className="nav-links">
        <div
          className="nav-dropdown"
          ref={dropdownRef}
        >
          <button
            type="button"
            className={`dropdown-trigger ${
              carsOpen ? "active" : ""
            }`}
            onClick={() =>
              setCarsOpen((current) => !current)
            }
            aria-expanded={carsOpen}
          >
            Cars

            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m7 10 5 5 5-5H7Z" />
            </svg>
          </button>

          {carsOpen && (
            <div className="cars-dropdown-menu">
              {carCategories.length > 0 ? (
                carCategories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/cars?category=${category._id}`}
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <span className="dropdown-empty">
                  No car categories
                </span>
              )}

              <div className="dropdown-divider" />

              <Link
                to="/products"
                className="all-products-option"
              >
                All Products
              </Link>
            </div>
          )}
        </div>

        <Link to="/merchandise">
          Merchandise
        </Link>

        <Link to="/modifications">
          Modifications
        </Link>

        {user && (
          <Link
            to={dashboardPath}
            className="dashboard-icon-link"
            title={`${user.role} Dashboard`}
            aria-label={`${user.role} Dashboard`}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14Z" />
            </svg>
          </Link>
        )}

        {!user && (
          <>
            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-btn"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;