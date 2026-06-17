import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import {
  Theater,
  Video,
  Radio,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

type EventStatus = "upcoming" | "today" | "live";

interface ScheduleEvent {
  id: string;
  date: string;
  day: string;
  time: string;
  title: string;
  subtitle: string;
  location?: string;
  status: EventStatus;
  tag?: string;
  link?: string;
}

const theaterShows: ScheduleEvent[] = [
  {
    id: "t1",
    date: "Jun 20",
    day: "Fri",
    time: "18:30 WIB",
    title: "Aitakatta Theater Show",
    subtitle: "JKT48 Theater, FX Sudirman",
    location: "Jakarta",
    status: "upcoming",
    tag: "Setlist A",
  },
  {
    id: "t2",
    date: "Jun 21",
    day: "Sat",
    time: "13:00 WIB",
    title: "Heavy Rotation Special",
    subtitle: "JKT48 Theater, FX Sudirman",
    location: "Jakarta",
    status: "upcoming",
    tag: "Anniversary",
  },
  {
    id: "t3",
    date: "Jun 21",
    day: "Sat",
    time: "18:30 WIB",
    title: "Aitakatta Theater Show",
    subtitle: "JKT48 Theater, FX Sudirman",
    location: "Jakarta",
    status: "upcoming",
    tag: "Setlist B",
  },
  {
    id: "t4",
    date: "Jun 28",
    day: "Sat",
    time: "13:00 WIB",
    title: "Flying Get Theater Show",
    subtitle: "JKT48 Theater, FX Sudirman",
    location: "Jakarta",
    status: "upcoming",
  },
];

const vcSessions: ScheduleEvent[] = [
  {
    id: "v1",
    date: "Jun 18",
    day: "Wed",
    time: "19:00 WIB",
    title: "Video Call Session Round 1",
    subtitle: "Official JKT48 App · 3 min/slot",
    status: "today",
    tag: "LIMITED",
    link: "#",
  },
  {
    id: "v2",
    date: "Jun 22",
    day: "Sun",
    time: "14:00 WIB",
    title: "Video Call Session Round 2",
    subtitle: "Official JKT48 App · 3 min/slot",
    status: "upcoming",
    tag: "50 slots",
    link: "#",
  },
  {
    id: "v3",
    date: "Jun 25",
    day: "Wed",
    time: "20:00 WIB",
    title: "Birthday Video Call Special",
    subtitle: "Official JKT48 App · 5 min/slot",
    status: "upcoming",
    tag: "Special",
    link: "#",
  },
];

const livestreams: ScheduleEvent[] = [
  {
    id: "l1",
    date: "Jun 17",
    day: "Tue",
    time: "21:00 WIB",
    title: "IDN Live — Nightly Talk",
    subtitle: "IDN Live · @jkt48.ribka",
    status: "today",
    tag: "IDN LIVE",
    link: "#",
  },
  {
    id: "l2",
    date: "Jun 19",
    day: "Thu",
    time: "19:30 WIB",
    title: "Showroom Live Session",
    subtitle: "Showroom · Ribka Budiman Official",
    status: "upcoming",
    tag: "SHOWROOM",
    link: "#",
  },
  {
    id: "l3",
    date: "Jun 21",
    day: "Sat",
    time: "22:00 WIB",
    title: "Post-Show IDN Live",
    subtitle: "IDN Live · @jkt48.ribka",
    status: "upcoming",
    tag: "IDN LIVE",
    link: "#",
  },
  {
    id: "l4",
    date: "Jun 24",
    day: "Tue",
    time: "20:30 WIB",
    title: "Showroom Midnight Session",
    subtitle: "Showroom · Ribka Budiman Official",
    status: "upcoming",
    tag: "SHOWROOM",
    link: "#",
  },
];

type Tab = "theater" | "vcall" | "livestream";

const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
  { id: "theater", label: "Theater Shows", icon: <Theater className="w-4 h-4" />, count: theaterShows.length },
  { id: "vcall", label: "Video Call", icon: <Video className="w-4 h-4" />, count: vcSessions.length },
  { id: "livestream", label: "Livestream", icon: <Radio className="w-4 h-4" />, count: livestreams.length },
];

const statusConfig: Record<EventStatus, { label: string; class: string }> = {
  upcoming: { label: "Upcoming", class: "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60" },
  today: { label: "Today", class: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30" },
  live: { label: "● LIVE", class: "bg-[#E21F26]/10 text-[#E21F26] border border-[#E21F26]/30" },
};

function EventCard({ event }: { event: ScheduleEvent }) {
  const cfg = statusConfig[event.status];
  return (
    <div className="group flex gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-[#E21F26]/40 hover:shadow-md dark:hover:shadow-black/40 hover:-translate-y-0.5 transition-all duration-200">
      {/* Date box */}
      <div
        className={`flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center ${
          event.status === "today" || event.status === "live"
            ? "bg-[#E21F26]"
            : "bg-gray-50 dark:bg-white/10 border border-gray-100 dark:border-white/10"
        }`}
      >
        <span
          className={`text-xs font-semibold uppercase tracking-wide ${
            event.status === "today" || event.status === "live" ? "text-white/70" : "text-gray-400"
          }`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {event.day}
        </span>
        <span
          className={`font-extrabold text-lg leading-none ${
            event.status === "today" || event.status === "live" ? "text-white" : "text-[#1a1a1a] dark:text-white"
          }`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {event.date.split(" ")[1]}
        </span>
        <span
          className={`text-xs ${
            event.status === "today" || event.status === "live" ? "text-white/70" : "text-gray-400"
          }`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {event.date.split(" ")[0]}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p
              className="font-bold text-[#1a1a1a] dark:text-white truncate"
              style={{ fontSize: "0.9rem" }}
            >
              {event.title}
            </p>
            <p className="text-gray-500 dark:text-white/50 text-xs mt-0.5">
              {event.subtitle}
            </p>
          </div>
          {event.tag && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                event.status === "today"
                  ? "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
                  : "bg-[#E21F26]/10 text-[#E21F26]"
              }`}
            >
              {event.tag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <div className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3 h-3" />
            <span className="text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {event.time}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1 text-gray-400">
              <MapPin className="w-3 h-3" />
              <span className="text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {event.location}
              </span>
            </div>
          )}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.class}`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Arrow */}
      {event.link && (
        <a
          href={event.link}
          className="flex-shrink-0 self-center w-8 h-8 rounded-full bg-gray-50 dark:bg-white/10 group-hover:bg-[#E21F26] flex items-center justify-center transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-gray-400 dark:text-white/60 group-hover:text-white transition-colors" />
        </a>
      )}
    </div>
  );
}

export function Schedule() {
  const [activeTab, setActiveTab] = useState<Tab>("theater");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      headerRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    if (!listRef.current) return;
    const cards = listRef.current.querySelectorAll(".event-card");
    gsap.fromTo(
      cards,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08 }
    );
  }, [activeTab]);

  const events: Record<Tab, ScheduleEvent[]> = {
    theater: theaterShows,
    vcall: vcSessions,
    livestream: livestreams,
  };

  return (
    <section id="schedule" ref={sectionRef} className="py-24 bg-[#f8f8fa] dark:bg-[#141414] transition-colors">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-[#E21F26]" />
            <span className="text-[#E21F26] text-xs font-bold uppercase tracking-widest">
              Activity
            </span>
          </div>
          <h2
            className="text-[#1a1a1a] dark:text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800 }}
          >
            Upcoming Schedule
          </h2>
          <p
            className="text-gray-500 dark:text-white/50 mt-3 max-w-lg"
            style={{ fontSize: "0.95rem" }}
          >
            Stay up-to-date with all of Ribka's theater performances, fan video calls,
            and live streaming sessions.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#E21F26] text-white shadow-md shadow-[#E21F26]/25 scale-105"
                  : "bg-white dark:bg-white/5 text-gray-600 dark:text-white/70 border border-gray-200 dark:border-white/10 hover:border-[#E21F26]/40"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/50"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Event list */}
        <div ref={listRef} className="flex flex-col gap-3">
          {events[activeTab].map((event) => (
            <div key={event.id} className="event-card">
              <EventCard event={event} />
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-8 flex justify-center">
          <button
            className="flex items-center gap-2 text-[#E21F26] font-semibold text-sm hover:gap-3 transition-all"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            View full calendar
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
