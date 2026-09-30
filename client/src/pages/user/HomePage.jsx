"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Search,
  User,
  Menu,
  Globe2,
  Camera,
  Play,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getMe, logout } from "@/api/user.api";
import Logo from "@/assets/logo.svg";

const CITIES = [
  { city: "Raipur", state: "Chhattisgarh" },
  { city: "Gurugram", state: "Haryana" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Bengaluru", state: "Karnataka" },
];

const FOOTER_LINKS = [
  { label: "Terms & Conditions" },
  { label: "Privacy Policy" },
  { label: "Contact us" },
  { label: "List your venue", href: "/partner-with-us" },
];

function UserAvatar({ email }) {
  const initial = email?.trim().charAt(0).toUpperCase();

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
      {initial}
    </span>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.9 2h3.3l-7.2 8.3L23.5 22h-6.6l-5.2-6.8L5.8 22H2.5l7.7-8.8L1.5 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z" />
    </svg>
  );
}

function SiteHeader({ location, onLocationChange }) {
  const [user, setUser] = useState(null);
  const [showCities, setShowCities] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    let isMounted = true;

    getMe()
      .then((data) => {
        if (isMounted) setUser(data);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#eee5f2] bg-[#fffdfd]/95 backdrop-blur">
        <div className="mx-auto flex h-[62px] w-full max-w-[1200px] items-center gap-4 px-4 sm:px-6 lg:gap-5 lg:px-7">
          <a href="/" aria-label="Venuz home" className="shrink-0">
            <span className="inline-flex items-center gap-2.5">
              <img src={Logo} alt="Venuz" className="h-8 w-8" />
              <span className="text-[18px] font-bold tracking-[-0.03em] text-[#281b30]">
                Venuez
              </span>
            </span>
          </a>

          <Separator orientation="vertical" className="hidden h-7 lg:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group hidden items-center gap-2 rounded-md px-1 py-1 text-left sm:flex">
                <MapPin className="h-[18px] w-[18px] text-[#9c55ad]" />
                <span className="leading-tight">
                  <span className="flex items-center gap-1 text-[15px] font-semibold text-[#33243b]">
                    {location.city}
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 transition group-data-[state=open]:rotate-180" />
                  </span>
                  <span className="block text-[10px] text-[#8b7c91]">
                    {location.state}
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="font-normal text-muted-foreground">
                Choose your city
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {CITIES.map((city) => (
                <DropdownMenuItem
                  key={city.city}
                  onClick={() => onLocationChange(city)}
                  className="flex-col items-start gap-0"
                >
                  <span className="text-sm font-medium">{city.city}</span>
                  <span className="text-xs text-muted-foreground">
                    {city.state}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <nav className="hidden h-full items-center justify-center gap-6 lg:flex lg:flex-1">
            {[
              { label: "Explore", href: "/" },
              { label: "Events", href: "/" },
              { label: "Weddings", href: "/" },
              { label: "Sports", href: "/" },
              { label: "Restaurants", href: "/" },
              { label: "List your venue", href: "/partner-with-us" },
            ].map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                className={`relative flex h-full items-center whitespace-nowrap pt-px text-[15px] font-semibold transition hover:text-[#48245e] ${index === 0 ? "text-[#48245e] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#b55bc4]" : "text-[#8a7891]"}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-[#f4e8f8]"
            >
              <Search className="h-[18px] w-[18px] text-[#8a3cff]" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Account"
                  className="h-9 w-9 rounded-full bg-[#f0e2ff] p-0 hover:bg-[#e8d5ff]"
                >
                  {user ? (
                    <UserAvatar email={user.email} />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/bookings">My bookings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Help</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Sign in</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookings">My bookings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Help</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-[#6E3482] hover:bg-[#f4e8f8] lg:hidden"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[min(20rem,calc(100vw-1rem))] rounded-l-2xl border-[#e7dbef] bg-[#fbf8fd] px-5 py-6"
              >
                <nav className="mt-7 flex flex-col border-b border-[#eee5f2] pb-5">
                  {[
                    { label: "Explore", href: "/" },
                    { label: "Events", href: "/" },
                    { label: "Weddings", href: "/" },
                    { label: "Sports", href: "/" },
                    { label: "Restaurants", href: "/" },
                    { label: "List your venue", href: "/partner-with-us" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-[#49225B] transition hover:bg-[#f4e8f8]"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <div className="mt-5">
                  <button
                    type="button"
                    aria-expanded={showCities}
                    onClick={() => setShowCities((open) => !open)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition hover:bg-[#f4e8f8]"
                  >
                    <span>
                      <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-[#8b7c91]">
                        Location
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-[#49225B]">
                        {location.city}
                        <span className="ml-1 font-normal text-[#8b7c91]">
                          {location.state}
                        </span>
                      </span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#6E3482] transition-transform ${
                        showCities ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showCities && (
                    <div className="mt-2 space-y-1 border-t border-[#eee5f2] pt-2">
                      {CITIES.filter((city) => city.city !== location.city).map(
                        (city) => (
                          <SheetClose asChild key={city.city}>
                            <button
                              type="button"
                              onClick={() => {
                                onLocationChange(city);
                                setShowCities(false);
                              }}
                              className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#6E3482] transition hover:bg-[#f4e8f8]"
                            >
                              <span className="block font-medium">
                                {city.city}
                              </span>
                              <span className="block text-xs text-[#8b7c91]">
                                {city.state}
                              </span>
                            </button>
                          </SheetClose>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="w-full border-t border-[#35213d] bg-[#170d1d] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <a
            href="/"
            aria-label="Venuz home"
            className="flex flex-col items-start gap-4"
          >
            <span className="flex items-center gap-3">
              <img src={Logo} alt="Venuz" className="h-10 w-10" />
              <span className="text-2xl font-bold tracking-tight">Venuez</span>
            </span>
            <span className="max-w-xs text-sm leading-6 text-white">
              Discover and book memorable local experiences, all in one place.
            </span>
          </a>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#bd6fc0]">
              Explore
            </p>
            <nav className="flex flex-col items-start gap-3 text-sm">
              <a href="/" className="text-white transition hover:text-white">
                All venues
              </a>
              <a href="/" className="text-white transition hover:text-white">
                Experiences
              </a>
              <a
                href="/bookings"
                className="text-white transition hover:text-white"
              >
                My bookings
              </a>
            </nav>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#bd6fc0]">
              For venues
            </p>
            <nav className="flex flex-col items-start gap-3 text-sm">
              <a
                href="/partner-with-us"
                className="text-white transition hover:text-white"
              >
                List your venue
              </a>
              <a
                href="/vendor/apply"
                className="text-white transition hover:text-white"
              >
                Become a partner
              </a>
              <a href="#" className="text-white transition hover:text-white">
                Partner support
              </a>
            </nav>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#bd6fc0]">
              Connect
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: MessageCircle, label: "WhatsApp", href: "#" },
                { Icon: Globe2, label: "Facebook", href: "#" },
                { Icon: Camera, label: "Instagram", href: "#" },
                { Icon: XIcon, label: "X", href: "#" },
                { Icon: Play, label: "YouTube", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-white transition hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-[#35213d]" />
        <div className="flex flex-col gap-4 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Venuz. Built for better days out.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_LINKS.slice(0, 2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a href="#" className="text-white transition hover:text-white">
              Cookie policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage({ children }) {
  const [location, setLocation] = useState(CITIES[0]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5ff]">
      <SiteHeader location={location} onLocationChange={setLocation} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export { SiteHeader, SiteFooter };
