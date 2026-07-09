import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const cars = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSdtgeeDHo5z4GdaeysK3SwpyUEbGMoS7qoutB9Jky3w&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9vUIMkQjM0PuuAKXvp579LTlkFMNthwW7u5CsQYtvFA&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQvTTYvz1v9eIEav46VlrWURzjNRt7B8vRu8hYD35SBw&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLRF0z04vE8ojy-vOw19FUlj_AMCtlP0ts_iUHDbt9kw&s=10",
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
        background: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.75)), url(${cars[currentCar]})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
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