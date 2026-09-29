import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CalendarX2,
  CheckCircle2,
  Clock3,
  MapPin,
  ReceiptText,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getBookingHistory } from "@/api/user.api";

const STATUS_STYLES = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending_payment: "bg-amber-50 text-amber-700 ring-amber-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
};

const toTitle = (value = "") =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

function formatDate(value) {
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value) {
  if (!value) return null;
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatAmount(value) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

function BookingCard({ booking }) {
  const time = booking.startTime
    ? `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`
    : "Whole day booking";
  const statusClass =
    STATUS_STYLES[booking.bookingStatus] ??
    "bg-slate-100 text-slate-600 ring-slate-200";

  return (
    <article className="rounded-2xl border border-[#eadff2] bg-white p-5 shadow-[0_10px_30px_rgba(71,31,94,0.06)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ac5abb]">
            {toTitle(booking.venueCategory)}
          </p>
          <h2 className="mt-1 truncate text-xl font-semibold text-[#2b1935]">
            {booking.venueName}
          </h2>
          <p className="mt-1 text-xs text-[#9a8ba0]">
            Booking ID: {booking.bookingId}
          </p>
        </div>
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass}`}
        >
          {toTitle(booking.bookingStatus)}
        </span>
      </div>

      <div className="mt-6 grid gap-4 border-t border-[#f1eaf4] pt-5 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#9c4db2]" />
          <div>
            <p className="text-xs text-[#918198]">Date</p>
            <p className="mt-1 text-sm font-medium text-[#38253f]">
              {formatDate(booking.bookingDate)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#9c4db2]" />
          <div>
            <p className="text-xs text-[#918198]">Schedule</p>
            <p className="mt-1 text-sm font-medium text-[#38253f]">{time}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ReceiptText className="mt-0.5 h-4 w-4 shrink-0 text-[#9c4db2]" />
          <div>
            <p className="text-xs text-[#918198]">Total paid</p>
            <p className="mt-1 text-sm font-semibold text-[#38253f]">
              {formatAmount(booking.totalAmount)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function BookingSkeleton() {
  return <div className="h-52 animate-pulse rounded-2xl bg-white/70" />;
}

export default function VenueBookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getBookingHistory()
      .then((data) => {
        if (isMounted) setBookings(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isMounted) setError("We could not load your bookings right now.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="min-h-[calc(100vh-62px)] bg-[#fbf8fd]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-12">
        <div className="relative mb-8 overflow-hidden rounded-[28px] bg-[#f5eafd] px-6 py-8 sm:px-10 sm:py-9">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#b466bd]">
              Your plans
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[#281536] sm:text-5xl">
              Booking <span className="text-[#8f35a5]">history</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#817287]">
              Keep track of your venue reservations, schedules, and payment
              details.
            </p>
          </div>
          <div className="absolute -right-8 -top-20 h-64 w-64 rounded-full bg-[#ead9fa]" />
          <div className="absolute right-14 top-8 hidden rotate-[-8deg] rounded-2xl border border-white/70 bg-white/65 p-5 shadow-[0_12px_25px_rgba(128,55,158,0.12)] sm:block">
            <CalendarDays className="h-12 w-12 text-[#9339aa]" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }, (_, index) => (
                <span
                  key={index}
                  className={`h-4 w-4 rounded bg-[#eadcf7] ${index === 4 ? "bg-[#9f45b5]" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {[
            ["All bookings", CalendarDays],
            ["Upcoming", Clock3],
            ["Completed", CheckCircle2],
            ["Cancelled", XCircle],
          ].map(([label, Icon], index) => (
            <button
              key={label}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${index === 0 ? "border-[#8f35a5] bg-[#8f35a5] text-white shadow-[0_5px_15px_rgba(143,53,165,0.2)]" : "border-[#eadcf2] bg-white text-[#765d81] hover:border-[#cda4d9]"}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!error && loading && (
          <div className="space-y-4">
            <BookingSkeleton />
            <BookingSkeleton />
          </div>
        )}

        {!error && !loading && bookings.length === 0 && (
          <div className="rounded-2xl border border-[#eadff2] bg-white px-6 py-12 text-center shadow-[0_8px_25px_rgba(71,31,94,0.04)] sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0ddf8] text-[#983eb0]">
              <CalendarX2 className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[#2b1935]">
              No bookings yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#8c7c91]">
              Your venue reservations will appear here after you make a booking.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#8f35a5] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(143,53,165,0.2)] transition hover:bg-[#742b89]"
            >
              Explore venues <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {!error && !loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.bookingId} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
