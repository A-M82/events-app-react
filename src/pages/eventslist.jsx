import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
 
function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  useEffect(() => {
    async function fetchEvents() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
 
        const data = await response.json();
 
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch events");
        }
 
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
 
    fetchEvents();
  }, []);
 
  function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
 
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Events</h1>
        <button style={styles.createBtn} onClick={() => navigate("/events/create")}>
          + New Event
        </button>
      </div>
 
      {loading && <p style={styles.status}>Loading events…</p>}
      {error && <p style={{ ...styles.status, color: "var(--accent)" }}>{error}</p>}
 
      {!loading && !error && events.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No events yet.</p>
          <Link to="/events/create" style={styles.emptyLink}>
            Create your first event →
          </Link>
        </div>
      )}
 
      <div style={styles.grid}>
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "var(--shadow)";
              e.currentTarget.style.borderColor = "var(--accent-border)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <div style={styles.cardDate}>{formatDate(event.date)}</div>
            <h2 style={styles.cardTitle}>{event.title}</h2>
            {event.location && (
              <p style={styles.cardLocation}>📍 {event.location}</p>
            )}
            {event.description && (
              <p style={styles.cardDesc}>{event.description}</p>
            )}
            <span style={styles.cardArrow}>View details →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
 
const styles = {
  page: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "48px 32px",
    textAlign: "left",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: {
    margin: 0,
    fontSize: 40,
    letterSpacing: "-1px",
    color: "var(--text-h)",
  },
  createBtn: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "2px solid var(--accent-border)",
    background: "var(--accent-bg)",
    color: "var(--accent)",
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s, box-shadow 0.2s",
  },
  status: {
    color: "var(--text)",
    fontSize: 16,
    padding: "16px 0",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    borderRadius: 12,
    border: "1px dashed var(--border)",
  },
  emptyText: {
    fontSize: 18,
    color: "var(--text)",
    marginBottom: 12,
  },
  emptyLink: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 24,
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    textDecoration: "none",
    transition: "box-shadow 0.25s, border-color 0.25s",
    cursor: "pointer",
  },
  cardDate: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--accent)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  cardTitle: {
    margin: 0,
    fontSize: 20,
    color: "var(--text-h)",
    fontWeight: 600,
  },
  cardLocation: {
    margin: 0,
    fontSize: 14,
    color: "var(--text)",
  },
  cardDesc: {
    margin: 0,
    fontSize: 14,
    color: "var(--text)",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardArrow: {
    marginTop: 8,
    fontSize: 13,
    color: "var(--accent)",
    fontWeight: 600,
  },
};
 
export default EventsList;