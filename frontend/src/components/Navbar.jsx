import {
  useEffect,
  useRef,
  useState
} from "react";
import {
  Link,
  useLocation
} from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaUser
} from "react-icons/fa";
import API from "../api/axios";

function Navbar({ user }) {
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [carCategories, setCarCategories] =
    useState([]);
  const [carsOpen, setCarsOpen] =
    useState(false);
  const [wishlistCount, setWishlistCount] =
    useState(0);
  const [cartCount, setCartCount] =
    useState(0);

  const dashboardPath =
    user?.role === "Admin"
      ? "/admin"
      : user?.role === "Manager"
        ? "/manager"
        : "/customer";

  const fetchCarCategories = async () => {
    try {
      const departmentResponse =
       await API.get("/departments", {
  skipLoader: true
});
      const carsDepartment = (
        departmentResponse.data.departments || []
      ).find(
        (department) =>
          department.name.toLowerCase() ===
          "cars"
      );

      if (!carsDepartment) return;

      const categoryResponse = await API.get(
  `/categories?department=${carsDepartment._id}`,
  {
    skipLoader: true
  }
);

      setCarCategories(
        categoryResponse.data.categories || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomerCounts = async () => {
    if (user?.role !== "Customer") {
      setWishlistCount(0);
      setCartCount(0);
      return;
    }

    try {
      const [wishlistResponse, cartResponse] =
  await Promise.all([
    API.get("/wishlist/count", {
      skipLoader: true
    }),
    API.get("/cart", {
      skipLoader: true
    })
  ]);

      const items =
        cartResponse.data.cart?.items ||
        cartResponse.data.items ||
        [];

      setCartCount(
        items.reduce(
          (total, item) =>
            total + Number(item.quantity || 0),
          0
        )
      );
    } catch (error) {
      console.log(
        "Navbar count error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchCarCategories();
  }, []);

  useEffect(() => {
    fetchCustomerCounts();

    window.addEventListener(
      "wishlist-updated",
      fetchCustomerCounts
    );

    window.addEventListener(
      "cart-updated",
      fetchCustomerCounts
    );

    return () => {
      window.removeEventListener(
        "wishlist-updated",
        fetchCustomerCounts
      );

      window.removeEventListener(
        "cart-updated",
        fetchCustomerCounts
      );
    };
  }, [user]);

  useEffect(() => {
    setCarsOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setCarsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      closeDropdown
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        closeDropdown
      );
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
              setCarsOpen((value) => !value)
            }
          >
            Cars
            <span>⌄</span>
          </button>

          {carsOpen && (
            <div className="cars-dropdown-menu">
              {carCategories.map((category) => (
                <Link
                  key={category._id}
                  to={`/cars?category=${category._id}`}
                >
                  {category.name}
                </Link>
              ))}

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

        {user?.role === "Customer" && (
          <>
            <Link
              to="/wishlist"
              className="nav-icon-link"
              title="Wishlist"
            >
              <FaHeart />
              {wishlistCount > 0 && (
                <span>{wishlistCount}</span>
              )}
            </Link>

            <Link
              to="/cart"
              className="nav-icon-link"
              title="Cart"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span>{cartCount}</span>
              )}
            </Link>
          </>
        )}

        {user && (
          <Link
            to={dashboardPath}
            className="dashboard-icon-link"
            title={`${user.role} Dashboard`}
          >
            <FaUser />
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