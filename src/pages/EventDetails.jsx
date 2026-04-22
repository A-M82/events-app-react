import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
 
function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    async function fetchEvent() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3001/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
 
        const data = await response.json();
 
        if (!response.ok) {
          throw new Error(data.message || "Event not found");
        }
 
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
 
    fetchEvent();
  }, [id]);
 
  async function handleDelete() {
    if (!window.confirm("Delete this event?")) return;
 
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete event");
      }
 
      navigate("/events");
    } catch (err) {
      setError(err.message);
    }
  }
 
  function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
 
  function formatTime(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
 
  if (loading) return <p style={styles.status}>Loading…</p>;
  if (error) return <p style={{ ...styles.status, color: "var(--accent)" }}>{error}</p>;
  if (!event) return null;
 
  return (
    <div style={styles.page}>
      <Link to="/events" style={styles.back}>← Back to Events</Link>
 
      <div style={styles.card}>
        <div style={styles.meta}>
          {event.date && (
            <>
              <span style={styles.metaItem}>📅 {formatDate(event.date)}</span>
              <span style={styles.metaDot}>·</span>
              <span style={styles.metaItem}>{formatTime(event.date)}</span>
            </>
          )}
          {event.location && (
            <>
              <span style={styles.metaDot}>·</span>
              <span style={styles.metaItem}>📍 {event.location}</span>
            </>
          )}
        </div>
 
        <h1 style={styles.title}>{event.title}</h1>
 
        {event.description && (
          <p style={styles.description}>{event.description}</p>
        )}
 
        {event.capacity && (
          <div style={styles.badge}>
            👥 Capacity: {event.capacity}
          </div>
        )}
 
        <div style={styles.actions}>
          <button
            style={styles.editBtn}
            onClick={() => navigate(`/events/${id}/edit`)}
          >
            Edit Event
          </button>
          <button style={styles.deleteBtn} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  page: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "48px 32px",
    textAlign: "left",
  },
  status: {
    textAlign: "center",
    padding: "80px 20px",
    color: "var(--text)",
    fontSize: 16,
  },
  back: {
    display: "inline-block",
    marginBottom: 32,
    color: "var(--text)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "color 0.2s",
  },
  card: {
    padding: 40,
    borderRadius: 16,
    border: "1px solid var(--border)",
    background: "var(--bg)",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  metaItem: {
    fontSize: 14,
    color: "var(--text)",
  },
  metaDot: {
    color: "var(--border)",
    fontSize: 14,
  },
  title: {
    margin: "0 0 20px",
    fontSize: 36,
    letterSpacing: "-0.8px",
    color: "var(--text-h)",
    fontWeight: 600,
  },
  description: {
    fontSize: 16,
    lineHeight: "165%",
    color: "var(--text)",
    margin: "0 0 28px",
    whiteSpace: "pre-wrap",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    borderRadius: 8,
    background: "var(--accent-bg)",
    color: "var(--accent)",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 32,
  },
  actions: {
    display: "flex",
    gap: 12,
    paddingTop: 24,
    borderTop: "1px solid var(--border)",
  },
  editBtn: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "2px solid var(--accent-border)",
    background: "var(--accent-bg)",
    color: "var(--accent)",
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "2px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    fontFamily: "inherit",
    fontSize: 15,
    cursor: "pointer",
  },
};
 
export default EventDetails;