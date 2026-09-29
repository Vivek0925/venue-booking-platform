import {
  ArrowRight,
  ChevronDown,
  Heart,
  MapPin,
  Search,
  Star,
} from "lucide-react";

const categories = [
  "All",
  "Restaurants",
  "Weddings",
  "Parties",
  "Events",
  "Corporate",
];

const venues = [
  {
    name: "The Courtyard",
    location: "Raipur, Chhattisgarh",
    rating: "4.8",
    reviews: "128",
    price: "₹₹",
    type: "Restaurant",
    gradient: "from-[#49225B] via-[#6E3482] to-[#A56ABD]",
  },
  {
    name: "Purple Garden",
    location: "Telibandha, Raipur",
    rating: "4.7",
    reviews: "94",
    price: "₹₹₹",
    type: "Events",
    gradient: "from-[#6E3482] via-[#8C4A9F] to-[#A56ABD]",
  },
  {
    name: "The Grand House",
    location: "VIP Road, Raipur",
    rating: "4.9",
    reviews: "216",
    price: "₹₹₹",
    type: "Wedding",
    gradient: "from-[#49225B] via-[#7D438F] to-[#A56ABD]",
  },
];

function App() {
  return (
    <div className="min-h-screen bg-[#F5EBFA] text-[#24172B]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#E7DBEF]/80 bg-[#F5EBFA]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6E3482] text-lg font-bold text-white shadow-sm">
              V
            </div>

            <span className="text-xl font-bold tracking-[-0.04em] text-[#49225B]">
              Venuz
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#"
              className="text-sm font-medium text-[#49225B]"
            >
              Explore
            </a>

            <a
              href="#"
              className="text-sm font-medium text-[#7B6A83] transition hover:text-[#49225B]"
            >
              Bookings
            </a>

            <a
              href="#"
              className="text-sm font-medium text-[#7B6A83] transition hover:text-[#49225B]"
            >
              List your venue
            </a>
          </nav>

          {/* Location + profile */}
          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[#49225B] transition hover:bg-white sm:flex">
              <MapPin className="h-4 w-4" />
              Raipur
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8C7DF] bg-white text-[#6E3482] shadow-sm">
              <span className="text-xs font-bold">V</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 sm:pt-20 lg:pb-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#A56ABD]">
              Discover something special
            </p>

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-[-0.055em] text-[#49225B] sm:text-5xl lg:text-6xl">
              Find your next
              <span className="block text-[#A56ABD]">
                experience.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#76667D] sm:text-lg">
              Discover venues, events and experiences worth going out for.
            </p>
          </div>

          {/* Search */}
          <div className="mt-9 max-w-3xl">
            <div className="flex items-center gap-3 rounded-2xl border border-[#E0D2E5] bg-white p-2 shadow-[0_12px_40px_rgba(73,34,91,0.08)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5EBFA]">
                <Search className="h-5 w-5 text-[#6E3482]" />
              </div>

              <input
                type="text"
                placeholder="Search venues, events, experiences..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#24172B] outline-none placeholder:text-[#A293AA]"
              />

              <button className="hidden rounded-xl bg-[#6E3482] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#49225B] sm:block">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="border-y border-[#E7DBEF] bg-white/50">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-4 sm:px-8">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  index === 0
                    ? "bg-[#49225B] text-white"
                    : "bg-[#F5EBFA] text-[#6E3482] hover:bg-[#E7DBEF]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Popular venues */}
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A56ABD]">
                Near you
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[#49225B] sm:text-3xl">
                Popular places
              </h2>
            </div>

            <button className="hidden items-center gap-1.5 text-sm font-semibold text-[#6E3482] transition hover:text-[#49225B] sm:flex">
              See all
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Venue cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <article
                key={venue.name}
                className="group overflow-hidden rounded-2xl border border-[#E7DBEF] bg-white shadow-[0_6px_24px_rgba(73,34,91,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(73,34,91,0.12)]"
              >
                {/* Image placeholder */}
                <div
                  className={`relative h-56 overflow-hidden bg-gradient-to-br ${venue.gradient}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.12),transparent_35%)]" />

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#49225B] backdrop-blur">
                    {venue.type}
                  </div>

                  <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#6E3482] backdrop-blur transition hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </button>

                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs font-medium text-white/75">
                      Featured venue
                    </p>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold tracking-[-0.02em] text-[#2B1D31]">
                        {venue.name}
                      </h3>

                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8B7A91]">
                        <MapPin className="h-3.5 w-3.5" />
                        {venue.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-[#F5EBFA] px-2 py-1">
                      <Star className="h-3.5 w-3.5 fill-[#A56ABD] text-[#A56ABD]" />
                      <span className="text-xs font-semibold text-[#49225B]">
                        {venue.rating}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#F0E9F2] pt-4">
                    <span className="text-xs text-[#918397]">
                      {venue.reviews} reviews
                    </span>

                    <span className="text-sm font-semibold text-[#6E3482]">
                      {venue.price}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#49225B] px-7 py-10 sm:px-12 sm:py-12">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#A56ABD]/30 blur-3xl" />

            <div className="relative max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DDBBE9]">
                Have a venue?
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
                Put your place on Venuz.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#D8C4DF]">
                Reach people looking for their next place to celebrate,
                connect and create memories.
              </p>

              <button className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#49225B] transition hover:bg-[#F5EBFA]">
                List your venue
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7DBEF] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-[#89788F] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="font-semibold text-[#49225B]">
            Venuz
          </span>

          <div className="flex gap-5">
            <a href="#" className="hover:text-[#49225B]">
              Terms
            </a>
            <a href="#" className="hover:text-[#49225B]">
              Privacy
            </a>
            <a href="#" className="hover:text-[#49225B]">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;