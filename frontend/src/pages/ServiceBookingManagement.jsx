import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import BookingStatusBadge from "../components/BookingStatusBadge";
import "../styles/services.css";

const statuses = [
  "Pending",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled"
];

function ServiceBookingManagement() {
  const [bookings, setBookings] =
    useState([]);
  const [statusFilter, setStatusFilter] =
    useState("");

  const fetchBookings = async () => {
    try {
      const query = statusFilter
        ? `?status=${encodeURIComponent(
            statusFilter
          )}`
        : "";

      const res = await API.get(
        `/service-bookings${query}`
      );

      setBookings(res.data.bookings || []);
    } catch (error) {
      toast.error(
        "Failed to load service bookings"
      );
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      await API.patch(
        `/service-bookings/${id}/status`,
        { status }
      );

      toast.success(
        "Booking status updated"
      );
      fetchBookings();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  return (
    <main className="service-management-page">
      <div className="booking-management-heading">
        <h1>Service Bookings</h1>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="">All Statuses</option>

          {statuses.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="service-booking-table-wrap">
        <table className="service-booking-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>
                  <strong>
                    {booking.user?.name}
                  </strong>
                  <span>
                    {booking.user?.email}
                  </span>
                </td>

                <td>{booking.serviceName}</td>

                <td>
                  {booking.vehicleDetails.brand}{" "}
                  {booking.vehicleDetails.model}
                </td>

                <td>
                  {new Date(
                    booking.bookingDate
                  ).toLocaleDateString("en-IN")}
                </td>

                <td>
                  ₹
                  {Number(
                    booking.servicePrice
                  ).toLocaleString("en-IN")}
                </td>

                <td>
                  <BookingStatusBadge
                    status={booking.status}
                  />
                </td>

                <td>
                  <select
                    value={booking.status}
                    disabled={[
                      "Completed",
                      "Cancelled"
                    ].includes(booking.status)}
                    onChange={(e) =>
                      updateStatus(
                        booking._id,
                        e.target.value
                      )
                    }
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default ServiceBookingManagement;