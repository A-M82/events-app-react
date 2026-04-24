import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
 
const API = "http://localhost:3001";
 
export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
 
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);
 
  async function handleDelete() {
    if (!window.confirm("Delete this event? This can't be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      navigate("/events");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }
 
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }
 
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500 font-medium">{error}</p>
        <Link to="/events" className="btn-secondary">← Back to Events</Link>
      </div>
    );
  }
 
  const date = event?.date ? new Date(event.date) : null;
 
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/events" className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Events
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-ghost text-red-400 hover:text-red-600"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </header>
 
      <main className="max-w-3xl mx-auto px-6 py-10 animate-fade-up">
        <div className="card overflow-hidden">
 
          {/* Color header band */}
          <div className="h-2 bg-gradient-to-r from-brand-400 to-brand-600" />
 
          <div className="p-8">
            {/* Meta row */}
            <div className="flex flex-wrap gap-3 mb-5">
              {date && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                 bg-brand-50 text-brand-600 border border-brand-100 px-3 py-1.5 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <rect x="1.5" y="3.5" width="13" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 1.5v2M11 1.5v2M1.5 7.5h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </span>
              )}
              {date && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                 bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1.5 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              {event.location && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                 bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1.5 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.5a4 4 0 0 1 4 4c0 3-4 9-4 9S4 8.5 4 5.5a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {event.location}
                </span>
              )}
              {event.capacity && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold
                                 bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1.5 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M1.5 13c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M11 7a2 2 0 1 0 0-4M14 13a3 3 0 0 0-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {event.capacity} spots
                </span>
              )}
            </div>
 
            {/* Title */}
            <h1 className="font-display font-bold text-3xl text-slate-900 leading-tight mb-6">
              {event.title}
            </h1>
 
            {/* Description */}
            {event.description ? (
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">No description provided.</p>
            )}
          </div>
 
          {/* Footer */}
          <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <Link to="/events" className="btn-secondary">
              ← All Events
            </Link>
            <Link to={`/events/create`} className="btn-primary">
              + New Event
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}