import { Link } from "react-router-dom";

function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <div className="service-card-image">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
          />
        ) : (
          <div className="service-no-image">
            Service Image
          </div>
        )}

        <span className="service-category">
          {service.category}
        </span>
      </div>

      <div className="service-card-content">
        <h3>{service.name}</h3>

        <p>{service.description}</p>

        <div className="service-card-info">
          <div>
            <span>Starting from</span>
            <strong>
              ₹
              {Number(
                service.startingPrice || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <span>Duration</span>
            <strong>{service.duration}</strong>
          </div>
        </div>

        <Link
          to={`/services/${service._id}`}
          className="service-card-button"
        >
          Explore Service
        </Link>
      </div>
    </article>
  );
}

export default ServiceCard;