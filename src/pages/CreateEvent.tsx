import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:3001/api";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
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
      const token = localStorage.getItem("token");

      const payload = {
        title: form.title.trim(),
        date: form.date || null,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        organizerId: 1,
      };

      const res = await fetch(`${API}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      navigate(`/events/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center">
          <Link to="/events" className="btn-ghost">
            All Events
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 animate-fade-up">
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-8">
          Create Event
        </h1>

        <div className="card p-8 flex flex-col gap-6">
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="form-input"
          />

          <input
            name="date"
            type="datetime-local"
            value={form.date}
            onChange={handleChange}
            className="form-input"
          />

          <input
            name="location"
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="form-input"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="form-input resize-none"
          />

          {error && <p className="text-red-600">{error}</p>}

          <button onClick={handleSubmit} disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </main>
    </div>
  );
}