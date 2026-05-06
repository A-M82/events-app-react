import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:3001/api";

interface Event {
  id: number;
  title: string;
  date: string | null;
  location: string | null;
  description: string | null;
  capacity?: number | null;
}

interface EventsResponse {
  results: Event[];
}

interface FormattedDate {
  month: string;
  day: number;
  weekday: string;
  time: string;
}

interface EventCardProps {
  event: Event;
  index: number;
}

function formatDate(dateStr: string | null): FormattedDate | null {
  if (!dateStr) return null;

  const d = new Date(dateStr);

  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate(),
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    time: d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function EventCard({ event, index }: EventCardProps) {
  const date = formatDate(event.date);

  return (
    <Link
      to={`/events/${event.id}`}
      className="card group flex gap-5 p-5 hover:shadow-card-hover hover:border-brand-100 transition-all duration-200 no-underline"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {date && (
        <div className="flex-shrink-0 w-14 flex flex-col items-center justify-center bg-brand-50 rounded-xl py-2 px-1 border border-brand-100">
          <span className="text-[10px] font-bold tracking-widest text-brand-400 leading-none mb-1">
            {date.month}
          </span>
          <span className="text-2xl font-display font-bold text-brand-600 leading-none">
            {date.day}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h2 className="text-base font-display font-semibold text-slate-900 mb-1 truncate group-hover:text-brand-600 transition-colors duration-150">
          {event.title}
        </h2>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-2">
          {date && (
            <span className="flex items-center gap-1">
              <ClockIcon />
              {date.weekday} · {date.time}
            </span>
          )}

          {event.location && (
            <span className="flex items-center gap-1">
              <PinIcon />
              {event.location}
            </span>
          )}

          {event.capacity && (
            <span className="flex items-center gap-1">
              <PeopleIcon />
              {event.capacity} spots
            </span>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
            {event.description}
          </p>
        )}
      </div>

      <div className="flex-shrink-0 self-center text-slate-300 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all duration-150">
        <ArrowIcon />
      </div>
    </Link>
  );
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/events`);

        if (!res.ok) {
          throw new Error("Failed to load events");
        }

        const data: EventsResponse = await res.json();
        setEvents(data.results);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
            Events
          </span>

          <button
            onClick={() => navigate("/events/create")}
            className="btn-primary"
          >
            <PlusIcon />
            New Event
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 flex gap-5 animate-pulse">
                <div className="w-14 h-16 rounded-xl bg-slate-100 flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="card p-6 text-center border-red-100">
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <p className="text-xs text-slate-400 mt-1">
              Make sure your local API is running:{" "}
              <code className="bg-slate-100 px-1 rounded">
                npm run dev in events-api
              </code>
            </p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="card p-16 text-center">
            <div className="text-4xl mb-4">📅</div>

            <h3 className="font-display font-semibold text-slate-700 text-lg mb-2">
              No events yet
            </h3>

            <p className="text-sm text-slate-400 mb-6">
              Get started by creating your first event.
            </p>

            <button
              onClick={() => navigate("/events/create")}
              className="btn-primary mx-auto"
            >
              Create Event
            </button>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
              {events.length} event{events.length !== 1 ? "s" : ""}
            </p>

            <div className="flex flex-col gap-3 animate-fade-up">
              {events.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 3v10M3 8h10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 5v3.5l2 1.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 1.5a4 4 0 0 1 4 4c0 3-4 9-4 9S4 8.5 4 5.5a4 4 0 0 1 4-4Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="8" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const PeopleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M1.5 13c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11 7a2 2 0 1 0 0-4M14 13a3 3 0 0 0-3-3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);