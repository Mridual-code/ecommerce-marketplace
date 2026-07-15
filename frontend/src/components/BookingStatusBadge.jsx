function BookingStatusBadge({ status }) {
  const safeStatus = status || "Pending";

  const statusClass = safeStatus
    .toLowerCase()
    .replaceAll(" ", "-");

  return (
    <span
      className={`booking-status ${statusClass}`}
    >
      {safeStatus}
    </span>
  );
}

export default BookingStatusBadge;