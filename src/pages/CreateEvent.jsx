import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
 
function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    capacity: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
 
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
 
  async function handleSubmit() {
    if (!form.title.trim()) {
      setMessage("Title is required.");
      return;
    }
 
    setLoading(true);
    setMessage("");
 
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          capacity: form.capacity ? Number(form.capacity) : undefined,
        }),
      });
 
      const data = await response.json();
 
      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }
 
      navigate(`/events/${data.id}`);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }
 
  return (
    <div style={styles.page}>
      <Link to="/events" style={styles.back}>← Back to Events</Link>
 
      <h1 style={styles.title}>Create Event</h1>
 
      <div style={styles.card}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Title *</label>
          <input
            name="title"
            type="text"
            placeholder="Event title"
            value={form.title}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
 
        <div style={styles.row}>
          <div style={{ ...styles.fieldGroup, flex: 1 }}>
            <label style={styles.label}>Date & Time</label>
            <input
              name="date"
              type="datetime-local"
              value={form.date}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
 
          <div style={{ ...styles.fieldGroup, flex: 1 }}>
            <label style={styles.label}>Capacity</label>
            <input
              name="capacity"
              type="number"
              placeholder="e.g. 100"
              value={form.capacity}
              onChange={handleChange}
              min={1}
              style={styles.input}
            />
          </div>
        </div>
 
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Location</label>
          <input
            name="location"
            type="text"
            placeholder="Venue or address"
            value={form.location}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
 
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            placeholder="Tell people about this event…"
            value={form.description}
            onChange={handleChange}
            rows={5}
            style={{ ...styles.input, ...styles.textarea }}
          />
        </div>
 
        {message && <p style={styles.message}>{message}</p>}
 
        <div style={styles.actions}>
          <button
            style={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating…" : "Create Event"}
          </button>
          <button
            style={styles.cancelBtn}
            onClick={() => navigate("/events")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
 
const styles = {
  page: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "48px 32px",
    textAlign: "left",
  },
  back: {
    display: "inline-block",
    marginBottom: 24,
    color: "var(--text)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  },
  title: {
    margin: "0 0 32px",
    fontSize: 40,
    letterSpacing: "-1px",
    color: "var(--text-h)",
    fontWeight: 500,
  },
  card: {
    padding: 40,
    borderRadius: 16,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  row: {
    display: "flex",
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text-h)",
    letterSpacing: "0.02em",
  },
  input: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text-h)",
    fontFamily: "inherit",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    resize: "vertical",
    lineHeight: "150%",
  },
  message: {
    margin: 0,
    fontSize: 14,
    color: "var(--accent)",
    padding: "10px 14px",
    borderRadius: 8,
    background: "var(--accent-bg)",
  },
  actions: {
    display: "flex",
    gap: 12,
    paddingTop: 8,
  },
  submitBtn: {
    padding: "11px 24px",
    borderRadius: 8,
    border: "2px solid var(--accent-border)",
    background: "var(--accent-bg)",
    color: "var(--accent)",
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  cancelBtn: {
    padding: "11px 24px",
    borderRadius: 8,
    border: "2px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    fontFamily: "inherit",
    fontSize: 15,
    cursor: "pointer",
  },
};
 
export default CreateEvent;