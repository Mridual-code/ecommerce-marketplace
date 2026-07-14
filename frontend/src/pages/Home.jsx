import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
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

  const [currentCar, setCurrentCar] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCar(
        (previous) =>
          (previous + 1) % cars.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [cars.length]);

  return (
    <section
      className="hero"
      style={{
        background: `linear-gradient(
          rgba(0, 0, 0, 0.45),
          rgba(0, 0, 0, 0.75)
        ), url(${cars[currentCar].image})`,
        backgroundSize: "cover",
        backgroundPosition:
          cars[currentCar].position,
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="hero-content">
        <p className="tagline">
          Cars. Merchandise. Modifications.
        </p>

        <h1>
          Everything Automotive in One Place
        </h1>

        <p>
          Buy premium cars, discover automobile
          merchandise and explore modification
          products through AutoCart.
        </p>

        <div className="hero-buttons">
          <Link
            to="/cars"
            className="primary-btn"
          >
            Explore Cars
          </Link>

          <Link
            to="/merchandise"
            className="secondary-btn"
          >
            Shop Merchandise
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;