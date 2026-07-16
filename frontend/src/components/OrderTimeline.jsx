const steps = [
  "Pending",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered"
];

function OrderTimeline({ order }) {
  if (order.status === "Cancelled") {
    return (
      <div className="tracking-cancelled">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = steps.indexOf(
    order.status
  );

  return (
    <div className="order-timeline">
      {steps.map((step, index) => (
        <div
          className={`timeline-step ${
            index <= currentIndex
              ? "completed"
              : ""
          }`}
          key={step}
        >
          <span className="timeline-dot">
            {index < currentIndex
              ? "✓"
              : index === currentIndex
                ? "●"
                : "○"}
          </span>

          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}

export default OrderTimeline;