import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const cars = [
  {
    image: "/hero/BMW.jpeg",
    position: "center"
  },
  {
    image: "/hero/gtr.jpeg",
    position: "center top"
  },
  {
    image: "/hero/mazda.jpeg",
    position: "center"
  },
  {
    image: "/hero/SUPRA.jpeg",
    position: "center"
  },
  {
    image: "/hero/viper.jpeg",
    position: "center"
  }
];

function Home() {
  const [currentCar, setCurrentCar] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCar(
        (previous) =>
          (previous + 1) % cars.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="home-page">
      <section
        className="hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(4, 4, 7, 0.96) 0%,
              rgba(4, 4, 7, 0.72) 45%,
              rgba(4, 4, 7, 0.2) 100%
            ),
            linear-gradient(
              0deg,
              rgba(4, 4, 7, 0.9) 0%,
              transparent 45%
            ),
            url("${cars[currentCar].image}")
          `,
          backgroundPosition:
            cars[currentCar].position
        }}
      >
        <div className="hero-glow" />

        <div className="hero-content">
          <div className="hero-badge">
            <span />
            India’s Automotive Marketplace
          </div>

          <h1>
            Drive it.
            <br />
            Style it.
            <br />
            <em>Make it yours.</em>
          </h1>

          <p className="hero-description">
            Discover premium cars, automotive
            merchandise, performance parts and
            professional modification services
            through one complete marketplace.
          </p>

          <div className="hero-buttons">
            <Link
              to="/cars"
              className="primary-btn"
            >
              Explore Cars
              <span>→</span>
            </Link>

            <Link
              to="/modifications"
              className="secondary-btn"
            >
              Modification Studio
            </Link>
          </div>

          <div className="hero-highlights">
            <div>
              <strong>Premium</strong>
              <span>Curated vehicles</span>
            </div>

            <div>
              <strong>Secure</strong>
              <span>Account and orders</span>
            </div>

            <div>
              <strong>Custom</strong>
              <span>Modification services</span>
            </div>
          </div>
        </div>

        <div className="hero-car-counter">
          <strong>
            {String(currentCar + 1).padStart(
              2,
              "0"
            )}
          </strong>

          <span />

          <p>
            {String(cars.length).padStart(
              2,
              "0"
            )}
          </p>
        </div>
      </section>

      <section className="home-categories">
        <div className="home-section-heading">
          <div>
            <p>Explore AutoCart</p>
            <h2>
              Everything automotive,
              <span> one destination.</span>
            </h2>
          </div>

          <p>
            Whether you are buying your next car,
            upgrading your garage or transforming
            your vehicle, start here.
          </p>
        </div>

        <div className="home-category-grid">
          <Link
            to="/cars"
            className="home-category-card cars-card"
          >
            <div className="category-number">
              01
            </div>

            <div>
              <p>Find your next drive</p>
              <h3>Cars</h3>
              <span>
                Sedans, SUVs, coupes, sports cars
                and more
              </span>
            </div>

            <strong>Explore →</strong>
          </Link>

          <Link
            to="/merchandise"
            className="home-category-card merchandise-card"
          >
            <div className="category-number">
              02
            </div>

            <div>
              <p>Represent the culture</p>
              <h3>Merchandise</h3>
              <span>
                Apparel, collectibles and
                automotive lifestyle products
              </span>
            </div>

            <strong>Shop Now →</strong>
          </Link>

          <Link
            to="/modifications"
            className="home-category-card modifications-card"
          >
            <div className="category-number">
              03
            </div>

            <div>
              <p>Built differently</p>
              <h3>Modifications</h3>
              <span>
                Performance parts and professional
                vehicle services
              </span>
            </div>

            <strong>Start Building →</strong>
          </Link>
        </div>
      </section>

      <section className="home-experience">
        <div className="experience-visual">
          <div className="experience-ring">
            <span>AC</span>
          </div>

          <div className="experience-label label-one">
            Premium Products
          </div>

          <div className="experience-label label-two">
            Expert Services
          </div>

          <div className="experience-label label-three">
            Secure Orders
          </div>
        </div>

        <div className="experience-content">
          <p className="section-eyebrow">
            The AutoCart Experience
          </p>

          <h2>
            More than a marketplace.
            <span> Built for enthusiasts.</span>
          </h2>

          <p>
            AutoCart connects vehicles, products
            and modification services in one
            simple experience while giving you
            complete control through your personal
            dashboard.
          </p>

          <div className="experience-features">
            <div>
              <strong>01</strong>
              <span>
                Browse carefully organised
                automotive departments.
              </span>
            </div>

            <div>
              <strong>02</strong>
              <span>
                Book professional modification
                services online.
              </span>
            </div>

            <div>
              <strong>03</strong>
              <span>
                Track orders, cart items and
                service bookings.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div>
          <p>Ready to enter the garage?</p>
          <h2>
            Your automotive journey begins here.
          </h2>
        </div>

        <Link to="/cars">
          Explore AutoCart
          <span>→</span>
        </Link>
      </section>
    </main>
  );
}

export default Home;