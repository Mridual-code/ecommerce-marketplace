import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import BookingStatusBadge from "../components/BookingStatusBadge";
import "../styles/services.css";

function MyServiceBookings() {
  const [bookings, setBookings] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get(
        "/service-bookings/my"
      );

      setBookings(res.data.bookings || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load service bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    const confirmed = window.confirm(
      "Cancel this service booking?"
    );

    if (!confirmed) return;

    try {
      await API.patch(
        `/service-bookings/${id}/cancel`
      );

      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to cancel booking"
      );
    }
  };

  return (
    <main className="my-service-bookings-page">
      <div className="section-heading">
        <p>My Garage</p>
        <h1>Service Bookings</h1>
      </div>

      {loading ? (
        <p className="status-text">
          Loading bookings...
        </p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article
              className="customer-booking-card"
              key={booking._id}
            >
              <div>
                <BookingStatusBadge
                  status={booking.status}
                />

                <h2>{booking.serviceName}</h2>

                <p>
                  {booking.vehicleDetails.brand}{" "}
                  {booking.vehicleDetails.model} •{" "}
                  {
                    booking.vehicleDetails
                      .registrationNumber
                  }
                </p>
              </div>

              <div className="booking-meta">
                <p>
                  <span>Date</span>
                  {new Date(
                    booking.bookingDate
                  ).toLocaleDateString("en-IN")}
                </p>

                <p>
                  <span>Time</span>
                  {booking.timeSlot}
                </p>

                <p>
                  <span>Price</span>₹
                  {Number(
                    booking.servicePrice
                  ).toLocaleString("en-IN")}
                </p>
              </div>

              {["Pending", "Confirmed"].includes(
                booking.status
              ) && (
                <button
                  onClick={() =>
                    cancelBooking(booking._id)
                  }
                >
                  Cancel Booking
                </button>
              )}
            </article>
          ))}
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <p className="service-empty">
          You have not booked any services yet.
        </p>
      )}
    </main>
  );
}

export default MyServiceBookings;