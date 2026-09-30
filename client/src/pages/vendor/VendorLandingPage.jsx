// src/pages/VendorLandingPage.jsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Waves,
  Goal,
  Dumbbell,
  Volleyball,
  Gamepad2,
  Flag,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Globe2,
  Camera,
  X,
  Play,
} from "lucide-react";

const VENUE_TYPES = [
  {
    icon: Waves,
    name: "Water Parks",
    desc: "Slot-based entry & seasonal pricing",
  },
  {
    icon: Goal,
    name: "Turf Grounds",
    desc: "Hourly slots & advance reservations",
  },
  {
    icon: Dumbbell,
    name: "Trampoline Parks",
    desc: "Age-based tickets & capacity limits",
  },
  {
    icon: Volleyball,
    name: "Rebound Arenas",
    desc: "Multi-court & tournament scheduling",
  },
  {
    icon: Gamepad2,
    name: "Gaming Zones",
    desc: "Session passes & combo packages",
  },
  { icon: Flag, name: "Play Zones", desc: "Kids tickets & parent bundles" },
];

const STEPS = [
  {
    n: "01",
    title: "Create account",
    desc: "Sign up with your phone — no approvals, no paperwork.",
  },
  {
    n: "02",
    title: "List your venue",
    desc: "Add photos, location, hours, and a short description.",
  },
  {
    n: "03",
    title: "Set slots & pricing",
    desc: "Create ticket types, time slots and availability caps.",
  },
  {
    n: "04",
    title: "Start earning",
    desc: "Customers book online. Payments settle to your bank.",
  },
];

const STATS = [
  ["0%", "Commission first 3 months"],
  ["5 min", "Average time to go live"],
  ["24/7", "Bookings while you sleep"],
  ["₹0", "Setup cost, ever"],
];

export default function VendorLandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#fbf8fd] text-[#24172B]">
      {/* Nav */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#E7DBEF]/80 bg-[#fbf8fd] px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.svg"
            alt="Venuz Logo"
            className="h-7 w-auto object-contain"
          />
          <span className="text-xl font-bold tracking-[-0.04em] text-[#49225B]">
            Venuz
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex w-full flex-col items-center border-b border-[#E7DBEF] bg-[#fbf8fd] px-5 pb-20 pt-24 text-center sm:px-8">
        <Badge
          variant="secondary"
          className="mb-6 gap-1.5 border-[#D8C7DF] bg-white/75 px-3 py-1 text-xs text-[#6E3482]"
        >
          <Sparkles className="h-3.5 w-3.5" /> For Venue Owners
        </Badge>

        <h1 className="mb-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-[-0.055em] text-[#49225B] sm:text-5xl md:text-6xl">
          Your venue. <span className="text-[#A56ABD]">Online</span> in minutes.
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-[#76667D] sm:text-xl">
          No website, no tech team, no problem. List your water park, turf,
          gaming zone or play area and start selling tickets today.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/vendor/apply">
            <Button
              size="lg"
              className="bg-[#6E3482] font-medium text-white shadow-sm shadow-[#D8C7DF] transition-all hover:-translate-y-px hover:bg-[#49225B] hover:shadow-md hover:shadow-[#D8C7DF]"
            >
              Join as a Partner <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-[#D8C7DF] bg-white/60 text-[#49225B] transition-colors hover:border-[#A56ABD] hover:bg-white hover:text-[#6E3482]"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#fbf8fd] px-5 py-6 sm:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
          {STATS.map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-[#E7DBEF] bg-[#F5EBFA]/90 p-5 text-center shadow-[0_6px_24px_rgba(73,34,91,0.05)]"
            >
              <div className="text-2xl font-bold tracking-tight text-[#A56ABD] sm:text-3xl">
                {value}
              </div>
              <div className="mt-1 text-xs font-medium text-[#76667D] sm:text-sm">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Venue types */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-[-0.04em] text-[#49225B] sm:text-3xl">
            Built for every kind of fun venue
          </h2>
          <p className="text-sm text-[#76667D]">
            Everything you need to handle crowds, dynamic slots, and payments.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {VENUE_TYPES.map(({ icon: Icon, name, desc }) => (
            <Card
              key={name}
              className="group border-[#E7DBEF] bg-[#F5EBFA]/90 transition-all duration-200 hover:border-[#D8C7DF] hover:shadow-md hover:shadow-[#D8C7DF]"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5EBFA] transition-colors group-hover:bg-[#E7DBEF]">
                  <Icon className="text-[#6E3482]" size={20} />
                </div>
                <h3 className="mb-1 text-base font-semibold text-[#2B1D31]">
                  {name}
                </h3>
                <p className="text-sm leading-snug text-[#76667D]">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-[#E7DBEF] bg-[#fbf8fd] px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <h2 className="mb-2 text-2xl font-bold tracking-[-0.04em] text-[#49225B] sm:text-3xl">
              Go live in 4 simple steps
            </h2>
            <p className="text-sm text-[#76667D]">
              Zero friction onboarding to start taking online bookings today.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {STEPS.map(({ n, title, desc }) => (
              <Card
                key={n}
                className="border-[#E7DBEF] bg-[#F5EBFA]/90 shadow-[0_6px_24px_rgba(73,34,91,0.05)]"
              >
                <CardContent className="p-5">
                  <span className="mb-3 block font-mono text-4xl font-extrabold text-[#C28BCF]">
                    {n}
                  </span>
                  <h3 className="mb-1.5 text-base font-semibold text-[#2B1D31]">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#76667D]">
                    {desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="mb-3 text-3xl font-bold tracking-[-0.04em] text-[#49225B] sm:text-4xl">
          Ready to fill your venue every day?
        </h2>
        <p className="mx-auto mb-8 max-w-md text-base text-[#76667D]">
          Join hundreds of local venues already growing their ticket sales with
          Venuz.
        </p>
        <Link to="/vendor/apply">
          <Button
            size="lg"
            className="bg-[#6E3482] font-medium text-white shadow-sm shadow-[#D8C7DF] transition-all hover:-translate-y-px hover:bg-[#49225B] hover:shadow-md hover:shadow-[#D8C7DF]"
          >
            Get Started — It's Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto w-full border-t border-neutral-800 bg-black text-neutral-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <a
              href="/"
              aria-label="Venuz home"
              className="flex items-center justify-center gap-3 md:justify-self-start"
            >
              <img src="/logo.svg" alt="Venuz" className="h-10 w-10" />
              <span className="text-2xl font-bold tracking-tight text-white">
                Venuez
              </span>
            </a>

            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium">
              <a
                href="#"
                className="text-neutral-300 transition hover:text-white"
              >
                Terms &amp; Conditions
              </a>
              <a
                href="#"
                className="text-neutral-300 transition hover:text-white"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-neutral-300 transition hover:text-white"
              >
                Contact us
              </a>
              <a
                href="/partner-with-us"
                className="text-neutral-300 transition hover:text-white"
              >
                List your venue
              </a>
            </nav>

            <div className="flex items-center justify-center gap-5 md:justify-self-end">
              {[MessageCircle, Globe2, Camera, X, Play].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label={`Social link ${index + 1}`}
                  className="text-neutral-300 transition hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="my-8 border-t border-neutral-800" />
          <p className="text-center text-xs leading-relaxed text-neutral-400">
            By using this site you agree to our Terms of Service, Cookie Policy,
            Privacy Policy and Content Guidelines. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
