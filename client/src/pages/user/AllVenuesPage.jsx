import { useEffect, useState } from "react";
import { ArrowRight, Check, Heart, MapPin, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { getVenues } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const toTitle = (value = "") =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatPrice = (value) => {
  if (value === null || value === undefined) return "Price unavailable";
  return `From ₹${Number(value).toLocaleString("en-IN")}`;
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85";

function VenueCard({ venue }) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-[#eee5f4] bg-white shadow-[0_8px_28px_rgba(65,32,87,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(65,32,87,0.12)]">
      <Link to={`/venues/${venue.id}`} className="block overflow-hidden">
        <div className="relative aspect-[1.45/1] overflow-hidden bg-[#eee4f5]">
          <img
            src={venue.cover_img_url}
            alt={venue.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#48245e] backdrop-blur">
            {toTitle(venue.category)}
          </span>
          <button
            type="button"
            aria-label={`Save ${venue.name}`}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#6c4a7c] backdrop-blur transition hover:bg-white hover:text-[#48245e]"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </Link>

      <CardContent className="gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold tracking-[-0.02em] text-[#281b30]">
              {venue.name}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#8a7d91]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9b5fb2]" />
              {venue.district}, {venue.state}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-[#f7effa] px-2 py-1 text-xs font-semibold text-[#48245e]">
            <Star className="h-3 w-3 fill-[#c27ac8] text-[#c27ac8]" /> 4.8
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-[#f0eaf2] pt-3">
          <span className="text-xs text-[#918396]">
            {toTitle(venue.bookingType)}
          </span>
          <span className="text-sm font-semibold text-[#48245e]">
            {formatPrice(venue.startingPrice)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function VenueSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-white">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <CardContent className="gap-4 p-5">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export default function AllVenuesPage() {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getVenues()
      .then((data) => {
        if (isMounted) setVenues(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (isMounted) setError("We could not load venues right now.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="overflow-hidden bg-[#fbf8fd] text-[#281b30]">
      <section className="relative mx-auto grid min-h-[calc(100svh-70px)] w-full max-w-7xl items-center gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pt-12 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:pb-14 lg:pt-14">
        <div className="relative z-10">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#b66ab9]">
            Raipur's venue discovery
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.06] tracking-[-0.055em] text-[#48245e] sm:text-6xl">
            Find your next{" "}
            <span className="block">
              experience in <span className="text-[#bd6fc0]">Raipur.</span>
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-[#817484] sm:text-base">
            Discover and book amazing venues for weddings, parties, corporate
            events, sports, getaways and more, all in one place.
          </p>
          <div className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-[#eadff0] bg-white p-2 shadow-[0_12px_32px_rgba(83,40,102,0.08)]">
            <Search className="ml-3 h-5 w-5 shrink-0 text-[#a36aae]" />
            <input
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-[#aaa0ae]"
              placeholder="Search venues, events, or locations in Raipur..."
            />
            <button className="hidden items-center gap-1 border-l border-[#eee4f2] px-3 py-2 text-xs font-semibold text-[#6e5878] sm:flex">
              <MapPin className="h-4 w-4 text-[#a05db0]" /> Raipur{" "}
              <ArrowRight className="h-3 w-3 rotate-90" />
            </button>
            <Button className="rounded-xl bg-[#48245e] px-5 text-sm hover:bg-[#32153f]">
              Search
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "All",
              "Resorts",
              "Water Parks",
              "Cricket Turf",
              "Banquet Halls",
              "Restaurants",
              "More",
            ].map((item, index) => (
              <button
                key={item}
                className={`rounded-full border px-3 py-2 text-[14px] font-semibold ${index === 0 ? "border-[#48245e] bg-[#48245e] text-white" : "border-[#eadcf0] bg-white/70 text-[#6f5879]"}`}
              >
                {index === 0 ? "⌕ " : ""}
                {item}
              </button>
            ))}
          </div>
        </div>
        {venues[0]?.cover_img_url || HERO_IMAGE ? (
          <div className="relative mx-auto w-full max-w-[520px] lg:justify-self-end">
            <div className="absolute -inset-5 rounded-[35%] bg-[#f1dff4] blur-2xl" />
            <img
              src={venues[0]?.cover_img_url || HERO_IMAGE}
              alt="Featured venue"
              className="relative aspect-[1.15/0.82] w-full rounded-[28px] object-cover shadow-[0_20px_45px_rgba(77,35,93,0.18)]"
            />
          </div>
        ) : (
          <div className="aspect-[1.15/0.82] rounded-[28px] bg-[#f1dff4]" />
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b66ab9]">
              Curated for you
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#48245e] sm:text-3xl">
              Top venues in Raipur
            </h2>
          </div>
          <button className="hidden items-center gap-1 text-xs font-semibold text-[#7d4b91] sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 6 }, (_, index) => (
              <VenueSkeleton key={index} />
            ))}
          </div>
        )}

        {!error && !isLoading && venues.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No venues are available yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Check back soon for new places to book.
            </p>
          </div>
        )}

        {!error && !isLoading && venues.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8 lg:pb-20">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b66ab9]">
            Make it memorable
          </p>
          <h2 className="mt-2 max-w-md text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#48245e]">
            Perfect venues for every occasion
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#817484]">
            From intimate dinners to grand celebrations, find a space that feels
            made for your people.
          </p>
          <Button className="mt-6 rounded-xl bg-[#48245e] text-sm hover:bg-[#32153f]">
            Explore occasions <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        {venues[1]?.cover_img_url ? (
          <img
            src={venues[1].cover_img_url}
            alt="A venue set for an occasion"
            className="aspect-[1.7/0.85] w-full rounded-2xl object-cover shadow-[0_16px_35px_rgba(77,35,93,0.12)]"
          />
        ) : null}
      </section>

      <section className="bg-[#fbf8fd]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-9 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            ["Verified venues", "Trusted and reviewed"],
            ["Easy booking", "Quick and hassle-free"],
            ["Secure payments", "Safe and encrypted"],
            ["Local experiences", "Curated for Raipur"],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#E7DBEF] bg-[#F5EBFA]/90 p-5 shadow-[0_6px_24px_rgba(73,34,91,0.05)]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2ddf7] text-[#8d3ca7]">
                <Check className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-[#48245e]">{title}</p>
              <p className="mt-1 text-xs text-[#8c7c91]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="relative overflow-hidden rounded-2xl bg-[#4d165f] px-7 py-9 text-white shadow-[0_16px_38px_rgba(77,22,95,0.2)] sm:px-12 sm:py-11">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#a446b0]/35 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#e4b9ed]">
                Have a venue?
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                List it on Venuz.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#e8d7ec]">
                Reach thousands of customers looking for the perfect venue. Easy
                listing, full control, and zero hassle.
              </p>
              <Button
                asChild
                className="mt-6 rounded-xl bg-white text-[#4d165f] hover:bg-[#f8edfa]"
              >
                <Link to="/partner-with-us">
                  List your venue <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ["10K+", "Happy Customers"],
                ["500+", "Venues Listed"],
                ["4.8", "Average Rating"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl bg-white px-3 py-4 text-center text-[#48245e] sm:min-w-28 sm:px-5"
                >
                  <p className="text-lg font-bold">{value}</p>
                  <p className="mt-1 text-[10px] text-[#8b7592]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
