import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import "../styles/services.css";

const initialForm = {
  brand: "",
  model: "",
  year: "",
  registrationNumber: "",
  bookingDate: "",
  timeSlot: "",
  address: "",
  phone: "",
  notes: ""
};

function BookService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [form, setForm] =
    useState(initialForm);
  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(
          `/services/${id}`
        );

        setService(res.data.service);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load service"
        );
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value
    }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await API.post("/service-bookings", {
        serviceId: id,
        vehicleDetails: {
          brand: form.brand,
          model: form.model,
          year: Number(form.year),
          registrationNumber:
            form.registrationNumber
        },
        bookingDate: form.bookingDate,
        timeSlot: form.timeSlot,
        address: form.address,
        phone: form.phone,
        notes: form.notes
      });

      toast.success(
        "Service booked successfully"
      );

      navigate("/service-bookings");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to book service"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="service-booking-page">
      <div className="booking-page-heading">
        <p>Reserve Your Slot</p>
        <h1>Book {service?.name || "Service"}</h1>
        <span>
          Starting from ₹
          {Number(
            service?.startingPrice || 0
          ).toLocaleString("en-IN")}
        </span>
      </div>

      <form
        className="service-booking-form"
        onSubmit={submitBooking}
      >
        <h2>Vehicle Details</h2>

        <div className="booking-form-grid">
          <input
            name="brand"
            placeholder="Vehicle Brand"
            value={form.brand}
            onChange={handleChange}
            required
          />

          <input
            name="model"
            placeholder="Vehicle Model"
            value={form.model}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="year"
            placeholder="Vehicle Year"
            min="1900"
            value={form.year}
            onChange={handleChange}
            required
          />

          <input
            name="registrationNumber"
            placeholder="Registration Number"
            value={form.registrationNumber}
            onChange={handleChange}
            required
          />
        </div>

        <h2>Appointment Details</h2>

        <div className="booking-form-grid">
          <input
            type="date"
            name="bookingDate"
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            value={form.bookingDate}
            onChange={handleChange}
            required
          />

          <select
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Time Slot
            </option>
            <option value="9:00 AM - 11:00 AM">
              9:00 AM - 11:00 AM
            </option>
            <option value="11:00 AM - 1:00 PM">
              11:00 AM - 1:00 PM
            </option>
            <option value="2:00 PM - 4:00 PM">
              2:00 PM - 4:00 PM
            </option>
            <option value="4:00 PM - 6:00 PM">
              4:00 PM - 6:00 PM
            </option>
          </select>

          <input
            name="phone"
            placeholder="10-digit Phone Number"
            pattern="[0-9]{10}"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="address"
          placeholder="Service Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <textarea
          name="notes"
          placeholder="Additional instructions (optional)"
          value={form.notes}
          onChange={handleChange}
        />

        <button disabled={submitting}>
          {submitting
            ? "Booking..."
            : "Confirm Service Booking"}
        </button>
      </form>
    </main>
  );
}

export default BookService;