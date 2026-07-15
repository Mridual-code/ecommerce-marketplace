import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import ServiceCard from "../components/ServiceCard";
import "../styles/services.css";

function Modifications() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] =
    useState("All");
  const [loading, setLoading] = useState(true);

  const fetchPageData = async () => {
    try {
      setLoading(true);

      const [serviceResponse, departmentResponse] =
        await Promise.all([
          API.get("/services?available=true"),
          API.get("/departments")
        ]);

      setServices(
        serviceResponse.data.services || []
      );

      const modificationDepartment = (
        departmentResponse.data.departments || []
      ).find(
        (department) =>
          department.name.toLowerCase() ===
          "modifications"
      );

      if (modificationDepartment) {
        const productResponse = await API.get(
          `/products?department=${modificationDepartment._id}`
        );

        setProducts(
          productResponse.data.products || []
        );
      }
    } catch (error) {
      console.log(
        "Modification page error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        services.map(
          (service) => service.category
        )
      )
    ],
    [services]
  );

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter(
          (service) =>
            service.category === activeCategory
        );

  return (
    <main className="modifications-page">
      <section className="modifications-hero">
        <div className="modifications-overlay" />

        <div className="modifications-hero-content">
          <p className="modifications-eyebrow">
            Built Different
          </p>

          <h1>
            Transform Your Car Into Something
            <span> Unforgettable.</span>
          </h1>

          <p>
            Discover premium parts and book
            professional modification services
            designed around your car.
          </p>

          <div className="modifications-buttons">
            <a href="#services">
              Explore Services
            </a>

            <a
              href="#parts"
              className="secondary-button"
            >
              Shop Modification Parts
            </a>
          </div>
        </div>
      </section>

      <section
        className="modification-services-section"
        id="services"
      >
        <div className="section-heading">
          <p>Professional Workshop</p>
          <h2>Modification Services</h2>
          <span>
            From subtle enhancements to complete
            transformations.
          </span>
        </div>

        <div className="service-category-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="status-text">
            Loading services...
          </p>
        ) : (
          <div className="services-grid">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
              />
            ))}
          </div>
        )}

        {!loading &&
          filteredServices.length === 0 && (
            <p className="service-empty">
              No services available in this
              category yet.
            </p>
          )}
      </section>

      <section className="why-modify-section">
        <div className="section-heading">
          <p>Why AutoCart</p>
          <h2>Made for Enthusiasts</h2>
        </div>

        <div className="why-modify-grid">
          <div>
            <strong>01</strong>
            <h3>Expert Technicians</h3>
            <p>
              Experienced professionals working
              with modern equipment.
            </p>
          </div>

          <div>
            <strong>02</strong>
            <h3>Premium Materials</h3>
            <p>
              Trusted parts and materials from
              established automotive brands.
            </p>
          </div>

          <div>
            <strong>03</strong>
            <h3>Transparent Pricing</h3>
            <p>
              Clear starting prices before you
              submit your booking.
            </p>
          </div>
        </div>
      </section>

      <section
        className="modification-products-section"
        id="parts"
      >
        <div className="section-heading">
          <p>Performance Store</p>
          <h2>Modification Products</h2>
          <span>
            Tyres, alloys, body kits, spoilers,
            lighting, exhausts and more.
          </span>
        </div>

        <div className="products-grid">
          {products.slice(0, 6).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>

        {!loading && products.length === 0 && (
          <p className="service-empty">
            Modification products will appear
            here after they are added.
          </p>
        )}

        {products.length > 6 && (
          <Link
            to="/products"
            className="view-all-services"
          >
            View All Products
          </Link>
        )}
      </section>

      <section className="modification-cta">
        <p>Not sure what your car needs?</p>
        <h2>
          Let AutoCart help build your vision.
        </h2>
        <a href="#services">
          Find a Service
        </a>
      </section>
    </main>
  );
}

export default Modifications;