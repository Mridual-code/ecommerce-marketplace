import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const cars = [
     {
    image: "/hero/BMW.jpeg",
    position: "center",
  },
  {
    image: "/hero/gtr.jpeg",
    position: "center top",
  },
  {
    image: "/hero/mazda.jpeg",
    position: "center",
  },
  {
    image: "/hero/SUPRA.jpeg",
    position: "center",
  },
  {
    image: "/hero/viper.jpeg",
    position: "center",
  },
  ];

  const [currentCar, setCurrentCar] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCar((prev) => (prev + 1) % cars.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="hero"
  style={{
    background: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.75)), url(${cars[currentCar].image})`,
    backgroundSize: "cover",
    backgroundPosition: cars[currentCar].position,
    backgroundRepeat: "no-repeat",
      }}
    >
      <div className="hero-content">
        <h1>Find Your Dream Car</h1>
        <p>
          Buy premium cars from trusted sellers with a smooth and secure
          marketplace experience.
        </p>

        <div className="hero-buttons">
          <Link to="/products" className="primary-btn">
            Explore Cars
          </Link>

          <Link to="/register" className="secondary-btn">
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;