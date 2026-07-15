import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";
import API from "../api/axios";
import "../styles/services.css";

function ServiceDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [message, setMessage] = useState(
    "Loading service..."
  );

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(
          `/services/${id}`
        );

        setService(res.data.service);
        setMessage("");
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load service"
        );
      }
    };

    fetchService();
  }, [id]);

  const handleBooking = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "Customer") {
      return;
    }

    navigate(`/services/${id}/book`);
  };

  if (!service) {
    return (
      <div className="service-details-page">
        <p className="status-text">
          {message}
        </p>
      </div>
    );
  }

  return (
    <main className="service-details-page">
      <div className="service-details-layout">
        <div className="service-details-image">
          {service.image ? (
            <img
              src={service.image}
              alt={service.name}
            />
          ) : (
            <span>No Service Image</span>
          )}
        </div>

        <div className="service-details-content">
          <span className="service-category">
            {service.category}
          </span>

          <h1>{service.name}</h1>
          <p>{service.description}</p>

          <div className="service-details-facts">
            <div>
              <span>Starting Price</span>
              <strong>
                ₹
                {Number(
                  service.startingPrice
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Estimated Duration</span>
              <strong>
                {service.duration}
              </strong>
            </div>
          </div>

          {service.features?.length > 0 && (
            <div className="service-features">
              <h2>What’s Included</h2>

              {service.features.map(
                (feature, index) => (
                  <div key={`${feature}-${index}`}>
                    <span>✓</span>
                    <p>{feature}</p>
                  </div>
                )
              )}
            </div>
          )}

          {user?.role === "Customer" && (
            <button
              className="book-service-button"
              onClick={handleBooking}
              disabled={!service.isAvailable}
            >
              {service.isAvailable
                ? "Book This Service"
                : "Currently Unavailable"}
            </button>
          )}

          {!user && (
            <button
              className="book-service-button"
              onClick={handleBooking}
            >
              Login to Book
            </button>
          )}

          {(user?.role === "Admin" ||
            user?.role === "Manager") && (
            <Link
              to="/admin/services"
              className="book-service-button"
            >
              Manage Services
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

export default ServiceDetails;