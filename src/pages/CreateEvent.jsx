import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:3001";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    capacity: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.title.trim()) {
      setError("Event title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        title: form.title.trim(),
        date: form.date || null,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        capacity: form.capacity ? Number(form.capacity) : null,
      };

      const res = await fetch(`${API}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create event");
      }

      const created = await res.json();
      navigate(`/events/${created.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <Link to="/events" className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Events
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 animate-fade-up">
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-8">
          Create Event
        </h1>

        <div className="card p-8 flex flex-col gap-6">

          {/* Title */}
          <div>
            <label className="form-label" htmlFor="title">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Give your event a clear name"
              value={form.title}
              onChange={handleChange}
              className="form-input"
              autoFocus
            />
          </div>

          {/* Date + Capacity row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label" htmlFor="date">
                Date & Time
              </label>
              <input
                id="date"
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="capacity">
                Capacity
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                placeholder="Max attendees (optional)"
                value={form.capacity}
                onChange={handleChange}
                min={1}
                className="form-input"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="Venue name or address"
              value={form.location}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Tell attendees what this event is about…"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="form-input resize-none"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2.5 text-sm text-red-600
                            bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20 18" strokeLinecap="round"/>
                  </svg>
                  Creating…
                </>
              ) : (
                "Create Event"
              )}
            </button>
            <Link to="/events" className="btn-secondary">
              Cancel
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}