import {
  useEffect,
  useMemo,
  useState
} from "react";
import API from "../api/axios";

function ServiceCalendar({
  customer = false
}) {
  const [bookings, setBookings] =
    useState([]);
  const [month, setMonth] = useState(
    new Date()
  );
  const [calendarLoading, setCalendarLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setCalendarLoading(true);
        setError("");

        const url = customer
          ? "/service-bookings/my"
          : "/service-bookings";

        /*
          Calendar data loads silently because the
          dashboard already controls the main loader.
        */
        const res = await API.get(url, {
          skipLoader: true
        });

        setBookings(
          res.data.bookings || []
        );
      } catch (error) {
        console.log(
          "Calendar booking error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load service calendar"
        );
      } finally {
        setCalendarLoading(false);
      }
    };

    fetchBookings();
  }, [customer]);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const days = useMemo(() => {
    const firstDay = new Date(
      year,
      monthIndex,
      1
    ).getDay();

    const totalDays = new Date(
      year,
      monthIndex + 1,
      0
    ).getDate();

    const cells = [];

    for (
      let index = 0;
      index < firstDay;
      index += 1
    ) {
      cells.push(null);
    }

    for (
      let day = 1;
      day <= totalDays;
      day += 1
    ) {
      cells.push(day);
    }

    /*
      Complete the final calendar row so the
      calendar grid remains properly aligned.
    */
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [year, monthIndex]);

  const bookingsByDay = useMemo(() => {
    const groupedBookings = {};

    bookings.forEach((booking) => {
      if (!booking.bookingDate) return;

      const date = new Date(
        booking.bookingDate
      );

      if (
        date.getFullYear() !== year ||
        date.getMonth() !== monthIndex
      ) {
        return;
      }

      const day = date.getDate();

      if (!groupedBookings[day]) {
        groupedBookings[day] = [];
      }

      groupedBookings[day].push(booking);
    });

    return groupedBookings;
  }, [bookings, year, monthIndex]);

  const changeMonth = (amount) => {
    setMonth(
      new Date(
        year,
        monthIndex + amount,
        1
      )
    );
  };

  const goToCurrentMonth = () => {
    setMonth(new Date());
  };

  return (
    <section className="service-calendar">
      <div className="calendar-heading">
        <div>
          <p className="dashboard-label">
            Appointments
          </p>

          <h2>Service Calendar</h2>
        </div>

        <div className="calendar-controls">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            title="Previous month"
            aria-label="Previous month"
          >
            ‹
          </button>

          <strong>
            {month.toLocaleDateString(
              "en-IN",
              {
                month: "long",
                year: "numeric"
              }
            )}
          </strong>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            title="Next month"
            aria-label="Next month"
          >
            ›
          </button>

          <button
            type="button"
            className="calendar-today-button"
            onClick={goToCurrentMonth}
          >
            Today
          </button>
        </div>
      </div>

      {calendarLoading && (
        <p className="status-text">
          Loading appointments...
        </p>
      )}

      {error && (
        <p className="status-text error-text">
          {error}
        </p>
      )}

      {!calendarLoading && !error && (
        <>
          <div className="calendar-weekdays">
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat"
            ].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map((day, index) => {
              const dayBookings =
                day
                  ? bookingsByDay[day] || []
                  : [];

              const today = new Date();

              const isToday =
                day &&
                today.getFullYear() === year &&
                today.getMonth() ===
                  monthIndex &&
                today.getDate() === day;

              return (
                <div
                  className={[
                    "calendar-day",
                    !day ? "empty" : "",
                    isToday ? "today" : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={`${year}-${monthIndex}-${index}`}
                >
                  {day && (
                    <>
                      <strong className="calendar-date">
                        {day}
                      </strong>

                      {dayBookings.map(
                        (booking) => (
                          <div
                            className={`calendar-booking status-${booking.status
                              .toLowerCase()
                              .replaceAll(
                                " ",
                                "-"
                              )}`}
                            key={booking._id}
                            title={`${booking.serviceName} — ${booking.timeSlot}`}
                          >
                            <span>
                              {
                                booking.serviceName
                              }
                            </span>

                            <small>
                              {booking.timeSlot}
                            </small>

                            {!customer &&
                              booking.user
                                ?.name && (
                                <small>
                                  {
                                    booking
                                      .user.name
                                  }
                                </small>
                              )}

                            <small>
                              {booking.status}
                            </small>
                          </div>
                        )
                      )}

                      {dayBookings.length ===
                        0 && (
                        <span className="calendar-no-bookings">
                          No appointments
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default ServiceCalendar;