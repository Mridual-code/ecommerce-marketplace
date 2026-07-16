const products = [
  {
    name: "Honda City ZX",
    brand: "Honda",
    model: "City ZX",
    departmentName: "Cars",
    categoryName: "Sedan",
    price: 1620000,
    stock: 8,
    image: "/assets/products/honda-city.jpg",
    description:
      "A comfortable premium sedan with modern safety and convenience features.",
    color: "White",
    year: 2026,
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    name: "BMW 3 Series",
    brand: "BMW",
    model: "330Li",
    departmentName: "Cars",
    categoryName: "Sedan",
    price: 6290000,
    stock: 4,
    image: "/assets/products/bmw-3-series.jpg",
    description:
      "A luxury sports sedan combining performance, comfort and technology.",
    color: "Black",
    year: 2026,
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    name: "Mahindra XUV700",
    brand: "Mahindra",
    model: "AX7",
    departmentName: "Cars",
    categoryName: "SUV",
    price: 2499000,
    stock: 10,
    image: "/assets/products/xuv700.jpg",
    description:
      "A spacious SUV with powerful performance and advanced features.",
    color: "Midnight Black",
    year: 2026,
    fuelType: "Diesel",
    transmission: "Automatic"
  },
  {
    name: "Toyota Fortuner",
    brand: "Toyota",
    model: "Fortuner Legender",
    departmentName: "Cars",
    categoryName: "SUV",
    price: 4764000,
    stock: 5,
    image: "/assets/products/fortuner.jpg",
    description:
      "A premium full-size SUV with strong road presence and off-road capability.",
    color: "Pearl White",
    year: 2026,
    fuelType: "Diesel",
    transmission: "Automatic"
  },
  {
    name: "Porsche 911 Carrera",
    brand: "Porsche",
    model: "911 Carrera",
    departmentName: "Cars",
    categoryName: "Sports Cars",
    price: 19900000,
    stock: 2,
    image: "/assets/products/porsche-911.jpg",
    description:
      "An iconic sports car offering outstanding performance and precision.",
    color: "Guards Red",
    year: 2026,
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    name: "Nissan GT-R",
    brand: "Nissan",
    model: "GT-R",
    departmentName: "Cars",
    categoryName: "Sports Cars",
    price: 21200000,
    stock: 2,
    image: "/assets/products/nissan-gtr.jpg",
    description:
      "A legendary high-performance sports car with advanced all-wheel drive.",
    color: "Gun Metallic",
    year: 2026,
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    name: "Tata Nexon EV",
    brand: "Tata",
    model: "Nexon EV",
    departmentName: "Cars",
    categoryName: "Electric Cars",
    price: 1720000,
    stock: 9,
    image: "/assets/products/nexon-ev.jpg",
    description:
      "A practical electric SUV with modern technology and zero tailpipe emissions.",
    color: "Empowered Oxide",
    year: 2026,
    fuelType: "Electric",
    transmission: "Automatic"
  },
  {
    name: "Hyundai IONIQ 5",
    brand: "Hyundai",
    model: "IONIQ 5",
    departmentName: "Cars",
    categoryName: "Electric Cars",
    price: 4695000,
    stock: 4,
    image: "/assets/products/ioniq-5.jpg",
    description:
      "A futuristic electric vehicle with premium comfort and rapid charging.",
    color: "Gravity Gold",
    year: 2026,
    fuelType: "Electric",
    transmission: "Automatic"
  },
  {
    name: "BMW M4 Competition",
    brand: "BMW",
    model: "M4 Competition",
    departmentName: "Cars",
    categoryName: "Coupes",
    price: 15300000,
    stock: 3,
    image: "/assets/products/bmw-m4.jpg",
    description:
      "A powerful luxury coupe with motorsport-inspired performance.",
    color: "Isle of Man Green",
    year: 2026,
    fuelType: "Petrol",
    transmission: "Automatic"
  },
  {
    name: "Mercedes-AMG CLE 53",
    brand: "Mercedes-Benz",
    model: "AMG CLE 53",
    departmentName: "Cars",
    categoryName: "Coupes",
    price: 18500000,
    stock: 2,
    image: "/assets/products/mercedes-cle.jpg",
    description:
      "A premium performance coupe featuring luxury and advanced technology.",
    color: "Obsidian Black",
    year: 2026,
    fuelType: "Petrol",
    transmission: "Automatic"
  },

  // Merchandise
  {
    name: "AutoCart Racing T-Shirt",
    brand: "AutoCart",
    model: "Racing Edition",
    departmentName: "Merchandise",
    categoryName: "Clothing",
    price: 1299,
    stock: 40,
    image: "/assets/products/racing-tshirt.jpg",
    description:
      "A comfortable cotton T-shirt featuring an AutoCart racing design.",
    color: "Black",
    material: "Cotton",
    ageGroup: "Adults"
  },
  {
    name: "Nissan GT-R Miniature",
    brand: "AutoArt",
    model: "GT-R R35",
    departmentName: "Merchandise",
    categoryName: "Collectibles",
    price: 2499,
    stock: 20,
    image: "/assets/products/gtr-miniature.jpg",
    description:
      "A detailed Nissan GT-R collectible model for car enthusiasts.",
    color: "Blue",
    scale: "1:24",
    material: "Die-cast Metal",
    ageGroup: "14+"
  },
  {
    name: "Carbon Fibre Keychain",
    brand: "AutoCart",
    model: "Carbon Series",
    departmentName: "Merchandise",
    categoryName: "Accessories",
    price: 499,
    stock: 60,
    image: "/assets/products/car-keychain.jpg",
    description:
      "A lightweight automotive keychain with a carbon-fibre appearance.",
    color: "Black",
    material: "Metal and Carbon Fibre"
  },

  // Modifications
  {
    name: "Performance Air Intake",
    brand: "K&N",
    model: "Performance Series",
    departmentName: "Modifications",
    categoryName: "Performance",
    price: 18999,
    stock: 15,
    image: "/assets/products/air-intake.jpg",
    description:
      "A performance air-intake system designed to improve airflow."
  },
  {
    name: "Carbon Fibre Rear Spoiler",
    brand: "AutoCart Customs",
    model: "Sport Wing",
    departmentName: "Modifications",
    categoryName: "Exterior",
    price: 24999,
    stock: 12,
    image: "/assets/products/rear-spoiler.jpg",
    description:
      "A lightweight rear spoiler that adds a sportier exterior appearance.",
    color: "Carbon Black",
    material: "Carbon Fibre"
  },
  {
    name: "Premium Ambient Light Kit",
    brand: "AutoCart Customs",
    model: "RGB Interior Kit",
    departmentName: "Modifications",
    categoryName: "Interior",
    price: 7999,
    stock: 25,
    image: "/assets/products/ambient-light.jpg",
    description:
      "A customizable RGB ambient-lighting kit for vehicle interiors."
  }
];

module.exports = products;