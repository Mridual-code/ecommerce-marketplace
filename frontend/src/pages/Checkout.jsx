import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import BackButton from "../components/BackButton";


function Checkout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    try {
      await API.post("/orders", {
        shippingAddress: form
      });

      navigate("/orders");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="checkout-page">
      <BackButton />
      <h1>Checkout</h1>

      <form className="checkout-form" onSubmit={placeOrder}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
        />

        <input
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          required
        />

        <button type="submit">Place Order</button>

        {message && <p className="status-text error-text">{message}</p>}
      </form>
    </div>
  );
}

export default Checkout;