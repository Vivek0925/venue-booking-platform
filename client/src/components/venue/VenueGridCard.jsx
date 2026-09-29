import { useState } from "react";
import { Building2, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/90 text-white backdrop-blur-md",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-500/90 text-white backdrop-blur-md",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-500/90 text-white backdrop-blur-md",
  },
  live: {
    label: "Live",
    className: "bg-emerald-500/90 text-white backdrop-blur-md",
  },
  draft: {
    label: "Draft",
    className: "bg-slate-500/90 text-white backdrop-blur-md",
  },
  suspended: {
    label: "Suspended",
    className: "bg-rose-500/90 text-white backdrop-blur-md",
  },
};

function formatDateTime(value) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function toTitleCase(value = "") {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function VenueGridCard({ venue, onClick, metaText }) {
  const [imgFailed, setImgFailed] = useState(false);
  const status = STATUS_CONFIG[venue.status] || {
    label: toTitleCase(venue.status || "Unknown"),
    className: "bg-slate-500/90 text-white backdrop-blur-md",
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-slate-100">
        {venue.coverImage && !imgFailed ? (
          <img
            src={venue.coverImage}
            alt={venue.name}
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
            <Building2 className="h-10 w-10 text-slate-300 transition-transform duration-500 group-hover:scale-110" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <Badge
            className={`border-0 px-2 py-0.5 text-[10px] font-semibold tracking-wider ${status.className}`}
          >
            {status.label}
          </Badge>
          <Badge className="border-0 bg-black/60 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase">
            {venue.category}
          </Badge>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-col p-4">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
          <MapPin className="h-3 w-3 shrink-0 text-indigo-500" />
          <span className="truncate">
            {venue.district}, {venue.state}
          </span>
        </div>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors">
          {venue.name}
        </h3>
        <p className="mt-1 text-[11px] font-medium text-slate-400">
          {metaText ?? `Submitted: ${formatDateTime(venue.submittedAt)}`}
        </p>
      </div>
    </div>
  );
}

export function VenueGridCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-4/5 w-full rounded-2xl" />
      <div className="mt-3 space-y-2 px-0.5">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
